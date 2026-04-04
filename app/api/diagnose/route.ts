import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// IP別レート制限: { ip -> タイムスタンプ[] }
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1時間

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(t => now - t < WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) return false;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

const AXIS_VALID_VALUES = {
  F: ['R', 'A'] as const,
  A: ['L', 'G'] as const,
  C: ['O', 'S'] as const,
  E: ['H', 'M'] as const,
};

interface DiagnoseResult {
  F: 'R' | 'A';
  A: 'L' | 'G';
  C: 'O' | 'S';
  E: 'H' | 'M';
}

interface DiagnoseReasons {
  F: string;
  A: string;
  C: string;
  E: string;
}

const PROMPT = `あなたは顔相分析の専門家です。この顔写真を分析して、FACE CODEシステムに基づいて4つの軸を判定してください。

【F軸（Flow）— おでこ＋目の大きさ＋口の大きさで判定】
発信型（R）の特徴：
- おでこが広い → 外交的・リーダー気質
- 目が大きい → 開放的・積極的
- 口が大きい → 行動力・エネルギッシュ

吸収型（A）の特徴：
- おでこが狭い → 内向的・単独行動好き
- 目が小さい → 意志強い・慎重
- 口が小さい → 消極的・集中力高い

【A軸（Affection）— 目の形＋唇の厚さ＋口角で判定】
情熱型（L）の特徴：
- たれ目 → 温厚・愛されキャラ・感情表現豊か
- 唇が厚い → 愛情深い・情に厚い
- 口角が上がっている → 積極的・前向き

秘愛型（G）の特徴：
- つり目 → 誠実・弱みを見せない・芯が強い
- 唇が薄い → 冷静・感情に流されにくい
- 口角が平行〜下がり気味 → 慎重・自分に厳しい

【C軸（Connection）— 眉の形・濃さ＋眉間の広さ＋耳の大きさで判定】
開放型（O）の特徴：
- アーチ型の眉 → 協調性高い・周囲と調和
- 眉間が広い → 心に余裕・柔軟な思考
- 大きい耳 → 社交的・人の話をよく聞く

選縁型（S）の特徴：
- 直線的・角のある眉 → 意志強い・自分の考えを貫く
- 眉間が狭い → 集中力高い・こだわり強い
- 小さい耳 → 独立心旺盛・芸術家肌

【E軸（Emotion）— 鼻の形・高さ＋眉の濃さ＋黒目の割合で判定】
直感型（H）の特徴：
- 丸みのある鼻先 → 穏やか・人当たりよい
- 薄い眉 → 繊細・感性豊か
- 黒目が大きい → やわらかい雰囲気・感受性豊か

意志型（M）の特徴：
- 高い鼻・通った鼻筋 → 目標に向かって努力・信頼される
- 濃い眉 → 行動力・気持ちが安定・情熱的
- 白目が多め → 洞察力鋭い・人との距離感を大切にする

【出力形式】
以下のJSON形式のみで回答してください（説明・コメント不要）：
{"F":"?","A":"?","C":"?","E":"?","reasons":{"F":"判定根拠の説明","A":"判定根拠の説明","C":"判定根拠の説明","E":"判定根拠の説明"}}

F は R か A、A は L か G、C は O か S、E は H か M のいずれかを入れてください。

各軸のreasonには、その軸で使う全パーツの観察結果を必ず含めてください：
- F のreason：おでこの広さ・目の大きさ・口の大きさの3点すべてに言及すること
- A のreason：目の形（たれ目/つり目）・唇の厚さ・口角の向きの3点すべてに言及すること
- C のreason：眉の形・眉間の広さ・耳の大きさの3点すべてに言及すること
- E のreason：鼻の形と高さ・眉の濃さ・黒目と白目の割合の3点すべてに言及すること`;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: '診断は1時間に3回までご利用いただけます' },
      { status: 429 },
    );
  }

  try {
    const { image } = await request.json();

    if (!image || typeof image !== 'string') {
      return Response.json({ error: '画像データが必要です' }, { status: 400 });
    }

    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return Response.json({ error: '無効な画像フォーマットです' }, { status: 400 });
    }
    const [, rawMediaType, base64Data] = match;

    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
    type SupportedMediaType = typeof supportedTypes[number];
    if (!supportedTypes.includes(rawMediaType as SupportedMediaType)) {
      return Response.json({ error: 'JPEG・PNG・GIF・WebP のみ対応しています' }, { status: 400 });
    }
    const mediaType = rawMediaType as SupportedMediaType;

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data },
            },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
    if (!textBlock) {
      throw new Error('APIからテキスト応答が返されませんでした');
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('判定結果のJSONが見つかりませんでした');
    }

    const raw = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    const axes = ['F', 'A', 'C', 'E'] as const;

    for (const axis of axes) {
      const valid = AXIS_VALID_VALUES[axis] as readonly string[];
      if (!valid.includes(raw[axis] as string)) {
        throw new Error(`${axis}軸の判定値が不正です: ${raw[axis]}`);
      }
    }

    const breakdown = {
      F: raw['F'] as DiagnoseResult['F'],
      A: raw['A'] as DiagnoseResult['A'],
      C: raw['C'] as DiagnoseResult['C'],
      E: raw['E'] as DiagnoseResult['E'],
    };
    const reasons = raw['reasons'] as DiagnoseReasons | undefined;
    const code = `${breakdown.F}${breakdown.A}${breakdown.C}${breakdown.E}`;

    // ── 診断ログをSupabaseに記録（失敗してもレスポンスは返す）──
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase.from('diagnoses').insert({ type_code: code });
    } catch (logError) {
      console.error('診断ログ記録エラー:', logError);
    }

    return Response.json({ code, breakdown, reasons });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return Response.json(
        { error: `Claude APIエラー: ${error.message}` },
        { status: error.status ?? 500 },
      );
    }
    const message = error instanceof Error ? error.message : '不明なエラーが発生しました';
    return Response.json({ error: message }, { status: 500 });
  }
}

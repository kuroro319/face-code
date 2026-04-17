import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { TYPE_NAMES } from '@/lib/face-types'

// Claude API (max_tokens:8000) は 60〜120 秒かかる場合がある
export const maxDuration = 120

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ALL_TYPES = Object.entries(TYPE_NAMES)
  .map(([code, name]) => `${code}(${name})`)
  .join('、')

function buildPrompt(code: string, typeName: string, plan: string, moleMeta?: string): string {
  const base = `あなたはFACE CODEシステムの専門家です。
診断コード「${code}」（${typeName}タイプ）の人向けに、以下のコンテンツを日本語で生成してください。
文体は親しみやすく、具体的に書いてください。

`

  const compatibilityDetail = `## compatibility
16タイプそれぞれとの相性を以下の形式でJSON配列で出力してください（必ず全16タイプ分）。
typeコードの一覧: ${ALL_TYPES}
各タイプについて、${typeName}タイプとの関係性・付き合い方を具体的に分析してください。
[{
  "code": "XXXX",
  "name": "タイプ名",
  "relation": "関係性の名前（例：最良の相棒・ライバル・癒しの存在・要注意など）",
  "score": 75,
  "desc": "この2タイプの関係性の特徴（50字以内）",
  "advice": "具体的な付き合い方・コツ（60字以内）"
}]
scoreは0〜100の相性度（数値のみ）。

`

  const makeup = `## makeup
このタイプに似合うメイクの特徴を記述してください。
ベースメイク・アイメイク・リップ・全体の雰囲気のポイントを含めてください（3〜4段落）。

`

  const fashion = `## fashion
このタイプに似合うファッションスタイルの特徴を記述してください。
このタイプの性格・雰囲気に合った以下の観点を含めてください（3〜4段落）：
- 全体的なスタイル・テイスト（例：ナチュラル、モード、フェミニン、ストリートなど）
- おすすめカラーパレット（似合う色と避けるべき色）
- 取り入れたいアイテム・アクセサリー
- 素材・シルエットのポイント

`

  const hidden = `## hidden
このタイプの「隠れた一面」を分析してください。
表から見えない内面、意外な才能、ストレス時の変化、深く知った人だけが気づく側面を含めてください（3〜4段落）。

`

  const seasonal = `## seasonal
今月（${new Date().toLocaleDateString('ja-JP', { month: 'long' })}）のこのタイプ向け季節メイクアドバイスを記述してください。
季節感・トレンドを取り入れたカラー提案と具体的なテクニックを含めてください（2〜3段落）。

`

  const mole = moleMeta
    ? `## mole
以下の情報に基づいて、ほくろ・シワの詳細診断を行ってください。
入力情報: ${moleMeta}
人相学・顔相学の観点から、このほくろ・シワが示す性格・運勢・注意点を詳しく解説してください（3〜4段落）。

`
    : ''

  // fullプラン: 隠れた一面 + メイク + ファッション + 相性詳細
  const format_full = `---
以下のJSON形式で回答してください（各値はマークダウン文字列）：
{
  "compatibility": <上記のJSON配列>,
  "makeup": "メイクアドバイステキスト",
  "fashion": "ファッションアドバイステキスト",
  "hidden": "隠れた一面テキスト",
  "seasonal": null,
  "mole": null
}
`

  // subscriptionプラン: full + 季節メイク + ほくろ
  const format_subscription = `---
以下のJSON形式で回答してください（各値はマークダウン文字列）：
{
  "compatibility": <上記のJSON配列>,
  "makeup": "メイクアドバイステキスト",
  "fashion": "ファッションアドバイステキスト",
  "hidden": "隠れた一面テキスト",
  "seasonal": "季節メイクテキスト",
  "mole": "ほくろ・シワ診断テキスト（入力がない場合はnull）"
}
mole入力がない場合はmoleをnullにしてください。
`

  if (plan === 'full') {
    return base + compatibilityDetail + hidden + makeup + fashion + format_full
  }
  // subscription
  return base + compatibilityDetail + hidden + makeup + fashion + seasonal + mole + format_subscription
}

export async function POST(request: NextRequest) {
  let code: string, plan: string, moleMeta: string | undefined
  try {
    const body = await request.json()
    code = body.code
    plan = body.plan
    moleMeta = body.moleMeta
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const typeName = TYPE_NAMES[code]
  if (!typeName) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  // fullとsubscriptionのみ対応（loveとfortuneは/api/free-contentで提供）
  if (plan !== 'full' && plan !== 'subscription') {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  try {
    const prompt = buildPrompt(code, typeName, plan, moleMeta)

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')?.text ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse content' }, { status: 500 })
    }

    const content = JSON.parse(jsonMatch[0])
    return NextResponse.json(content)
  } catch (err) {
    console.error('[content] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

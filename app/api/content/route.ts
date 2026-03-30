import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { TYPE_NAMES } from '@/lib/face-types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ALL_TYPES = Object.entries(TYPE_NAMES)
  .map(([code, name]) => `${code}(${name})`)
  .join('、')

function buildPrompt(code: string, typeName: string, plan: string, moleMeta?: string): string {
  const base = `あなたはFACE CODEシステムの専門家です。
診断コード「${code}」（${typeName}タイプ）の人向けに、以下のコンテンツを日本語で生成してください。
文体は親しみやすく、具体的に書いてください。

`

  const compatibility = `## compatibility
16タイプそれぞれとの相性を以下の形式でJSON配列で出力してください（必ず全16タイプ分）。
typeコードの一覧: ${ALL_TYPES}
[{"code":"XXXX","name":"タイプ名","relation":"関係性の名前（例：最良の相棒）","desc":"一言説明（30字以内）"}]

`

  const love = `## love
恋愛傾向の詳細を3〜4段落で記述してください。
このタイプが恋愛でどう振る舞うか、好きなアプローチ、注意点、理想のパートナー像を含めてください。

`

  const makeup = `## makeup
このタイプに似合うメイクの特徴を記述してください。
ベースメイク・アイメイク・リップ・全体の雰囲気のポイントを含めてください（3〜4段落）。

`

  const hidden = `## hidden
このタイプの「隠れた一面」を分析してください。
表から見えない内面、意外な才能、ストレス時の変化、深く知った人だけが気づく側面を含めてください（3〜4段落）。

`

  const fortune = `## fortune
このタイプの仕事運・財運を分析してください。
向いている仕事スタイル、金銭感覚の特徴、富を引き寄せるコツ、注意点を含めてください（3〜4段落）。

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

  const format = `---
以下のJSON形式で回答してください（各値はマークダウン文字列）：
{
  "compatibility": <上記のJSON配列>,
  "love": "恋愛傾向テキスト",
  "makeup": "メイクアドバイステキスト",
  "hidden": "隠れた一面テキスト",
  "fortune": "仕事運・財運テキスト",
  "seasonal": "季節メイクテキスト",
  "mole": "ほくろ・シワ診断テキスト（入力がない場合はnull）"
}
planが"light"の場合はcompatibilityとloveのみ生成し、他はnullにしてください。
planが"full"の場合はcompatibility/love/makeup/hidden/fortuneを生成し、seasonal/moleはnullにしてください。
planが"subscription"の場合はmole入力があればmoleも、必ずseasonal含めすべて生成してください。`

  const sections = plan === 'light'
    ? base + compatibility + love + format
    : plan === 'full'
      ? base + compatibility + love + makeup + hidden + fortune + format
      : base + compatibility + love + makeup + hidden + fortune + seasonal + mole + format

  return sections
}

export async function POST(request: NextRequest) {
  const { code, plan, moleMeta } = await request.json()

  const typeName = TYPE_NAMES[code]
  if (!typeName) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

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
}

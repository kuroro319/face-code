import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { TYPE_NAMES } from '@/lib/face-types'

export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  let code: string, moles: string[], wrinkles: string[]
  try {
    const body = await request.json()
    code = body.code
    moles = Array.isArray(body.moles) ? body.moles : []
    wrinkles = Array.isArray(body.wrinkles) ? body.wrinkles : []
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const typeName = TYPE_NAMES[code]
  if (!typeName) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  if (moles.length === 0 && wrinkles.length === 0) {
    return NextResponse.json({ error: 'No markers provided' }, { status: 400 })
  }

  const molePart = moles.length > 0
    ? `【ほくろの位置】\n${moles.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
    : ''

  const wrinklePart = wrinkles.length > 0
    ? `【シワの位置・向き】\n${wrinkles.map((w, i) => `${i + 1}. ${w}`).join('\n')}`
    : ''

  const prompt = `あなたは日本の観相術・人相学の専門家です。
診断コード「${code}」（${typeName}タイプ）の方について、以下のほくろとシワを人相学の観点から詳しく診断してください。

${[molePart, wrinklePart].filter(Boolean).join('\n\n')}

各ほくろ・シワについて、その位置が示す運勢・性格・注意点を具体的かつ親しみやすい文体で解説してください。
必ず以下のJSON配列形式のみで回答してください（他のテキストは不要）：
[
  {
    "type": "mole",
    "location": "位置名（例：右頬）",
    "advice": "観相術的な意味と運勢アドバイス（2〜3文、前向きな表現で）"
  }
]`

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')?.text ?? ''
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) {
      return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
    }

    const results = JSON.parse(match[0])
    return NextResponse.json({ results })
  } catch (err) {
    console.error('[mole-wrinkle-diagnosis] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

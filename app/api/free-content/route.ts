import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { TYPE_NAMES } from '@/lib/face-types'
import { getSupabase } from '@/lib/supabase'

// Claude API は最大 60 秒かかるためタイムアウトを延長
export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildFreePrompt(code: string, typeName: string): string {
  return `あなたはFACE CODEシステムの専門家です。
診断コード「${code}」（${typeName}タイプ）の人向けに、以下のコンテンツを日本語で生成してください。
文体は親しみやすく、具体的に書いてください。

## love
恋愛傾向の詳細を3〜4段落で記述してください。
このタイプが恋愛でどう振る舞うか、好きなアプローチ、注意点、理想のパートナー像を含めてください。

## fortune
このタイプの仕事運・財運を分析してください。
向いている仕事スタイル、金銭感覚の特徴、富を引き寄せるコツ、注意点を含めてください（3〜4段落）。

---
以下のJSON形式で回答してください：
{
  "love": "恋愛傾向テキスト",
  "fortune": "仕事運・財運テキスト"
}
`
}

export async function POST(request: NextRequest) {
  let code: string
  try {
    const body = await request.json()
    code = body.code
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const typeName = TYPE_NAMES[code]
  if (!typeName) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    // Supabaseキャッシュを確認
    const { data: cached } = await supabase
      .from('free_content')
      .select('love, fortune')
      .eq('type_code', code)
      .single()

    if (cached) {
      return NextResponse.json({ love: cached.love, fortune: cached.fortune })
    }

    // キャッシュなし → Claude で生成
    const prompt = buildFreePrompt(code, typeName)

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')?.text ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse content' }, { status: 500 })
    }

    const content = JSON.parse(jsonMatch[0])

    // Supabase にキャッシュ保存（失敗しても応答は返す）
    await supabase.from('free_content').upsert({
      type_code: code,
      love: content.love,
      fortune: content.fortune,
    })

    return NextResponse.json(content)
  } catch (err) {
    console.error('[free-content] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

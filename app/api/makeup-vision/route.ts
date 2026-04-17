import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { TYPE_NAMES } from '@/lib/face-types'

export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// IP別レート制限: { ip -> タイムスタンプ[] }
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000 // 1時間

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return false
  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return true
}

const PROMPT = `あなたはプロのメイクアップアーティストです。
この写真に映っている顔を丁寧に観察し、その方だけのパーソナルメイクアドバイスを日本語で提供してください。

【重要】写真から実際に見えている顔の特徴（肌の色合い・質感、目の形・色、唇の形・厚さ、骨格・輪郭）に必ず言及しながら書いてください。
「あなたの〜」「お顔の〜」という語りかけ形式で、まるでプロが直接アドバイスしているように書いてください。

以下のJSON形式のみで回答してください（説明・コメント不要）：
{
  "skin": "肌の色合いと質感の観察（50字） + おすすめ下地・ファンデーションの種類・色味・仕上がりの提案（100字）",
  "eyes": "目の形・大きさ・色の観察（50字） + アイシャドウのカラー・グラデーション・アイライナーの形と太さの提案（100字）",
  "lips": "唇の形・厚さ・色の観察（50字） + リップの色・仕上がり・塗り方テクニックの提案（100字）",
  "cheeks": "骨格・頬・輪郭の観察（50字） + チークの位置・色・入れ方とハイライト・シェーディングの提案（100字）"
}

各値の合計は150〜200字程度にしてください。具体的なカラー名（コーラルピンク、テラコッタ等）や質感（ツヤ・マット等）を必ず含めてください。`

type SupportedMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
const SUPPORTED_TYPES: SupportedMediaType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'メイク分析は1時間に3回までご利用いただけます' }, { status: 429 })
  }

  let image: string, typeCode: string
  try {
    const body = await request.json()
    image = body.image
    typeCode = body.typeCode
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!image || typeof image !== 'string') {
    return NextResponse.json({ error: '画像データが必要です' }, { status: 400 })
  }
  if (!TYPE_NAMES[typeCode]) {
    return NextResponse.json({ error: 'Invalid typeCode' }, { status: 400 })
  }

  const match = image.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    return NextResponse.json({ error: '無効な画像フォーマットです' }, { status: 400 })
  }
  const [, rawMediaType, base64Data] = match
  if (!SUPPORTED_TYPES.includes(rawMediaType as SupportedMediaType)) {
    return NextResponse.json({ error: 'JPEG・PNG・GIF・WebP のみ対応しています' }, { status: 400 })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: rawMediaType as SupportedMediaType, data: base64Data },
          },
          { type: 'text', text: PROMPT },
        ],
      }],
    })

    const text = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')?.text ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err) {
    console.error('[makeup-vision] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

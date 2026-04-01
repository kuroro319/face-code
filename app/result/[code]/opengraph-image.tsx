import { ImageResponse } from 'next/og'

export const alt = 'FACE CODE'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// ── 型データ（page.tsx の TYPES 定数と同期） ──────────────────────────────
const TYPES: Record<string, { name: string; tagline: string }> = {
  RLOH: { name: '花形',        tagline: '生まれながらのスター。その存在だけで場が輝く。' },
  RLOM: { name: '指揮官',      tagline: '明確なビジョンと強い意志で、チームを勝利へ導く。' },
  RLSH: { name: 'クリエイター', tagline: '独創的な発想と感性で、世界に新しい美を生み出す。' },
  RLSM: { name: 'プロデューサー', tagline: '全体を見渡し、最高のチームと最良の結果を生み出す。' },
  RGOH: { name: '外交官',      tagline: '天性の共感力で、あらゆる人と信頼の橋を架ける。' },
  RGOM: { name: '戦略家',      tagline: '緻密な分析と長期的視野で、勝つべき戦略を描く。' },
  RGSH: { name: '探偵',        tagline: '鋭い観察眼と論理で、隠れた真実を暴き出す。' },
  RGSM: { name: '革命家',      tagline: '既成概念を壊し、新しい時代の扉を開ける先駆者。' },
  ALOH: { name: 'カウンセラー', tagline: '深い共感と温かさで、傷ついた心に寄り添う癒し手。' },
  ALOM: { name: '伝道師',      tagline: '情熱的な言葉と揺るぎない信念で、人の心を動かす。' },
  ALSH: { name: '幻想家',      tagline: '豊かな想像世界から、誰も見たことのない美を紡ぎ出す。' },
  ALSM: { name: '守護者',      tagline: '強い責任感と温かな愛で、大切なものをすべて守り抜く。' },
  AGOH: { name: '哲学者',      tagline: '深い思索から、人生と世界の本質に触れる洞察者。' },
  AGOM: { name: '研究者',      tagline: '終わりなき探求心で、未知の領域に光を当てる知の巨人。' },
  AGSH: { name: '予言者',      tagline: '鋭い直感と深い洞察で、まだ見えない未来を映し出す。' },
  AGSM: { name: '賢者',        tagline: '広い知恵と穏やかな強さで、迷える人々を導く。' },
}

function normalizeCode(raw: string): string {
  const upper = raw.toUpperCase().padEnd(4, 'R')
  const [f, a, c, d] = upper.split('')
  const normF = f === 'A' ? 'A' : 'R'
  const normA = a === 'G' ? 'G' : 'L'
  const normC = c === 'S' ? 'S' : 'O'
  const normD = d === 'M' ? 'M' : 'H'
  return `${normF}${normA}${normC}${normD}`
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const normalizedCode = normalizeCode(code)
  const typeInfo = TYPES[normalizedCode]

  const name = typeInfo?.name ?? '花形'
  const tagline = typeInfo?.tagline ?? ''

  const baseUrl = getBaseUrl()
  const characterSrc = `${baseUrl}/${encodeURIComponent(name)}.png`

  // 画像が取得できるか確認（失敗時は画像なしで描画）
  let imageData: ArrayBuffer | null = null
  try {
    const res = await fetch(characterSrc)
    if (res.ok) imageData = await res.arrayBuffer()
  } catch {
    // 画像取得失敗時はテキストのみで描画
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#FFF8F5',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 左カラム */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 0 60px 80px',
            width: '620px',
          }}
        >
          {/* FACE CODE ロゴ */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '6px',
              color: '#E8A0A0',
              marginBottom: '32px',
              display: 'flex',
            }}
          >
            FACE CODE
          </div>

          {/* タイプコード */}
          <div
            style={{
              fontSize: '96px',
              fontWeight: 900,
              color: '#E8A0A0',
              letterSpacing: '8px',
              lineHeight: 1,
              marginBottom: '16px',
              display: 'flex',
            }}
          >
            {normalizedCode}
          </div>

          {/* タイプ名 */}
          <div
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: '#3D2020',
              lineHeight: 1.2,
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            {name}タイプ
          </div>

          {/* キャッチフレーズ */}
          <div
            style={{
              fontSize: '22px',
              color: '#7A4040',
              lineHeight: 1.6,
              display: 'flex',
            }}
          >
            {tagline}
          </div>
        </div>

        {/* 右カラム：キャラクター画像 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: '100%',
          }}
        >
          {imageData ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={characterSrc}
              alt={name}
              style={{
                width: '460px',
                height: '460px',
                objectFit: 'contain',
              }}
            />
          ) : null}
        </div>
      </div>
    ),
    { ...size }
  )
}

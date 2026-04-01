import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'FACE CODE'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export default async function Image() {
  const baseUrl = getBaseUrl()
  const characterSrc = `${baseUrl}/${encodeURIComponent('花形')}.png`

  let imageSrc: string | null = null
  try {
    const res = await fetch(characterSrc)
    if (res.ok) {
      const buffer = await res.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      imageSrc = `data:image/png;base64,${base64}`
    }
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
            padding: '60px 0 60px 100px',
            flex: 1,
          }}
        >
          {/* FACE CODE ロゴ */}
          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '8px',
              color: '#E8A0A0',
              marginBottom: '36px',
            }}
          >
            FACE CODE
          </div>

          {/* メインキャッチコピー */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '58px',
              fontWeight: 900,
              color: '#3D2020',
              lineHeight: 1.3,
              marginBottom: '28px',
            }}
          >
            <span>あなたの顔が語る、</span>
            <span>本当の自分。</span>
          </div>

          {/* サブコピー */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '22px',
              color: '#7A4040',
              lineHeight: 1.6,
            }}
          >
            <span>人相学×AIで導き出す、</span>
            <span>新感覚パーソナリティ診断。</span>
          </div>

          {/* 区切り線 */}
          <div
            style={{
              display: 'flex',
              width: '60px',
              height: '3px',
              background: '#E8A0A0',
              marginTop: '40px',
            }}
          />
        </div>

        {/* 右カラム：キャラクター画像 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            width: '480px',
            height: '100%',
          }}
        >
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="花形タイプ"
              style={{
                width: '440px',
                height: '440px',
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

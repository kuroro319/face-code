import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const alt = 'FACE CODE'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  const imagePath = path.join(process.cwd(), 'public', '花形.png')
  let characterDataUrl: string | null = null
  try {
    const buffer = fs.readFileSync(imagePath)
    characterDataUrl = `data:image/png;base64,${buffer.toString('base64')}`
  } catch {
    // 画像が読み込めない場合は非表示
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
            flexShrink: '0' as unknown as number,
          }}
        >
          {characterDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={characterDataUrl}
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
    {
      ...size,
    }
  )
}

import Image from "next/image"
import Link from "next/link"

const types = [
  { name: "花形", code: "RLOH" },
  { name: "指揮官", code: "RLOM" },
  { name: "クリエイター", code: "RLSH" },
  { name: "プロデューサー", code: "RLSM" },
  { name: "外交官", code: "RGOH" },
  { name: "戦略家", code: "RGOM" },
  { name: "探偵", code: "RGSH" },
  { name: "革命家", code: "RGSM" },
  { name: "カウンセラー", code: "ALOH" },
  { name: "伝道師", code: "ALOM" },
  { name: "幻想家", code: "ALSH" },
  { name: "守護者", code: "ALSM" },
  { name: "哲学者", code: "AGOH" },
  { name: "研究者", code: "AGOM" },
  { name: "予言者", code: "AGSH" },
  { name: "賢者", code: "AGSM" },
]

export function TypesGrid() {
  return (
    <section className="py-16 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-secondary text-primary border border-primary/20 mb-3">
            16タイプ
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            あなたはどのタイプ？
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">診断して解き明かそう</p>
        </div>

        <div style={{ position: "relative" }}>
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {types.map((type, i) => (
              <div key={type.code} className="flex flex-col items-center gap-1.5">
                <div
                  className="overflow-hidden border-2 border-border shadow-md"
                  style={{
                    position: "relative",
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "9999px",
                    filter: i === 0
                      ? "blur(2px) brightness(0.95)"
                      : "blur(8px) brightness(0.8)",
                  }}
                >
                  <Image
                    src={`/${type.name}.png`}
                    alt={`${type.name}タイプ（未公開）`}
                    fill
                    className="object-cover object-top"
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(255,248,245,0.25)",
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground text-center leading-tight">
                  {type.name}
                </span>
              </div>
            ))}
          </div>

          {/* 中央のCTAオーバーレイ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              className="bg-card/90 backdrop-blur-sm border border-border rounded-3xl px-6 py-5 text-center shadow-xl mx-4"
              style={{ pointerEvents: "auto" }}
            >
              <p className="text-sm font-black text-foreground mb-1">あなたはどのタイプ？</p>
              <p className="text-xs text-muted-foreground mb-4">診断して解き明かそう</p>
              <Link
                href="/diagnose"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-black hover:opacity-90 transition-opacity"
              >
                診断して確かめる →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

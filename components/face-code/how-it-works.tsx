import { Camera, ScanFace, Star } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    step: 1,
    icon: Camera,
    title: "写真をアップロード",
    description: "スマホで撮った自撮り写真、またはアルバムから選択。正面を向いた写真が最適です。",
  },
  {
    step: 2,
    icon: ScanFace,
    title: "AIが顔を分析",
    description: "独自の人相学AIエンジンが目・鼻・口・輪郭など20以上のポイントを瞬時に解析。",
  },
  {
    step: 3,
    icon: Star,
    title: "FACEコードが判明！",
    description: "16タイプの中からあなただけのFACEコードが導き出され、詳細レポートが届きます。",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-16 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-secondary text-primary border border-primary/20 mb-3">
            使い方
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            たった<span className="text-primary"> 3ステップ</span>で完了
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6" style={{ position: "relative" }}>
          {/* デスクトップ用の繋ぎ線 */}
          <div
            aria-hidden="true"
            className="hidden md:block h-0.5 bg-border"
            style={{
              position: "absolute",
              top: "2.5rem",
              left: "calc(16.67% + 1rem)",
              right: "calc(16.67% + 1rem)",
            }}
          />

          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.step} className="flex-1 flex flex-col items-center text-center" style={{ position: "relative" }}>
                {i < steps.length - 1 && (
                  <div className="md:hidden w-0.5 h-8 bg-border my-2" aria-hidden="true" />
                )}

                <div
                  className="w-20 h-20 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center mb-4 shadow-md"
                  style={{ position: "relative", zIndex: 10 }}
                >
                  <Icon className="text-primary" size={28} />
                  <span
                    className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center"
                    style={{ position: "absolute", top: "-0.25rem", right: "-0.25rem" }}
                  >
                    {s.step}
                  </span>
                </div>

                <h3 className="text-sm font-black text-foreground mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
                  {s.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/diagnose"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-black text-base shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            さっそく診断してみる →
          </Link>
        </div>
      </div>
    </section>
  )
}

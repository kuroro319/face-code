import { ShieldCheck } from "lucide-react"
import Link from "next/link"

export function Cta() {
  return (
    <section id="cta" className="py-20 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="rounded-3xl border border-primary/20 p-10 md:p-14 overflow-hidden"
          style={{
            position: "relative",
            background: "linear-gradient(135deg, #FFF8F5 0%, #FAE8E8 100%)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-2.5rem",
              right: "-2.5rem",
              width: "10rem",
              height: "10rem",
              borderRadius: "9999px",
              opacity: 0.4,
              background: "radial-gradient(circle, #E8A0A0 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-2.5rem",
              left: "-2.5rem",
              width: "8rem",
              height: "8rem",
              borderRadius: "9999px",
              opacity: 0.3,
              background: "radial-gradient(circle, #F0B8B8 0%, transparent 70%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 10 }}>
            <p className="text-4xl mb-4">🌸</p>
            <h2 className="text-2xl md:text-4xl font-black text-foreground mb-3">
              あなたのFACEコードを<br />今すぐ見つけよう
            </h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              写真1枚、約1分。完全無料で16タイプの中から<br className="hidden md:block" />
              あなただけのパーソナリティを診断します。
            </p>

            <Link
              href="/diagnose"
              className="inline-flex items-center gap-2.5 px-10 py-5 rounded-full bg-primary text-primary-foreground font-black text-lg shadow-xl hover:opacity-90 active:scale-95 transition-all"
            >
              今すぐ無料診断
            </Link>

            <div className="flex items-center justify-center gap-2 mt-5 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-primary flex-shrink-0" />
              <span>写真は診断後すぐに削除されます</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              クレジットカード不要 · 登録なしで利用可能
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

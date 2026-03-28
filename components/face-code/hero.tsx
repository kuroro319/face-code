import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="pt-28 pb-16 px-5 overflow-hidden" style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-5rem",
          right: "-5rem",
          width: "20rem",
          height: "20rem",
          borderRadius: "9999px",
          opacity: 0.3,
          background: "radial-gradient(circle, #E8A0A0 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-2.5rem",
          left: "-5rem",
          width: "15rem",
          height: "15rem",
          borderRadius: "9999px",
          opacity: 0.2,
          background: "radial-gradient(circle, #F5C0C0 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* テキスト */}
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-secondary text-primary border border-primary/20 mb-5">
            ✨ AI × 人相学 パーソナリティ診断
          </span>

          <h1 className="text-3xl md:text-5xl font-black leading-tight text-foreground mb-4">
            あなたの顔が語る、<br />
            <span className="text-primary">本当の自分。</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            人相学×AIで導き出す、<br className="md:hidden" />
            新感覚パーソナリティ診断
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
            {[
              { label: "累計診断数", value: "12,847人" },
              { label: "今日の診断", value: "342人" },
              { label: "所要時間", value: "約1分" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center bg-card border border-border rounded-2xl px-4 py-2.5 shadow-sm"
              >
                <span className="text-[11px] text-muted-foreground font-medium">{s.label}</span>
                <span className="text-base font-black text-primary">{s.value}</span>
              </div>
            ))}
          </div>

          <Link
            href="/diagnose"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-black text-base shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            無料で診断する →
          </Link>
        </div>

        {/* キャラクター画像 */}
        <div className="flex-shrink-0" style={{ position: "relative" }}>
          <div
            className="overflow-hidden border-4 border-secondary shadow-2xl"
            style={{
              position: "relative",
              width: "18rem",
              height: "18rem",
              borderRadius: "9999px",
            }}
          >
            <Image
              src="/花形.png"
              alt="FACE CODE 花形タイプ"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <div
            className="bg-card border border-border rounded-2xl px-4 py-2 shadow-lg text-sm font-bold text-primary"
            style={{ position: "absolute", bottom: "-0.5rem", left: "-1rem" }}
          >
            🌸 16タイプ診断
          </div>
          <div
            className="bg-card border border-border rounded-2xl px-3 py-2 shadow-lg text-xs font-bold text-foreground"
            style={{ position: "absolute", top: "1rem", right: "-1rem" }}
          >
            AI分析 ✓
          </div>
        </div>
      </div>
    </section>
  )
}

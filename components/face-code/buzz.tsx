import Image from "next/image"

const tickerItems = [
  { name: "さくら", type: "花形タイプ", time: "2分前" },
  { name: "みつき", type: "外交官タイプ", time: "5分前" },
  { name: "はるな", type: "クリエイタータイプ", time: "7分前" },
  { name: "ゆいか", type: "予言者タイプ", time: "10分前" },
  { name: "れいな", type: "指揮官タイプ", time: "12分前" },
  { name: "こはる", type: "花形タイプ", time: "15分前" },
  { name: "あおい", type: "幻想家タイプ", time: "18分前" },
  { name: "なのか", type: "カウンセラータイプ", time: "21分前" },
]

const popularTypes = [
  { rank: 1, name: "花形", label: "華やかで社交的", img: "/花形.png", count: "1,204人" },
  { rank: 2, name: "外交官", label: "天性の共感力", img: "/外交官.png", count: "987人" },
  { rank: 3, name: "指揮官", label: "明確なビジョン", img: "/指揮官.png", count: "856人" },
]

export function Buzz() {
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <section className="py-14 px-5 bg-secondary/40">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <h2 className="text-sm font-black tracking-wide text-primary uppercase">LIVE</h2>
          <span className="text-sm font-bold text-foreground">今みんなが診断してる</span>
        </div>

        {/* ティッカー */}
        <div className="overflow-hidden mb-10 py-3 bg-card rounded-2xl border border-border shadow-sm">
          <div className="ticker-track flex gap-8 whitespace-nowrap">
            {doubled.map((item, i) => (
              <span key={i} className="text-sm text-muted-foreground flex-shrink-0">
                <span className="font-bold text-foreground">{item.name} さん</span>
                {" が "}
                <span className="font-bold text-primary">{item.type}</span>
                {" と診断されました · "}
                <span className="text-xs">{item.time}</span>
              </span>
            ))}
          </div>
        </div>

        {/* TOP 3 */}
        <h3 className="text-base font-bold text-foreground mb-4">🏆 今日の人気タイプ TOP 3</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {popularTypes.map((t) => (
            <div
              key={t.rank}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm"
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  className="overflow-hidden border-2 border-primary/30"
                  style={{ position: "relative", width: "3.5rem", height: "3.5rem", borderRadius: "9999px" }}
                >
                  <Image
                    src={t.img}
                    alt={t.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <span
                  className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center"
                  style={{ position: "absolute", top: "-0.25rem", left: "-0.25rem" }}
                >
                  {t.rank}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-black text-foreground text-sm truncate">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.label}</p>
                <p className="text-xs font-bold text-primary mt-0.5">{t.count}が診断</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

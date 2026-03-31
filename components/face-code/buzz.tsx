import Image from "next/image"
import { createClient } from "@supabase/supabase-js"

const TYPE_NAMES: Record<string, string> = {
  RLOH: "花形タイプ", RLOM: "指揮官タイプ", RLSH: "クリエイタータイプ", RLSM: "プロデューサータイプ",
  RGOH: "外交官タイプ", RGOM: "戦略家タイプ", RGSH: "探偵タイプ", RGSM: "革命家タイプ",
  ALOH: "カウンセラータイプ", ALOM: "伝道師タイプ", ALSH: "幻想家タイプ", ALSM: "守護者タイプ",
  AGOH: "哲学者タイプ", AGOM: "研究者タイプ", AGSH: "予言者タイプ", AGSM: "賢者タイプ",
}

const TYPE_IMAGES: Record<string, string> = {
  RLOH: "/花形.png", RLOM: "/指揮官.png", RLSH: "/クリエイター.png", RLSM: "/プロデューサー.png",
  RGOH: "/外交官.png", RGOM: "/戦略家.png", RGSH: "/探偵.png", RGSM: "/革命家.png",
  ALOH: "/カウンセラー.png", ALOM: "/伝道師.png", ALSH: "/幻想家.png", ALSM: "/守護者.png",
  AGOH: "/哲学者.png", AGOM: "/研究者.png", AGSH: "/予言者.png", AGSM: "/賢者.png",
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000 / 60)
  if (diff < 1) return "たった今"
  if (diff < 60) return `${diff}分前`
  return `${Math.floor(diff / 60)}時間前`
}

const DISPLAY_NAMES = ["さくら", "みつき", "はるな", "ゆいか", "れいな", "こはる", "あおい", "なのか", "ひより", "まひろ"]

async function getBuzzData() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 直近20件の診断
    const { data: recent } = await supabase
      .from("diagnoses")
      .select("type_code, created_at")
      .order("created_at", { ascending: false })
      .limit(20)

    // 今日の人気タイプ集計
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { data: todayData } = await supabase
      .from("diagnoses")
      .select("type_code")
      .gte("created_at", today.toISOString())

    const typeCounts: Record<string, number> = {}
    todayData?.forEach(({ type_code }) => {
      if (type_code) typeCounts[type_code] = (typeCounts[type_code] ?? 0) + 1
    })

    const topTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([code, count], i) => ({
        rank: i + 1, code,
        name: TYPE_NAMES[code] ?? code,
        img: TYPE_IMAGES[code] ?? "/花形.png",
        count,
      }))

    return { recent: recent ?? [], topTypes }
  } catch {
    return { recent: [], topTypes: [] }
  }
}

export async function Buzz() {
  const { recent, topTypes } = await getBuzzData()

  if (recent.length === 0 && topTypes.length === 0) return null

  const tickerItems = recent.map((item, i) => ({
    name: DISPLAY_NAMES[i % DISPLAY_NAMES.length]!,
    type: TYPE_NAMES[item.type_code] ?? item.type_code,
    time: timeAgo(item.created_at),
  }))
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <section className="py-14 px-5 bg-secondary/40">
      <div className="max-w-5xl mx-auto">

        {tickerItems.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <h2 className="text-sm font-black tracking-wide text-primary uppercase">LIVE</h2>
              <span className="text-sm font-bold text-foreground">今みんなが診断してる</span>
            </div>
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
          </>
        )}

        {topTypes.length > 0 && (
          <>
            <h3 className="text-base font-bold text-foreground mb-4">🏆 今日の人気タイプ TOP {topTypes.length}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topTypes.map((t) => (
                <div key={t.rank} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div className="overflow-hidden border-2 border-primary/30" style={{ position: "relative", width: "3.5rem", height: "3.5rem", borderRadius: "9999px" }}>
                      <Image src={t.img} alt={t.name} fill className="object-cover object-top" />
                    </div>
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center" style={{ position: "absolute", top: "-0.25rem", left: "-0.25rem" }}>
                      {t.rank}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-foreground text-sm truncate">{t.name}</p>
                    <p className="text-xs font-bold text-primary mt-0.5">{t.count}人が診断</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  )
}

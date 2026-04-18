"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase-client"

const TYPE_LABELS: Record<string, string> = {
  RLOH: "花形", RLOM: "指揮官", RLSH: "クリエイター", RLSM: "プロデューサー",
  RGOH: "外交官", RGOM: "戦略家", RGSH: "探偵", RGSM: "革命家",
  ALOH: "カウンセラー", ALOM: "伝道師", ALSH: "幻想家", ALSM: "守護者",
  AGOH: "哲学者", AGOM: "研究者", AGSH: "予言者", AGSM: "賢者",
}

const COUNTRY_LABELS: Record<string, string> = {
  JP: "日本", US: "アメリカ", KR: "韓国", CN: "中国", TW: "台湾",
  HK: "香港", GB: "イギリス", FR: "フランス", DE: "ドイツ",
  AU: "オーストラリア", CA: "カナダ", SG: "シンガポール", TH: "タイ",
  MY: "マレーシア", PH: "フィリピン", VN: "ベトナム", BR: "ブラジル",
  IN: "インド", OTHER: "その他",
}

interface DistItem {
  type: string
  count: number
  percentage: number
}

interface StatsData {
  insufficient: boolean
  total?: number
  topType?: string
  percentage?: number
  distribution?: DistItem[]
}

interface CountryStatsSectionProps {
  currentTypeCode: string
}

export function CountryStatsSection({ currentTypeCode }: CountryStatsSectionProps) {
  const [country, setCountry] = useState<string | null>(null)
  const [stats, setStats] = useState<StatsData | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return

      const profileRes = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!profileRes.ok) return
      const profile = await profileRes.json()
      if (!profile.country) return

      setCountry(profile.country)

      const statsRes = await fetch(`/api/country-stats?country=${profile.country}`)
      if (!statsRes.ok) return
      const data: StatsData = await statsRes.json()
      setStats(data)
    })
  }, [])

  if (!country || !stats) return null

  const countryLabel = COUNTRY_LABELS[country] ?? country

  if (stats.insufficient) {
    return (
      <section className="py-8 px-4">
        <div
          className="max-w-2xl mx-auto rounded-2xl p-6 text-center"
          style={{ backgroundColor: "rgba(232,160,160,0.06)", border: "1px solid rgba(232,160,160,0.2)" }}
        >
          <p className="text-xs font-bold mb-1" style={{ color: "#E8A0A0" }}>COUNTRY DATA</p>
          <p className="text-sm" style={{ color: "#888" }}>
            {countryLabel}のデータを集計中です。もうしばらくお待ちください。
          </p>
        </div>
      </section>
    )
  }

  const topTypeName = stats.topType ? (TYPE_LABELS[stats.topType] ?? stats.topType) : ""

  return (
    <section className="py-8 px-4">
      <div
        className="max-w-2xl mx-auto rounded-2xl p-6"
        style={{ backgroundColor: "rgba(232,160,160,0.06)", border: "1px solid rgba(232,160,160,0.2)" }}
      >
        <p className="text-xs font-bold mb-3" style={{ color: "#E8A0A0" }}>COUNTRY DATA</p>
        <p className="text-base font-black mb-1" style={{ color: "#2D2D2D" }}>
          {countryLabel}では{topTypeName}タイプが最も多い
        </p>
        <p className="text-sm mb-5" style={{ color: "#888" }}>
          {countryLabel}の診断者 {stats.total}人中 {stats.percentage}% が{topTypeName}タイプ
        </p>

        <div className="space-y-3">
          {stats.distribution?.map((item, i) => {
            const label = TYPE_LABELS[item.type] ?? item.type
            const isCurrentType = item.type === currentTypeCode
            return (
              <div key={item.type}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: isCurrentType ? "#E8A0A0" : "#555", fontWeight: isCurrentType ? 700 : 400 }}>
                    {i + 1}. {label}{isCurrentType ? "（あなた）" : ""}
                  </span>
                  <span style={{ color: "#888" }}>{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(232,160,160,0.15)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      background: isCurrentType
                        ? "linear-gradient(to right, #E8A0A0, #D4847B)"
                        : "rgba(232,160,160,0.4)",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

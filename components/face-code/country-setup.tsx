"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase-client"

const COUNTRIES = [
  { code: "JP", label: "🇯🇵 日本" },
  { code: "US", label: "🇺🇸 アメリカ" },
  { code: "KR", label: "🇰🇷 韓国" },
  { code: "CN", label: "🇨🇳 中国" },
  { code: "TW", label: "🇹🇼 台湾" },
  { code: "HK", label: "🇭🇰 香港" },
  { code: "GB", label: "🇬🇧 イギリス" },
  { code: "FR", label: "🇫🇷 フランス" },
  { code: "DE", label: "🇩🇪 ドイツ" },
  { code: "AU", label: "🇦🇺 オーストラリア" },
  { code: "CA", label: "🇨🇦 カナダ" },
  { code: "SG", label: "🇸🇬 シンガポール" },
  { code: "TH", label: "🇹🇭 タイ" },
  { code: "MY", label: "🇲🇾 マレーシア" },
  { code: "PH", label: "🇵🇭 フィリピン" },
  { code: "VN", label: "🇻🇳 ベトナム" },
  { code: "BR", label: "🇧🇷 ブラジル" },
  { code: "IN", label: "🇮🇳 インド" },
  { code: "OTHER", label: "🌍 その他" },
]

interface CountrySetupProps {
  typeCode: string
}

export function CountrySetup({ typeCode }: CountrySetupProps) {
  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState("JP")
  const [saving, setSaving] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setToken(session.access_token)

      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) return
      const profile = await res.json()
      if (!profile.country) {
        setShow(true)
      }
    })
  }, [])

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ country: selected, type_code: typeCode }),
      })
      setShow(false)
    } finally {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ backgroundColor: "#FFF8F5", border: "1px solid rgba(232,160,160,0.3)" }}
      >
        <p className="text-xs font-bold mb-1" style={{ color: "#E8A0A0" }}>COUNTRY</p>
        <h2 className="text-xl font-black mb-2" style={{ color: "#2D2D2D" }}>
          あなたの国を教えてください
        </h2>
        <p className="text-sm mb-6" style={{ color: "#888" }}>
          国別の統計データに活用します（任意）
        </p>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm mb-6 appearance-none"
          style={{
            border: "1px solid rgba(232,160,160,0.4)",
            backgroundColor: "#fff",
            color: "#2D2D2D",
            outline: "none",
          }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            onClick={() => setShow(false)}
            className="flex-1 rounded-full py-3 text-sm font-bold"
            style={{ border: "1px solid rgba(232,160,160,0.3)", color: "#888" }}
          >
            スキップ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-full py-3 text-sm font-bold text-white"
            style={{ background: "linear-gradient(to right, #E8A0A0, #D4847B)" }}
          >
            {saving ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>
    </div>
  )
}

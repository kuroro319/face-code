"use client"

import { useEffect, useState } from "react"
import { Heart, Sparkles, Eye, TrendingUp, Flower2, Moon, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import CompatibilitySection from "@/components/result/CompatibilitySection"
import type { Plan } from "@/lib/face-types"

interface ContentData {
  compatibility?: unknown
  love: string | null
  makeup: string | null
  hidden: string | null
  fortune: string | null
  seasonal: string | null
  mole: string | null
}

interface Props {
  code: string
  plan: Plan
}

// ─── Markdown除去（# ## ### **）────────────────────────────
function stripMd(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim()
}

function parseBlocks(text: string): string[] {
  return text.split(/\n{2,}/).map(b => stripMd(b)).filter(Boolean)
}

// ─── 展開式テキスト ─────────────────────────────────────────
function ExpandableText({ text, previewChars = 80 }: { text: string; previewChars?: number }) {
  const [open, setOpen] = useState(false)
  const isLong = text.length > previewChars
  return (
    <div>
      <p style={{ margin: 0, fontSize: "13px", color: "#555", lineHeight: 1.8 }}>
        {open || !isLong ? text : text.slice(0, previewChars) + "…"}
      </p>
      {isLong && (
        <button onClick={() => setOpen(!open)}
          style={{ marginTop: "6px", fontSize: "12px", color: "#C9546E", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {open ? "閉じる ▲" : "続きを読む ▼"}
        </button>
      )}
    </div>
  )
}

// ─── アコーディオン ─────────────────────────────────────────
function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderTop: "1px solid #f0e8e8" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 0", background: "none", border: "none", cursor: "pointer",
        fontSize: "13px", fontWeight: 700, color: "#C9546E", textAlign: "left",
      }}>
        {label}
        <ChevronDown style={{ width: "15px", height: "15px", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && <div style={{ paddingBottom: "12px" }}>{children}</div>}
    </div>
  )
}

// ─── セクションラッパー ─────────────────────────────────────
function Section({ icon: Icon, title, accentColor = "#E8A0A0", children }: {
  icon: React.ElementType; title: string; accentColor?: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: "#fff", borderRadius: "20px", padding: "22px 24px", borderLeft: `4px solid ${accentColor}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: `${accentColor}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: "15px", height: "15px", color: accentColor }} />
        </div>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

// ─── 恋愛傾向 ───────────────────────────────────────────────
function LoveSection({ text }: { text: string }) {
  const blocks = parseBlocks(text)
  const lead = blocks[0] ?? ""
  const rest = blocks.slice(1)
  const icons = ["💫", "💬", "⚠️", "💑"]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ backgroundColor: "#FFF0F4", borderRadius: "12px", padding: "14px 16px", borderLeft: "3px solid #E8A0A0" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#333", lineHeight: 1.8, fontWeight: 500 }}>
          {lead.slice(0, 100)}{lead.length > 100 ? "…" : ""}
        </p>
      </div>
      {rest.slice(0, 4).map((para, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", padding: "12px 14px", backgroundColor: "#FFF8F8", borderRadius: "12px" }}>
          <span style={{ fontSize: "15px", flexShrink: 0, marginTop: "2px" }}>{icons[i] ?? "✨"}</span>
          <ExpandableText text={para} previewChars={60} />
        </div>
      ))}
    </div>
  )
}

// ─── メイクアドバイス ───────────────────────────────────────
function MakeupSection({ text }: { text: string }) {
  const blocks = parseBlocks(text)
  const cats = [
    { emoji: "🌿", label: "ベースメイク", color: "#d4c5e8" },
    { emoji: "👁",  label: "アイメイク",   color: "#b8cfe8" },
    { emoji: "💋", label: "リップ",       color: "#e8b0b0" },
    { emoji: "✨", label: "全体の雰囲気", color: "#e8dbb0" },
  ]
  const swatches = [
    { color: "#c9a8d4", label: "ラベンダー" },
    { color: "#c9a0a8", label: "ダスティローズ" },
    { color: "#8a9aaa", label: "スモーキー" },
    { color: "#b8967a", label: "ローズブラウン" },
  ]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {blocks.slice(0, 4).map((block, i) => {
          const cat = cats[i]!
          return (
            <div key={i} style={{ backgroundColor: "#FFF8F5", borderRadius: "14px", padding: "14px", borderTop: `3px solid ${cat.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "15px" }}>{cat.emoji}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#555" }}>{cat.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#666", lineHeight: 1.7 }}>
                {block.slice(0, 60)}{block.length > 60 ? "…" : ""}
              </p>
            </div>
          )
        })}
      </div>
      <div>
        <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 8px" }}>おすすめカラー</p>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {swatches.map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: s.color, border: "1px solid rgba(0,0,0,0.08)" }} />
              <span style={{ fontSize: "11px", color: "#777" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 隠れた一面 ─────────────────────────────────────────────
function HiddenSection({ text }: { text: string }) {
  const blocks = parseBlocks(text)
  const lead = blocks[0] ?? ""
  const rest = blocks.slice(1)
  const accordionLabels = ["🎭 意外な才能", "🔋 ストレス時のパターン", "🤝 深く付き合った人だけが知ること"]
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div style={{ backgroundColor: "#F5F5FF", borderRadius: "12px", padding: "12px 14px" }}>
          <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, color: "#7070AA" }}>🧊 外からの印象</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#555", lineHeight: 1.7 }}>静かで神秘的・達観している</p>
        </div>
        <div style={{ backgroundColor: "#FFF5F8", borderRadius: "12px", padding: "12px 14px" }}>
          <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, color: "#C9546E" }}>🔥 内側のリアル</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#555", lineHeight: 1.7 }}>
            {lead.slice(0, 45)}{lead.length > 45 ? "…" : ""}
          </p>
        </div>
      </div>
      {rest.slice(0, 3).map((para, i) => (
        <Accordion key={i} label={accordionLabels[i] ?? `詳細 ${i + 1}`}>
          <ExpandableText text={para} previewChars={80} />
        </Accordion>
      ))}
    </div>
  )
}

// ─── 仕事運・財運 ───────────────────────────────────────────
function FortuneSection({ text }: { text: string }) {
  const blocks = parseBlocks(text)
  const strengths = ["先を読む力", "本質を見抜く目", "直感力", "洞察力"]
  const jobs = [
    { emoji: "🔬", label: "リサーチャー" },
    { emoji: "📊", label: "アナリスト" },
    { emoji: "🎨", label: "クリエイター" },
    { emoji: "💬", label: "カウンセラー" },
  ]
  const adviceBlock = [...blocks].sort((a, b) => b.length - a.length)[0] ?? ""
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 8px" }}>あなたの強み</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {strengths.map(s => (
            <span key={s} style={{ fontSize: "12px", fontWeight: 600, color: "#C9546E", backgroundColor: "#FCE8EE", padding: "4px 12px", borderRadius: "20px" }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {jobs.map(j => (
          <div key={j.label} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", backgroundColor: "#FFF8F5", borderRadius: "10px" }}>
            <span style={{ fontSize: "17px" }}>{j.emoji}</span>
            <span style={{ fontSize: "13px", color: "#555" }}>{j.label}</span>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: "#FFF3E0", borderRadius: "12px", padding: "14px 16px", borderLeft: "3px solid #F0A060" }}>
        <p style={{ margin: "0 0 6px", fontSize: "12px", fontWeight: 700, color: "#B06020" }}>⚠️ チャンスを逃さないために</p>
        <ExpandableText text={adviceBlock} previewChars={80} />
      </div>
    </div>
  )
}

// ─── ほくろフォーム ─────────────────────────────────────────
function MoleForm({ code, plan, onResult }: { code: string; plan: Plan; onResult: (t: string) => void }) {
  const [molePosition, setMolePosition] = useState("")
  const [wrinkleType, setWrinkleType] = useState("")
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!molePosition && !wrinkleType) return
    setLoading(true)
    const moleMeta = [molePosition && `ほくろの位置: ${molePosition}`, wrinkleType && `シワの種類・位置: ${wrinkleType}`].filter(Boolean).join("、")
    const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, plan, moleMeta }) })
    const data = await res.json()
    if (data.mole) onResult(data.mole)
    setLoading(false)
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-foreground/70 mb-1">ほくろの位置（例：右頬、鼻の下）</label>
        <input type="text" value={molePosition} onChange={e => setMolePosition(e.target.value)} placeholder="気になるほくろの位置を入力" className="w-full px-4 py-2 rounded-xl border border-foreground/10 text-sm bg-[#FFF8F5] focus:outline-none focus:border-[#E8A0A0]" />
      </div>
      <div>
        <label className="block text-sm text-foreground/70 mb-1">シワの種類・位置（例：目尻のシワ、額の横ジワ）</label>
        <input type="text" value={wrinkleType} onChange={e => setWrinkleType(e.target.value)} placeholder="気になるシワを入力" className="w-full px-4 py-2 rounded-xl border border-foreground/10 text-sm bg-[#FFF8F5] focus:outline-none focus:border-[#E8A0A0]" />
      </div>
      <Button type="submit" disabled={loading || (!molePosition && !wrinkleType)} className="w-full bg-gradient-to-r from-[#E8A0A0] to-[#D4847B] text-white rounded-full border-0">
        {loading ? "診断中..." : "診断する"}{!loading && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </form>
  )
}

// ─── メインコンポーネント ───────────────────────────────────
export function PurchasedContent({ code, plan }: Props) {
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [moleResult, setMoleResult] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true); setError(false)
    fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, plan }) })
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setContent(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [code, plan, retryCount])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="w-12 h-12 rounded-full border-4 border-[#E8A0A0]/30 border-t-[#E8A0A0] animate-spin mx-auto mb-4" />
      <p className="text-foreground/50 text-sm">詳細レポートを生成中です…（少々お待ちください）</p>
    </div>
  )

  if (error || !content) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <p className="text-foreground/60 mb-4">コンテンツの生成に失敗しました。</p>
      <button onClick={() => setRetryCount(n => n + 1)} className="px-6 py-2 rounded-full border border-[#E8A0A0]/30 text-[#E8A0A0] text-sm hover:bg-[#E8A0A0]/5 transition-colors">再試行する</button>
    </div>
  )

  return (
    <div style={{
      maxWidth: "720px",
      margin: "0 auto",
      padding: "0 20px 48px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      fontFamily: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
    }}>
      <CompatibilitySection typeCode={code} />

      {content.love && (
        <Section icon={Heart} title="恋愛傾向の詳細" accentColor="#E8A0A0">
          <LoveSection text={content.love} />
        </Section>
      )}

      {content.makeup && (
        <Section icon={Sparkles} title="メイクアドバイス" accentColor="#B0A0D4">
          <MakeupSection text={content.makeup} />
        </Section>
      )}

      {content.hidden && (
        <Section icon={Eye} title="隠れた一面の分析" accentColor="#70A8D4">
          <HiddenSection text={content.hidden} />
        </Section>
      )}

      {content.fortune && (
        <Section icon={TrendingUp} title="仕事運・財運" accentColor="#74C98A">
          <FortuneSection text={content.fortune} />
        </Section>
      )}

      {content.seasonal && (
        <Section icon={Moon} title="今月の季節メイクアドバイス" accentColor="#C9A0D4">
          <ExpandableText text={stripMd(content.seasonal)} previewChars={100} />
        </Section>
      )}

      {plan === "subscription" && (
        <Section icon={Flower2} title="ほくろ・シワ詳細診断" accentColor="#D4A0A0">
          {moleResult
            ? <ExpandableText text={stripMd(moleResult)} previewChars={100} />
            : <MoleForm code={code} plan={plan} onResult={setMoleResult} />}
        </Section>
      )}
    </div>
  )
}

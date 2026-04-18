"use client"

import { useEffect, useState, useCallback } from "react"
import { Sparkles, Eye, Flower2, Moon, ChevronDown, Shirt, GitCompare, Camera } from "lucide-react"
import type { Plan } from "@/lib/face-types"
import { MoleWrinkleCanvas, type DiagnosisResult } from "@/components/face-code/mole-wrinkle-canvas"

// ─── タイプ別カラー定義 ──────────────────────────────────────
const MAKEUP_COLORS: Record<string, Array<{ color: string; label: string }>> = {
  RLOH: [{ color: "#e86080", label: "ホットピンク" }, { color: "#e8c055", label: "ゴールド" }, { color: "#e89060", label: "コーラル" }, { color: "#b04080", label: "ベリー" }],
  RLOM: [{ color: "#802040", label: "バーガンディ" }, { color: "#304060", label: "ネイビー" }, { color: "#c0a070", label: "キャメル" }, { color: "#606060", label: "チャコール" }],
  RLSH: [{ color: "#c08090", label: "モーヴ" }, { color: "#c07860", label: "テラコッタ" }, { color: "#809870", label: "セージ" }, { color: "#7050a0", label: "ディープパープル" }],
  RLSM: [{ color: "#e0c0b0", label: "ローズベージュ" }, { color: "#c09070", label: "カッパー" }, { color: "#d4a0a8", label: "ダスティローズ" }, { color: "#a07860", label: "ウォームブラウン" }],
  RGOH: [{ color: "#f0e0d0", label: "ヌード" }, { color: "#e8d898", label: "シャンパン" }, { color: "#f0c8c8", label: "ブラッシュ" }, { color: "#e0a0a8", label: "ソフトローズ" }],
  RGOM: [{ color: "#b0a898", label: "トープ" }, { color: "#9098a8", label: "スレート" }, { color: "#802040", label: "ワイン" }, { color: "#c08850", label: "コニャック" }],
  RGSH: [{ color: "#888898", label: "スモーキーグレー" }, { color: "#203050", label: "ミッドナイトブルー" }, { color: "#b08898", label: "モーヴ" }, { color: "#800020", label: "ディープレッド" }],
  RGSM: [{ color: "#4040c0", label: "エレクトリック" }, { color: "#e06040", label: "コーラル" }, { color: "#407060", label: "ジェード" }, { color: "#202020", label: "ブラック" }],
  ALOH: [{ color: "#f0b888", label: "ピーチ" }, { color: "#e89070", label: "コーラル" }, { color: "#f0c898", label: "アプリコット" }, { color: "#e8a0a8", label: "ウォームピンク" }],
  ALOM: [{ color: "#c02030", label: "リッチレッド" }, { color: "#d08030", label: "アンバー" }, { color: "#a06840", label: "アース" }, { color: "#b07840", label: "ウォームブロンズ" }],
  ALSH: [{ color: "#c0a8e0", label: "ライラック" }, { color: "#f0e8f8", label: "パール" }, { color: "#f0b8d0", label: "ローズクォーツ" }, { color: "#b8e8d8", label: "ミント" }],
  ALSM: [{ color: "#d4a8b0", label: "ダスティローズ" }, { color: "#b09040", label: "ヘーゼル" }, { color: "#f8f0e0", label: "クリーム" }, { color: "#c0a890", label: "ソフトブラウン" }],
  AGOH: [{ color: "#404080", label: "インディゴ" }, { color: "#504850", label: "チャコール" }, { color: "#6040a0", label: "ムーディパープル" }, { color: "#808090", label: "グレー" }],
  AGOM: [{ color: "#5080b0", label: "スティールブルー" }, { color: "#f0f0f0", label: "ホワイト" }, { color: "#606870", label: "グラファイト" }, { color: "#204060", label: "マリン" }],
  AGSH: [{ color: "#8060c0", label: "バイオレット" }, { color: "#c0c0d0", label: "シルバー" }, { color: "#6080a0", label: "スティール" }, { color: "#204848", label: "ディープティール" }],
  AGSM: [{ color: "#802040", label: "バーガンディ" }, { color: "#c0a040", label: "アンティークゴールド" }, { color: "#c06070", label: "ディープローズ" }, { color: "#204030", label: "ダークジェード" }],
}

const FASHION_COLORS: Record<string, Array<{ color: string; label: string }>> = {
  RLOH: [{ color: "#e86080", label: "ビビッドピンク" }, { color: "#f0c040", label: "ゴールド" }, { color: "#f0f0f0", label: "ピュアホワイト" }, { color: "#202020", label: "ブラック" }],
  RLOM: [{ color: "#202030", label: "ネイビー" }, { color: "#c0a070", label: "キャメル" }, { color: "#f0ece0", label: "オフホワイト" }, { color: "#606060", label: "チャコール" }],
  RLSH: [{ color: "#c07860", label: "テラコッタ" }, { color: "#809870", label: "セージグリーン" }, { color: "#e8d8c0", label: "サンド" }, { color: "#7050a0", label: "パープル" }],
  RLSM: [{ color: "#e0c0b0", label: "ブラッシュ" }, { color: "#c09070", label: "カッパー" }, { color: "#f0ece8", label: "アイボリー" }, { color: "#a07860", label: "テラコッタ" }],
  RGOH: [{ color: "#f0e8d8", label: "ベージュ" }, { color: "#e8d898", label: "シャンパン" }, { color: "#f0c8c8", label: "ブラッシュ" }, { color: "#c8d8e8", label: "ライトブルー" }],
  RGOM: [{ color: "#202030", label: "ネイビー" }, { color: "#b0a898", label: "グレーベージュ" }, { color: "#802040", label: "ワイン" }, { color: "#c08850", label: "コニャック" }],
  RGSH: [{ color: "#303040", label: "ダークネイビー" }, { color: "#888898", label: "グレー" }, { color: "#802020", label: "ダークレッド" }, { color: "#f0ece8", label: "アイボリー" }],
  RGSM: [{ color: "#202020", label: "ブラック" }, { color: "#4040c0", label: "コバルト" }, { color: "#e06040", label: "バーント" }, { color: "#f0f0f0", label: "ホワイト" }],
  ALOH: [{ color: "#f0b888", label: "ピーチ" }, { color: "#f8e8d8", label: "クリーム" }, { color: "#d0e8d8", label: "ミントグリーン" }, { color: "#e8a0a8", label: "コーラルピンク" }],
  ALOM: [{ color: "#c02030", label: "レッド" }, { color: "#d08030", label: "オレンジ" }, { color: "#f0d870", label: "イエロー" }, { color: "#f0f0f0", label: "ホワイト" }],
  ALSH: [{ color: "#c0a8e0", label: "ラベンダー" }, { color: "#f0e8f8", label: "パール" }, { color: "#b8e8e0", label: "アクア" }, { color: "#f8d8e8", label: "ペールピンク" }],
  ALSM: [{ color: "#d4a8b0", label: "ローズ" }, { color: "#f0ece8", label: "クリーム" }, { color: "#c0d0b8", label: "セージ" }, { color: "#a09080", label: "モカ" }],
  AGOH: [{ color: "#404080", label: "インディゴ" }, { color: "#303030", label: "チャコール" }, { color: "#f0f0f0", label: "ホワイト" }, { color: "#808090", label: "グレー" }],
  AGOM: [{ color: "#5080b0", label: "スティールブルー" }, { color: "#f0f0f0", label: "ホワイト" }, { color: "#606870", label: "グラファイト" }, { color: "#f0ece0", label: "アイボリー" }],
  AGSH: [{ color: "#8060c0", label: "バイオレット" }, { color: "#c0c0d0", label: "シルバー" }, { color: "#204848", label: "ディープティール" }, { color: "#f0f0f0", label: "ホワイト" }],
  AGSM: [{ color: "#802040", label: "バーガンディ" }, { color: "#c0a040", label: "ゴールド" }, { color: "#204030", label: "ダークグリーン" }, { color: "#f0ece8", label: "アイボリー" }],
}

const DEFAULT_COLORS = [
  { color: "#c9a8d4", label: "ラベンダー" },
  { color: "#c9a0a8", label: "ダスティローズ" },
  { color: "#8a9aaa", label: "スモーキー" },
  { color: "#b8967a", label: "ローズブラウン" },
]

// ─── 型定義 ─────────────────────────────────────────────────
interface CompatEntry {
  code: string
  name: string
  relation: string
  score: number
  desc: string
  advice: string
}

interface ContentData {
  compatibility?: CompatEntry[]
  makeup: string | null
  fashion: string | null
  hidden: string | null
  seasonal: string | null
  mole: string | null
}

interface Props {
  code: string
  plan: Plan
}

// ─── Markdown除去 ────────────────────────────────────────────
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

// ─── 展開式テキスト ──────────────────────────────────────────
function ExpandableText({ text, previewChars = 100 }: { text: string; previewChars?: number }) {
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

// ─── アコーディオン ──────────────────────────────────────────
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

// ─── セクションラッパー ──────────────────────────────────────
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

// ─── 隠れた一面 ──────────────────────────────────────────────
function HiddenSection({ text }: { text: string }) {
  const blocks = parseBlocks(text)
  const [first, second, ...rest] = blocks
  const accordionLabels = ["🎭 意外な才能", "🔋 ストレス時のパターン", "🤝 深く付き合った人だけが知ること"]
  return (
    <div>
      {/* リード文 2つをカード表示 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {first && (
          <div style={{ backgroundColor: "#F5F5FF", borderRadius: "12px", padding: "12px 14px" }}>
            <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, color: "#7070AA" }}>🔮 隠れた本質</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#555", lineHeight: 1.7 }}>
              {first}
            </p>
          </div>
        )}
        {second && (
          <div style={{ backgroundColor: "#FFF5F8", borderRadius: "12px", padding: "12px 14px" }}>
            <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, color: "#C9546E" }}>💎 秘めたる力</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#555", lineHeight: 1.7 }}>
              {second}
            </p>
          </div>
        )}
      </div>
      {/* 残りのブロックをアコーディオン表示 */}
      {rest.slice(0, 3).map((para, i) => (
        <Accordion key={i} label={accordionLabels[i] ?? `詳細 ${i + 1}`}>
          <ExpandableText text={para} previewChars={100} />
        </Accordion>
      ))}
      {/* ブロックが少ない場合のフォールバック（first/secondもアコーディオンに） */}
      {blocks.length === 1 && first && (
        <Accordion label="🔮 詳細を見る">
          <ExpandableText text={first} previewChars={100} />
        </Accordion>
      )}
    </div>
  )
}

// ─── メイクアドバイス ────────────────────────────────────────
function MakeupSection({ text, code }: { text: string; code: string }) {
  const blocks = parseBlocks(text)
  const cats = [
    { emoji: "🌿", label: "ベースメイク", color: "#d4c5e8" },
    { emoji: "👁",  label: "アイメイク",   color: "#b8cfe8" },
    { emoji: "💋", label: "リップ",       color: "#e8b0b0" },
    { emoji: "✨", label: "全体の雰囲気", color: "#e8dbb0" },
  ]
  const swatches = MAKEUP_COLORS[code] ?? DEFAULT_COLORS
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
                {block}
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

// ─── ファッションアドバイス ──────────────────────────────────
function FashionSection({ text, code }: { text: string; code: string }) {
  const blocks = parseBlocks(text)
  const cats = [
    { emoji: "👗", label: "スタイル・テイスト", color: "#d4c5e8" },
    { emoji: "🎨", label: "カラーパレット",    color: "#e8c0b0" },
    { emoji: "👜", label: "アイテム・小物",     color: "#b8cfe8" },
    { emoji: "✂️", label: "素材・シルエット",  color: "#c5e8c5" },
  ]
  const swatches = FASHION_COLORS[code] ?? DEFAULT_COLORS
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
                {block}
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

// ─── 相性詳細版（Claude生成） ────────────────────────────────
function CompatibilityDetailSection({ entries }: { entries: CompatEntry[] }) {
  // スコア降順ソート
  const sorted = [...entries].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  function scoreColor(score: number): string {
    if (score >= 80) return "#C9546E"
    if (score >= 60) return "#B07D30"
    if (score >= 40) return "#5080A0"
    return "#888"
  }

  function scoreBg(score: number): string {
    if (score >= 80) return "#FFF0F4"
    if (score >= 60) return "#FFFBF0"
    if (score >= 40) return "#F0F6FF"
    return "#F8F8F8"
  }

  function scoreBorder(score: number): string {
    if (score >= 80) return "#E8A0B4"
    if (score >= 60) return "#F0C060"
    if (score >= 40) return "#90B8D8"
    return "#ddd"
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {sorted.map(entry => {
        const score = entry.score ?? 50
        const col = scoreColor(score)
        const bg = scoreBg(score)
        const border = scoreBorder(score)
        return (
          <div
            key={entry.code}
            style={{
              backgroundColor: bg,
              borderRadius: "14px",
              border: `1px solid ${border}`,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {/* ヘッダー行 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "10px", fontWeight: 700, color: col,
                  backgroundColor: `${col}20`, padding: "2px 8px", borderRadius: "20px", letterSpacing: "0.08em"
                }}>
                  {entry.code}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#2a2a2a" }}>{entry.name}</span>
                <span style={{ fontSize: "12px", color: col, fontWeight: 600 }}>— {entry.relation}</span>
              </div>
              {/* スコアバー */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                <div style={{ width: "60px", height: "6px", backgroundColor: "#e8e8e8", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${score}%`, height: "100%", backgroundColor: col, borderRadius: "3px" }} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: col }}>{score}</span>
              </div>
            </div>
            {/* 関係性説明 */}
            {entry.desc && (
              <p style={{ margin: 0, fontSize: "12px", color: "#666", lineHeight: 1.7 }}>{entry.desc}</p>
            )}
            {/* 付き合い方アドバイス */}
            {entry.advice && (
              <div style={{ backgroundColor: "rgba(255,255,255,0.7)", borderRadius: "8px", padding: "8px 10px", borderLeft: `3px solid ${col}` }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#444", lineHeight: 1.7 }}>
                  <span style={{ fontWeight: 700, color: col }}>💡 </span>{entry.advice}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── 過去の診断との比較 ──────────────────────────────────────
function PastDiagnosisSection() {
  const [history, setHistory] = useState<Array<{ code: string; date: string }>>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('face_code_history')
      if (raw) setHistory(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  return (
    <div>
      {history.length < 2 ? (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#aaa", fontSize: "13px" }}>
          <p style={{ margin: "0 0 6px" }}>🔍 過去の診断が2回以上あると比較が表示されます</p>
          <p style={{ margin: 0, fontSize: "12px" }}>診断を繰り返すことで変化を追跡できます</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {history.slice(-5).reverse().map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#FFF8F5", borderRadius: "12px" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#C9546E", letterSpacing: "2px" }}>{h.code}</span>
              <span style={{ fontSize: "12px", color: "#aaa" }}>{h.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── パーソナルメイクアドバイス（継続プラン・Vision API） ────
interface VisionMakeup { skin: string; eyes: string; lips: string; cheeks: string }

function PersonalizedMakeupSection({ code }: { code: string }) {
  const [status, setStatus] = useState<"loading" | "done" | "no_image" | "error">("loading")
  const [result, setResult] = useState<VisionMakeup | null>(null)

  const analyze = useCallback(async () => {
    let image: string | null = null
    try { image = localStorage.getItem(`face_code_img_${code}`) } catch { /* ignore */ }

    if (!image) { setStatus("no_image"); return }

    try {
      const res = await fetch("/api/makeup-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, typeCode: code }),
      })
      if (!res.ok) throw new Error()
      const data: VisionMakeup = await res.json()
      if (!data.skin) throw new Error()
      setResult(data)
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }, [code])

  useEffect(() => { analyze() }, [analyze])

  const cats: Array<{ key: keyof VisionMakeup; emoji: string; label: string; color: string }> = [
    { key: "skin",   emoji: "🌿", label: "ベースメイク",    color: "#d4c5e8" },
    { key: "eyes",   emoji: "👁",  label: "アイメイク",      color: "#b8cfe8" },
    { key: "lips",   emoji: "💋", label: "リップ",          color: "#e8b0b0" },
    { key: "cheeks", emoji: "✨", label: "チーク・ハイライト", color: "#e8dbb0" },
  ]

  if (status === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", backgroundColor: "#FFF0F9", borderRadius: "14px", border: "1px solid #f0c0d8" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #E8A0A0", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: "13px", color: "#C9546E", fontWeight: 600 }}>あなたの顔写真を分析中…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: "100px", borderRadius: "14px", background: "linear-gradient(90deg,#f5f0f8 25%,#ede8f5 50%,#f5f0f8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
        ))}
        <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
      </div>
    )
  }

  if (status === "no_image") {
    return (
      <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#FFF8F5", borderRadius: "14px", border: "1px dashed #E8A0A0" }}>
        <Camera style={{ width: "28px", height: "28px", color: "#E8A0A0", margin: "0 auto 10px", display: "block" }} />
        <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#555" }}>顔写真データが見つかりません</p>
        <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>診断ページで写真をアップロードすると、このデバイス・ブラウザで閲覧した際にパーソナル分析が表示されます</p>
      </div>
    )
  }

  if (status === "error" || !result) {
    return (
      <div style={{ textAlign: "center", padding: "16px", color: "#aaa", fontSize: "13px" }}>
        <p>分析に失敗しました。</p>
        <button onClick={analyze} style={{ marginTop: "8px", fontSize: "12px", color: "#C9546E", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          再試行する
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* パーソナル感バナー */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", backgroundColor: "#FFF0F9", borderRadius: "14px", border: "1px solid #f0c0d8" }}>
        <Camera style={{ width: "18px", height: "18px", color: "#C9546E", flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: "12px", color: "#C9546E", fontWeight: 600 }}>
          あなたの顔写真をAIが解析した、パーソナルメイクアドバイスです
        </p>
      </div>
      {/* 4カード */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {cats.map(cat => (
          <div key={cat.key} style={{ backgroundColor: "#FFF8F5", borderRadius: "14px", padding: "14px", borderTop: `3px solid ${cat.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span style={{ fontSize: "15px" }}>{cat.emoji}</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#555" }}>{cat.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#444", lineHeight: 1.8 }}>{result[cat.key]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


// ─── メインコンポーネント ────────────────────────────────────
export function PurchasedContent({ code, plan }: Props) {
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [moleResult, setMoleResult] = useState<DiagnosisResult[] | null>(null)

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
      <p className="text-foreground/50 text-sm">詳細レポートを生成中です…（1〜2分かかる場合があります）</p>
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
      {/* 相性詳細版（Claude生成 16タイプ詳細） */}
      {content.compatibility && content.compatibility.length > 0 && (
        <Section icon={GitCompare} title="16タイプとの相性詳細" accentColor="#C9546E">
          <CompatibilityDetailSection entries={content.compatibility} />
        </Section>
      )}

      {content.hidden && (
        <Section icon={Eye} title="隠れた一面の分析" accentColor="#70A8D4">
          <HiddenSection text={content.hidden} />
        </Section>
      )}

      {/* 継続プラン：顔写真Vision分析によるパーソナルメイク / フルプラン：タイプ別固定メイク */}
      {plan === "subscription" ? (
        <Section icon={Camera} title="あなただけのパーソナルメイクアドバイス" accentColor="#C9546E">
          <PersonalizedMakeupSection code={code} />
        </Section>
      ) : content.makeup ? (
        <Section icon={Sparkles} title="メイクアドバイス" accentColor="#B0A0D4">
          <MakeupSection text={content.makeup} code={code} />
        </Section>
      ) : null}

      {content.fashion && (
        <Section icon={Shirt} title="ファッションアドバイス" accentColor="#A0C4A0">
          <FashionSection text={content.fashion} code={code} />
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
            ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {moleResult.map((r, i) => (
                  <div key={i} style={{
                    backgroundColor: r.type === "mole" ? "#FFF8F5" : "#FFF5F0",
                    borderRadius: "12px", padding: "14px 16px",
                    borderLeft: `3px solid ${r.type === "mole" ? "#2A1008" : "#8B6050"}`,
                  }}>
                    <p style={{ margin: "0 0 6px", fontSize: "12px", fontWeight: 700, color: r.type === "mole" ? "#2A1008" : "#8B6050" }}>
                      {r.type === "mole" ? "●" : "〜"} {r.location}
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#555", lineHeight: 1.8 }}>{r.advice}</p>
                  </div>
                ))}
                <button
                  onClick={() => setMoleResult(null)}
                  style={{ marginTop: "4px", fontSize: "12px", color: "#C9546E", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  もう一度診断する
                </button>
              </div>
            )
            : <MoleWrinkleCanvas code={code} onResult={setMoleResult} />
          }
        </Section>
      )}

      {plan === "subscription" && (
        <Section icon={GitCompare} title="過去の診断との比較" accentColor="#A0A8D4">
          <PastDiagnosisSection />
        </Section>
      )}
    </div>
  )
}

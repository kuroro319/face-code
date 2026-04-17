"use client"

import { useEffect, useState } from "react"
import { Heart, TrendingUp, ChevronDown } from "lucide-react"

interface FreeContent {
  love: string
  fortune: string
}

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

function ExpandableText({ text, previewChars = 80 }: { text: string; previewChars?: number }) {
  const [open, setOpen] = useState(false)
  const isLong = text.length > previewChars
  return (
    <div>
      <p style={{ margin: 0, fontSize: "14px", color: "#555", lineHeight: 1.8 }}>
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

const TYPE_JOBS: Record<string, { emoji: string; label: string }[]> = {
  RLOH: [
    { emoji: "🎤", label: "タレント・俳優" },
    { emoji: "📸", label: "インフルエンサー" },
    { emoji: "🛍️", label: "ブランドアンバサダー" },
    { emoji: "🎉", label: "イベントプロデューサー" },
  ],
  RLOM: [
    { emoji: "👔", label: "経営者・CEO" },
    { emoji: "🗂️", label: "プロジェクトマネージャー" },
    { emoji: "⚖️", label: "政治家・行政官" },
    { emoji: "🏗️", label: "建設・インフラ統括" },
  ],
  RLSH: [
    { emoji: "🎨", label: "グラフィックデザイナー" },
    { emoji: "🎮", label: "ゲームデザイナー" },
    { emoji: "🎬", label: "映像クリエイター" },
    { emoji: "✏️", label: "イラストレーター" },
  ],
  RLSM: [
    { emoji: "🎬", label: "映画・TV プロデューサー" },
    { emoji: "🎵", label: "音楽プロデューサー" },
    { emoji: "📋", label: "編集長・ディレクター" },
    { emoji: "🗓️", label: "イベントプランナー" },
  ],
  RGOH: [
    { emoji: "🌐", label: "外交官・国際公務員" },
    { emoji: "💼", label: "グローバル営業" },
    { emoji: "🗣️", label: "通訳・翻訳家" },
    { emoji: "📣", label: "PR・広報ディレクター" },
  ],
  RGOM: [
    { emoji: "🧩", label: "戦略コンサルタント" },
    { emoji: "📈", label: "マーケティングディレクター" },
    { emoji: "🏦", label: "M&Aアドバイザー" },
    { emoji: "🔎", label: "ビジネスアナリスト" },
  ],
  RGSH: [
    { emoji: "📰", label: "調査報道ジャーナリスト" },
    { emoji: "🔍", label: "データサイエンティスト" },
    { emoji: "⚖️", label: "弁護士・法律家" },
    { emoji: "🛡️", label: "セキュリティアナリスト" },
  ],
  RGSM: [
    { emoji: "🚀", label: "スタートアップ起業家" },
    { emoji: "💡", label: "イノベーションリード" },
    { emoji: "💰", label: "ベンチャーキャピタリスト" },
    { emoji: "📢", label: "社会活動家・NPO代表" },
  ],
  ALOH: [
    { emoji: "🧠", label: "心理カウンセラー" },
    { emoji: "🏥", label: "医療ソーシャルワーカー" },
    { emoji: "🌱", label: "キャリアコーチ" },
    { emoji: "👩‍⚕️", label: "看護師・作業療法士" },
  ],
  ALOM: [
    { emoji: "🎓", label: "教師・大学講師" },
    { emoji: "🎙️", label: "モチベーションコーチ" },
    { emoji: "🌍", label: "コミュニティマネージャー" },
    { emoji: "📖", label: "教育コンテンツクリエイター" },
  ],
  ALSH: [
    { emoji: "📚", label: "小説家・詩人" },
    { emoji: "🎮", label: "ゲームシナリオライター" },
    { emoji: "🖼️", label: "コンセプトアーティスト" },
    { emoji: "🎭", label: "舞台演出家" },
  ],
  ALSM: [
    { emoji: "🏛️", label: "行政・公務員" },
    { emoji: "📋", label: "コンプライアンス担当" },
    { emoji: "🤝", label: "福祉士・支援員" },
    { emoji: "🚨", label: "危機管理専門家" },
  ],
  AGOH: [
    { emoji: "🏫", label: "哲学者・倫理学者" },
    { emoji: "📝", label: "思想・評論家" },
    { emoji: "🎓", label: "大学教授" },
    { emoji: "📖", label: "ノンフィクション作家" },
  ],
  AGOM: [
    { emoji: "🔬", label: "科学者・研究者" },
    { emoji: "💊", label: "医学・創薬研究者" },
    { emoji: "🖥️", label: "AIエンジニア" },
    { emoji: "📊", label: "シンクタンク研究員" },
  ],
  AGSH: [
    { emoji: "📡", label: "トレンドアナリスト" },
    { emoji: "🏢", label: "経営コンサルタント" },
    { emoji: "🔎", label: "マーケットリサーチャー" },
    { emoji: "💹", label: "投資アドバイザー" },
  ],
  AGSM: [
    { emoji: "⚖️", label: "弁護士・法律顧問" },
    { emoji: "💴", label: "財務・税務アドバイザー" },
    { emoji: "🎓", label: "学部長・教授" },
    { emoji: "🏛️", label: "経営顧問・シニアコンサル" },
  ],
}

const DEFAULT_JOBS = [
  { emoji: "🔬", label: "リサーチャー" },
  { emoji: "📊", label: "アナリスト" },
  { emoji: "🎨", label: "クリエイター" },
  { emoji: "💬", label: "カウンセラー" },
]

function FortuneSection({ text, code }: { text: string; code: string }) {
  const blocks = parseBlocks(text)
  const strengths = ["先を読む力", "本質を見抜く目", "直感力", "洞察力"]
  const jobs = TYPE_JOBS[code] ?? DEFAULT_JOBS
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

function SkeletonBlock({ height = 80 }: { height?: number }) {
  return (
    <div style={{ height, borderRadius: "12px", background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
  )
}

export function FreeGeneratedContent({ code }: { code: string }) {
  const [content, setContent] = useState<FreeContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/free-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(r => r.json())
      .then(data => { setContent(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [code])

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "0 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* 恋愛傾向 */}
      <Section icon={Heart} title="恋愛傾向" accentColor="#E8A0A0">
        {loading || !content?.love
          ? <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}><SkeletonBlock /><SkeletonBlock height={60} /><SkeletonBlock height={60} /></div>
          : <LoveSection text={content.love} />
        }
      </Section>

      {/* 仕事運・財産運 */}
      <Section icon={TrendingUp} title="仕事運・財産運" accentColor="#74C98A">
        {loading || !content?.fortune
          ? <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}><SkeletonBlock /><SkeletonBlock height={60} /><SkeletonBlock height={60} /></div>
          : <FortuneSection text={content.fortune} code={code} />
        }
      </Section>
    </div>
  )
}

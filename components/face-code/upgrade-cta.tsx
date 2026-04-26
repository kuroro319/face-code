"use client"

import { useState } from "react"
import { Sparkles, Eye, ChevronRight, Check, Lock, CreditCard, Flower2, Moon, Shirt, GitCompare, Camera, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type PlanType = "full" | "subscription"

interface UpgradeCtaProps {
  code: string
}

const MODAL_DETAILS: Record<PlanType, { title: string; price: string; items: { label: string; desc: string }[] }> = {
  full: {
    title: "フルプラン",
    price: "¥580 買い切り",
    items: [
      { label: "隠れた一面の分析", desc: "タイプ特有の隠れた才能・ストレス時の行動パターンを深掘り分析。深く付き合った人だけが気づく秘密の一面がわかります。" },
      { label: "メイクアドバイス（タイプ別）", desc: "あなたのタイプに合ったメイクスタイル・おすすめコスメを提案。似合う色・質感・テイストが一目でわかります。" },
      { label: "ファッションアドバイス", desc: "タイプ別のおすすめスタイル・カラー・アイテムを提案。自分らしさを引き出すコーデのヒントが得られます。" },
      { label: "相性詳細版（16タイプ全分析）", desc: "全16タイプとの詳細な相性・付き合い方のコツ・恋愛での注意点を網羅。" },
    ],
  },
  subscription: {
    title: "継続プラン",
    price: "¥880/月",
    items: [
      { label: "隠れた一面の分析", desc: "タイプ特有の隠れた才能・ストレス時の行動パターンを深掘り分析。深く付き合った人だけが気づく秘密の一面がわかります。" },
      { label: "メイクアドバイス（タイプ別）", desc: "あなたのタイプに合ったメイクスタイル・おすすめコスメを提案。似合う色・質感・テイストが一目でわかります。" },
      { label: "ファッションアドバイス", desc: "タイプ別のおすすめスタイル・カラー・アイテムを提案。自分らしさを引き出すコーデのヒントが得られます。" },
      { label: "相性詳細版（16タイプ全分析）", desc: "全16タイプとの詳細な相性・付き合い方のコツ・恋愛での注意点を網羅。" },
      { label: "パーソナルメイクアドバイス", desc: "あなたの顔写真をAIが直接分析。目の形・肌トーン・輪郭に合わせた完全個別のメイクアドバイスを提供。" },
      { label: "ほくろ・シワ詳細診断", desc: "顔のほくろ・シワの位置から運勢・性格・才能を詳細に診断。タッチで選択できるインタラクティブUI。" },
      { label: "季節メイクアドバイス更新", desc: "春夏秋冬に合わせて更新されるトレンドメイクアドバイス。" },
      { label: "月1再診断", desc: "毎月1回、新しい写真で再診断が可能。変化していく自分を記録できます。" },
    ],
  },
}

export function UpgradeCta({ code }: UpgradeCtaProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("full")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalPlan, setModalPlan] = useState<PlanType | null>(null)

  const plans = {
    full: {
      name: "フル",
      price: "¥580",
      priceNote: "1回限り",
      features: [
        { icon: Eye, label: "隠れた一面の分析", included: true },
        { icon: Sparkles, label: "メイクアドバイス（タイプ別）", included: true },
        { icon: Shirt, label: "ファッションアドバイス", included: true },
        { icon: Sparkles, label: "相性詳細版（16タイプ全分析）", included: true },
        { icon: Flower2, label: "ほくろ・シワ詳細診断", included: false },
        { icon: GitCompare, label: "過去の診断との比較", included: false },
        { icon: Moon, label: "季節メイクアドバイス更新", included: false },
      ]
    },
    subscription: {
      name: "継続",
      price: "¥880",
      priceNote: "/月",
      features: [
        { icon: Eye, label: "隠れた一面の分析", included: true },
        { icon: Sparkles, label: "メイクアドバイス", included: true },
        { icon: Shirt, label: "ファッションアドバイス", included: true },
        { icon: GitCompare, label: "相性詳細版（16タイプ全分析）", included: true },
        { icon: Camera, label: "パーソナルメイクアドバイス（顔写真から個別分析）", included: true },
        { icon: Flower2, label: "ほくろ・シワ詳細診断", included: true },
        { icon: Moon, label: "季節メイクアドバイス更新", included: true },
        { icon: RefreshCw, label: "月1再診断", included: true },
      ]
    }
  }

  const handlePurchase = async (plan?: PlanType) => {
    const targetPlan = plan ?? selectedPlan
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: targetPlan, code }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? '決済ページへの接続に失敗しました。時間をおいて再度お試しください。')
      }
    } catch {
      setError('ネットワークエラーが発生しました。時間をおいて再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const currentPlan = plans[selectedPlan]
  const modalDetail = modalPlan ? MODAL_DETAILS[modalPlan] : null

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Locked Preview */}
        <div className="mb-8 relative">
          <div className="bg-white rounded-2xl p-6 border border-[#E8A0A0]/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#E8A0A0]/10 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-[#E8A0A0]" />
                </div>
                <p className="text-foreground/60 text-sm">詳細レポートを購入してロックを解除</p>
              </div>
            </div>
            <div className="blur-sm select-none" aria-hidden="true">
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground/80">隠れた一面の分析</h3>
              <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                表には見せない内面には、驚くべき才能が隠されています。ストレスがかかると
                普段とはまったく違う一面が現れ、深く付き合った人だけが気づく秘密があります...
              </p>
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground/80">ファッションアドバイス</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#E8A0A0]/10 rounded-full text-sm">スタイル</span>
                <span className="px-3 py-1 bg-[#7EB8C9]/10 rounded-full text-sm">カラー</span>
                <span className="px-3 py-1 bg-[#A889BD]/10 rounded-full text-sm">アイテム</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {(["full", "subscription"] as PlanType[]).map((planKey) => {
            const plan = plans[planKey]
            const isSelected = selectedPlan === planKey
            return (
              <div
                key={planKey}
                className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-[#E8A0A0] bg-gradient-to-br from-white to-[#FFF8F5] shadow-lg"
                    : "border-foreground/10 bg-white/50"
                }`}
              >
                {planKey === "full" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#E8A0A0] to-[#D4847B] text-white text-xs rounded-full whitespace-nowrap">
                    おすすめ
                  </span>
                )}
                {/* Select area (clickable) */}
                <button
                  onClick={() => setSelectedPlan(planKey)}
                  className="w-full text-left"
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#E8A0A0] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className={`inline-block px-3 py-1 text-xs rounded-full mb-3 ${
                    isSelected ? "bg-[#E8A0A0]/10 text-[#E8A0A0]" : "bg-foreground/5 text-foreground/60"
                  }`}>
                    {plan.name}
                  </span>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground/90">{plan.price}</span>
                    <span className="text-foreground/50 text-sm ml-1">{plan.priceNote}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-[#E8A0A0] shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-foreground/30 shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground/70" : "text-foreground/40"}>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </button>

                {/* 詳しく見る button */}
                <button
                  onClick={() => setModalPlan(planKey)}
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    padding: "9px",
                    border: "1.5px solid #E8A0A0",
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    color: "#E8A0A0",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(232,160,160,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  詳しく見る
                  <ChevronRight style={{ width: "14px", height: "14px" }} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Purchase CTA */}
        <div className="bg-gradient-to-br from-[#2D2A3E] to-[#1E1B2E] rounded-3xl p-6 md:p-8 text-white">
          <div className="text-center mb-6">
            <h3 className="text-xl font-serif font-semibold mb-2">
              {currentPlan.name}プランを購入
            </h3>
            <p className="text-white/60 text-sm">
              購入後すぐに詳細レポートが閲覧できます
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[#E8A0A0] to-[#D4847B] hover:from-[#D4847B] hover:to-[#C67068] text-white border-0 rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-[#E8A0A0]/20 mb-6"
            onClick={() => handlePurchase()}
            disabled={loading}
          >
            {loading ? "処理中..." : `${currentPlan.price}${selectedPlan === "subscription" ? "/月" : ""}で購入する`}
            {!loading && <ChevronRight className="w-5 h-5 ml-1" />}
          </Button>

          {/* Payment Methods */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <CreditCard className="w-4 h-4" />
              <span>クレジットカード</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <div className="w-4 h-4 bg-[#FF0033] rounded-sm flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">P</span>
              </div>
              <span>PayPay</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <div className="w-4 h-4 bg-[#00B900] rounded-sm flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">L</span>
              </div>
              <span>LINE Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {modalPlan && modalDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={e => { if (e.target === e.currentTarget) setModalPlan(null) }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              position: "relative",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                background: "linear-gradient(135deg, #E8A0A0, #D4847B)",
                borderRadius: "24px 24px 0 0",
                padding: "28px 28px 24px",
                color: "#fff",
              }}
            >
              <button
                onClick={() => setModalPlan(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(255,255,255,0.25)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
              <p style={{ fontSize: "12px", opacity: 0.85, marginBottom: "4px" }}>プラン詳細</p>
              <h3 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>{modalDetail.title}</h3>
              <p style={{ fontSize: "16px", fontWeight: 600, opacity: 0.9, margin: 0 }}>{modalDetail.price}</p>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px 28px 28px" }}>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {modalDetail.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        flexShrink: 0,
                        marginTop: "2px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(232,160,160,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check style={{ width: "12px", height: "12px", color: "#E8A0A0" }} />
                    </span>
                    <div>
                      <p style={{ margin: "0 0 3px", fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{item.label}</p>
                      <p style={{ margin: 0, fontSize: "13px", color: "#777", lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Purchase button inside modal */}
              <button
                onClick={() => {
                  setSelectedPlan(modalPlan)
                  setModalPlan(null)
                  handlePurchase(modalPlan)
                }}
                disabled={loading}
                style={{
                  marginTop: "24px",
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #E8A0A0, #D4847B)",
                  border: "none",
                  borderRadius: "14px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "処理中..." : `${MODAL_DETAILS[modalPlan].price}で購入する`}
                {!loading && <ChevronRight style={{ width: "16px", height: "16px" }} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

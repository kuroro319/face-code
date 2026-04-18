"use client"

import { useState } from "react"
import { Sparkles, Eye, ChevronRight, Check, Lock, CreditCard, Flower2, Moon, Shirt, GitCompare, Camera, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type PlanType = "full" | "subscription"

interface UpgradeCtaProps {
  code: string
}

export function UpgradeCta({ code }: UpgradeCtaProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("full")
  const [loading, setLoading] = useState(false)

  const plans = {
    full: {
      name: "フル",
      price: "¥580",
      priceNote: "1回限り",
      features: [
        { icon: Eye, label: "隠れた一面の分析", included: true },
        { icon: Sparkles, label: "メイクアドバイス", included: true },
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
        { icon: Camera, label: "パーソナルメイクアドバイス（顔写真分析）", included: true },
        { icon: Flower2, label: "ほくろ・シワ詳細診断", included: true },
        { icon: Moon, label: "季節メイクアドバイス更新", included: true },
        { icon: RefreshCw, label: "月1再診断", included: true },
      ]
    }
  }

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, code }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(false)
    }
  }

  const currentPlan = plans[selectedPlan]

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
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-[#E8A0A0] bg-gradient-to-br from-white to-[#FFF8F5] shadow-lg"
                    : "border-foreground/10 bg-white/50 hover:border-foreground/20"
                }`}
              >
                {planKey === "full" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#E8A0A0] to-[#D4847B] text-white text-xs rounded-full whitespace-nowrap">
                    おすすめ
                  </span>
                )}
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

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[#E8A0A0] to-[#D4847B] hover:from-[#D4847B] hover:to-[#C67068] text-white border-0 rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-[#E8A0A0]/20 mb-6"
            onClick={handlePurchase}
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
    </section>
  )
}

"use client"

import { useState } from "react"
import { Heart, Users, Sparkles, Eye, ChevronRight, Check, Lock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

type PlanType = "light" | "full"

export function UpgradeCta() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("full")

  const plans = {
    light: {
      name: "Light",
      price: "¥200",
      features: [
        { icon: Users, label: "16タイプとの相性一覧", included: true },
        { icon: Heart, label: "恋愛傾向の詳細", included: true },
        { icon: Sparkles, label: "メイクアドバイス", included: false },
        { icon: Eye, label: "隠れた一面の分析", included: false },
      ]
    },
    full: {
      name: "Full",
      price: "¥480",
      features: [
        { icon: Users, label: "16タイプとの相性一覧", included: true },
        { icon: Heart, label: "恋愛傾向の詳細", included: true },
        { icon: Sparkles, label: "メイクアドバイス", included: true },
        { icon: Eye, label: "隠れた一面の分析", included: true },
      ]
    }
  }

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
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground/80">恋愛傾向</h3>
              <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                あなたは恋愛において情熱的で、一度好きになると一途に愛を注ぐタイプです。
                ドラマチックな展開を好み、サプライズや特別な演出で相手を喜ばせたいと考えます...
              </p>
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground/80">相性ランキング</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#E8A0A0]/10 rounded-full text-sm">1位: SLKH</span>
                <span className="px-3 py-1 bg-[#7EB8C9]/10 rounded-full text-sm">2位: RMOH</span>
                <span className="px-3 py-1 bg-[#A889BD]/10 rounded-full text-sm">3位: RLKF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Light Plan */}
          <button
            onClick={() => setSelectedPlan("light")}
            className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
              selectedPlan === "light"
                ? "border-[#E8A0A0] bg-white shadow-lg"
                : "border-foreground/10 bg-white/50 hover:border-foreground/20"
            }`}
          >
            {selectedPlan === "light" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#E8A0A0] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="inline-block px-3 py-1 bg-foreground/5 text-foreground/60 text-xs rounded-full mb-3">
              Light
            </span>
            <div className="mb-4">
              <span className="text-3xl font-bold text-foreground/90">¥200</span>
              <span className="text-foreground/50 text-sm ml-1">（税込）</span>
            </div>
            <ul className="space-y-2">
              {plans.light.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-[#E8A0A0]" />
                  ) : (
                    <Lock className="w-4 h-4 text-foreground/30" />
                  )}
                  <span className={feature.included ? "text-foreground/70" : "text-foreground/40"}>
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>
          </button>

          {/* Full Plan */}
          <button
            onClick={() => setSelectedPlan("full")}
            className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
              selectedPlan === "full"
                ? "border-[#E8A0A0] bg-gradient-to-br from-white to-[#FFF8F5] shadow-lg"
                : "border-foreground/10 bg-white/50 hover:border-foreground/20"
            }`}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#E8A0A0] to-[#D4847B] text-white text-xs rounded-full">
              おすすめ
            </span>
            {selectedPlan === "full" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#E8A0A0] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="inline-block px-3 py-1 bg-[#E8A0A0]/10 text-[#E8A0A0] text-xs rounded-full mb-3">
              Full
            </span>
            <div className="mb-4">
              <span className="text-3xl font-bold text-foreground/90">¥480</span>
              <span className="text-foreground/50 text-sm ml-1">（税込）</span>
            </div>
            <ul className="space-y-2">
              {plans.full.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-[#E8A0A0]" />
                  <span className="text-foreground/70">{feature.label}</span>
                </li>
              ))}
            </ul>
          </button>
        </div>

        {/* Purchase CTA */}
        <div className="bg-gradient-to-br from-[#2D2A3E] to-[#1E1B2E] rounded-3xl p-6 md:p-8 text-white">
          <div className="text-center mb-6">
            <h3 className="text-xl font-serif font-semibold mb-2">
              {selectedPlan === "light" ? "Light プラン" : "Full プラン"}を購入
            </h3>
            <p className="text-white/60 text-sm">
              購入後すぐに詳細レポートが閲覧できます
            </p>
          </div>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[#E8A0A0] to-[#D4847B] hover:from-[#D4847B] hover:to-[#C67068] text-white border-0 rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-[#E8A0A0]/20 mb-6"
            onClick={() => alert('購入ページへ遷移します')}
          >
            {selectedPlan === "light" ? "¥200" : "¥480"}で購入する
            <ChevronRight className="w-5 h-5 ml-1" />
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

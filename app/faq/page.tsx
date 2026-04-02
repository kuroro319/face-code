"use client"

import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/face-code/footer"

const faqs = [
  {
    q: "FACE CODEとは何ですか？",
    a: "FACE CODEは、顔のパーツ（目・鼻・口など）の特徴から性格タイプを診断するサービスです。人相学の知見をもとに、あなたの内面的な特性を6つのコードで表します。",
  },
  {
    q: "診断は無料で受けられますか？",
    a: "基本的な診断は無料でご利用いただけます。より詳細な結果や追加機能は有料プランでご利用いただけます。",
  },
  {
    q: "診断結果はどのくらい正確ですか？",
    a: "FACE CODEは人相学に基づいた性格傾向の参考情報です。医学的・科学的な診断ではありませんので、あくまで自己理解のヒントとしてお楽しみください。",
  },
  {
    q: "診断に使った写真は保存されますか？",
    a: "アップロードされた写真は診断処理にのみ使用し、サーバーには保存されません。詳しくはプライバシーポリシーをご確認ください。",
  },
  {
    q: "結果をSNSでシェアできますか？",
    a: "はい、診断結果ページからX（旧Twitter）・LINE・Instagramストーリーズ用のシェアカードを生成してシェアできます。",
  },
  {
    q: "タイプはいくつありますか？",
    a: "6つのアルファベット（F・A・C・E・O・D）の組み合わせで構成されるタイプがあります。タイプ一覧はトップページからご確認いただけます。",
  },
  {
    q: "解約・退会したい場合はどうすればよいですか？",
    a: "マイページの設定からいつでも退会手続きができます。ご不明な点はお問い合わせフォームよりご連絡ください。",
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={{ backgroundColor: "#FFF8F5", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{ borderBottom: "1px solid rgba(232, 160, 160, 0.2)", backgroundColor: "#FFF8F5" }}
        className="py-4 px-5"
      >
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight">
              <span style={{ color: "#E8A0A0" }}>FACE</span>
              <span style={{ color: "rgba(45,45,45,0.6)" }}>CODE</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="mb-12">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                backgroundColor: "rgba(232, 160, 160, 0.1)",
                color: "#E8A0A0",
                border: "1px solid rgba(232, 160, 160, 0.3)",
              }}
            >
              FAQ
            </span>
            <h1 className="text-3xl md:text-4xl font-black" style={{ color: "#2D2D2D" }}>
              よくある質問
            </h1>
            <p className="mt-3 leading-relaxed" style={{ color: "#888" }}>
              お客様からよくいただくご質問をまとめました。
              解決しない場合はお問い合わせフォームよりご連絡ください。
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(232, 160, 160, 0.2)",
                }}
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="text-sm font-bold" style={{ color: "#2D2D2D" }}>
                    <span style={{ color: "#E8A0A0" }} className="mr-2">Q.</span>
                    {faq.q}
                  </span>
                  <span
                    className="shrink-0 text-lg transition-transform"
                    style={{
                      color: "#E8A0A0",
                      transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                {openIndex === i && (
                  <div
                    className="px-6 pb-5 text-sm leading-relaxed"
                    style={{ color: "#555", borderTop: "1px solid rgba(232, 160, 160, 0.15)" }}
                  >
                    <p className="pt-4">
                      <span style={{ color: "#E8A0A0" }} className="font-bold mr-2">A.</span>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div
            className="mt-12 rounded-2xl p-8 text-center"
            style={{
              backgroundColor: "rgba(232, 160, 160, 0.06)",
              border: "1px solid rgba(232, 160, 160, 0.2)",
            }}
          >
            <p className="text-sm font-bold mb-2" style={{ color: "#2D2D2D" }}>
              解決しない場合はお気軽にご連絡ください
            </p>
            <p className="text-xs mb-5" style={{ color: "#888" }}>
              通常2〜3営業日以内にご返答いたします
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#E8A0A0", color: "#fff" }}
            >
              お問い合わせする
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

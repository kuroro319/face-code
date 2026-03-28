"use client"

import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/face-code/footer"

type FormState = "idle" | "loading" | "success" | "error"

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState("loading")
    // TODO: Replace with your actual form submission endpoint
    await new Promise((r) => setTimeout(r, 1200))
    setFormState("success")
  }

  return (
    <div style={{ backgroundColor: "#FFF8F5", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(232, 160, 160, 0.2)", backgroundColor: "#FFF8F5" }} className="py-4 px-5">
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
              style={{ backgroundColor: "rgba(232, 160, 160, 0.1)", color: "#E8A0A0", border: "1px solid rgba(232, 160, 160, 0.3)" }}
            >
              CONTACT
            </span>
            <h1 className="text-3xl md:text-4xl font-black" style={{ color: "#2D2D2D" }}>
              お問い合わせ
            </h1>
            <p className="mt-3 leading-relaxed" style={{ color: "#888" }}>
              ご不明な点やご要望がございましたら、以下のフォームよりお気軽にお問い合わせください。<br />
              通常、2〜3営業日以内にご返答いたします。
            </p>
          </div>

          {formState === "success" ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{ backgroundColor: "rgba(232, 160, 160, 0.08)", border: "2px solid rgba(232, 160, 160, 0.3)" }}
            >
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="text-xl font-black mb-3" style={{ color: "#2D2D2D" }}>送信が完了しました</h2>
              <p className="leading-relaxed mb-6" style={{ color: "#555" }}>
                お問い合わせありがとうございます。<br />
                2〜3営業日以内にご登録のメールアドレスへご返答いたします。
              </p>
              <button
                onClick={() => { setFormState("idle"); setForm({ name: "", email: "", category: "", message: "" }) }}
                className="inline-flex items-center px-6 py-2 rounded-full text-sm font-bold transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#E8A0A0", color: "#fff" }}
              >
                新しいお問い合わせ
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-8 space-y-6"
              style={{ backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(232, 160, 160, 0.2)" }}
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "#2D2D2D" }}>
                  お名前 <span style={{ color: "#E8A0A0" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="山田 太郎"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "#FFF8F5",
                    border: "1px solid rgba(232, 160, 160, 0.3)",
                    color: "#2D2D2D",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#E8A0A0")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(232, 160, 160, 0.3)")}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "#2D2D2D" }}>
                  メールアドレス <span style={{ color: "#E8A0A0" }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "#FFF8F5",
                    border: "1px solid rgba(232, 160, 160, 0.3)",
                    color: "#2D2D2D",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#E8A0A0")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(232, 160, 160, 0.3)")}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "#2D2D2D" }}>
                  お問い合わせ種別 <span style={{ color: "#E8A0A0" }}>*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                  style={{
                    backgroundColor: "#FFF8F5",
                    border: "1px solid rgba(232, 160, 160, 0.3)",
                    color: form.category ? "#2D2D2D" : "#aaa",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#E8A0A0")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(232, 160, 160, 0.3)")}
                >
                  <option value="" disabled>選択してください</option>
                  <option value="usage">サービスの使い方について</option>
                  <option value="billing">料金・決済について</option>
                  <option value="cancel">解約・退会について</option>
                  <option value="privacy">個人情報・プライバシーについて</option>
                  <option value="bug">不具合・エラーについて</option>
                  <option value="other">その他</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "#2D2D2D" }}>
                  お問い合わせ内容 <span style={{ color: "#E8A0A0" }}>*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="お問い合わせ内容をご記入ください"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                  style={{
                    backgroundColor: "#FFF8F5",
                    border: "1px solid rgba(232, 160, 160, 0.3)",
                    color: "#2D2D2D",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#E8A0A0")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(232, 160, 160, 0.3)")}
                />
              </div>

              {/* Privacy note */}
              <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
                送信いただいた情報は、お問い合わせ対応のみに使用します。詳しくは
                <Link href="/privacy" style={{ color: "#E8A0A0" }} className="underline mx-1">プライバシーポリシー</Link>
                をご確認ください。
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={formState === "loading"}
                className="w-full py-4 rounded-full text-base font-black transition-all active:scale-95"
                style={{
                  backgroundColor: formState === "loading" ? "rgba(232, 160, 160, 0.5)" : "#E8A0A0",
                  color: "#fff",
                  cursor: formState === "loading" ? "not-allowed" : "pointer",
                }}
              >
                {formState === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
                    />
                    送信中...
                  </span>
                ) : (
                  "送信する"
                )}
              </button>
            </form>
          )}

          {/* FAQ Links */}
          <div className="mt-8 text-center text-sm space-y-2" style={{ color: "#888" }}>
            <p>よくあるご質問は以下のページもご参照ください</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link href="/terms" style={{ color: "#E8A0A0" }} className="underline hover:opacity-70 transition-opacity">利用規約</Link>
              <Link href="/privacy" style={{ color: "#E8A0A0" }} className="underline hover:opacity-70 transition-opacity">プライバシーポリシー</Link>
              <Link href="/tokutei" style={{ color: "#E8A0A0" }} className="underline hover:opacity-70 transition-opacity">特定商取引法に基づく表記</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabase-client"

type Tab = "login" | "signup"

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [signupDone, setSignupDone] = useState(false)

  const supabase = getSupabaseBrowser()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    setError("")
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setLoading(false)
    if (err) {
      setError("メールアドレスまたはパスワードが正しくありません。")
    } else {
      router.replace("/")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。")
      return
    }
    setLoading(true)
    setError("")
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/`
        : "/auth/callback"
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: redirectTo },
    })
    setLoading(false)
    if (err) {
      if (
        err.message.includes("already registered") ||
        err.message.includes("User already registered")
      ) {
        setError(
          "このメールアドレスはすでに登録されています。ログインをお試しください。"
        )
      } else {
        setError("アカウントの作成に失敗しました。再度お試しください。")
      }
    } else {
      setSignupDone(true)
    }
  }

  const switchTab = (next: Tab) => {
    setTab(next)
    setError("")
    setPassword("")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF8F5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", marginBottom: "32px" }}>
        <span style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#E8A0A0" }}>FACE</span>
          <span style={{ color: "#555" }}>CODE</span>
        </span>
      </Link>

      {/* Card */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          padding: "36px 32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "28px",
          }}
        >
          {(["login", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              style={{
                flex: 1,
                padding: "9px",
                border: "none",
                borderRadius: "9px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: tab === t ? 700 : 400,
                backgroundColor: tab === t ? "#fff" : "transparent",
                color: tab === t ? "#E8A0A0" : "#999",
                boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              {t === "login" ? "ログイン" : "新規登録"}
            </button>
          ))}
        </div>

        {/* Signup complete */}
        {signupDone ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#F0FFF4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle style={{ width: "28px", height: "28px", color: "#48BB78" }} />
            </div>
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              確認メールを送信しました
            </h3>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "14px",
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              <strong>{email}</strong> に確認メールをお送りしました。
            </p>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: "13px",
                color: "#999",
                lineHeight: 1.6,
              }}
            >
              メール内のリンクをクリックするとアカウントが有効化されます。
              迷惑メールフォルダもご確認ください。
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                backgroundColor: "#E8A0A0",
                color: "#fff",
                borderRadius: "10px",
                padding: "11px 28px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              トップページへ戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={tab === "login" ? handleLogin : handleSignup}>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "20px",
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
              }}
            >
              {tab === "login" ? "ログイン" : "アカウント作成"}
            </h2>

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                メールアドレス
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "#ccc",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 12px 11px 36px",
                    border: "1.5px solid #E8E8E8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#1a1a1a",
                    backgroundColor: "#FAFAFA",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                パスワード
                {tab === "signup" && (
                  <span style={{ color: "#bbb", fontWeight: 400 }}>
                    （8文字以上）
                  </span>
                )}
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "#ccc",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === "signup" ? "8文字以上で入力" : "パスワード"}
                  required
                  style={{
                    width: "100%",
                    padding: "11px 40px 11px 36px",
                    border: "1.5px solid #E8E8E8",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#1a1a1a",
                    backgroundColor: "#FAFAFA",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#ccc",
                    padding: "0",
                    display: "flex",
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: "16px", height: "16px" }} />
                  ) : (
                    <Eye style={{ width: "16px", height: "16px" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: "13px",
                  color: "#E53E3E",
                  backgroundColor: "#FFF5F5",
                  border: "1px solid #FED7D7",
                  borderRadius: "8px",
                  padding: "10px 12px",
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                backgroundColor: loading ? "#F0C8C8" : "#E8A0A0",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
            >
              {loading
                ? "処理中..."
                : tab === "login"
                ? "ログイン"
                : "アカウントを作成"}
            </button>

            {/* Cross-tab link */}
            <p
              style={{
                margin: "20px 0 0",
                textAlign: "center",
                fontSize: "13px",
                color: "#999",
              }}
            >
              {tab === "login" ? (
                <>
                  アカウントをお持ちでない方は{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("signup")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#E8A0A0",
                      fontWeight: 600,
                      fontSize: "13px",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    こちら
                  </button>
                </>
              ) : (
                <>
                  すでにアカウントをお持ちの方は{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#E8A0A0",
                      fontWeight: 600,
                      fontSize: "13px",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    ログイン
                  </button>
                </>
              )}
            </p>
          </form>
        )}
      </div>

      {/* Back to top */}
      <Link
        href="/"
        style={{
          marginTop: "24px",
          fontSize: "13px",
          color: "#bbb",
          textDecoration: "none",
        }}
      >
        ← トップページへ戻る
      </Link>
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { MessageCircle, Send, Heart, Loader2, X, Mail, Globe } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

// ─── 型定義 ──────────────────────────────────────────────────
interface Comment {
  id: string
  username: string
  content: string
  likes: number
  created_at: string
}

interface CommunityCommentsSectionProps {
  typeName: string
  typeCode: string
}

// ─── ユーティリティ ───────────────────────────────────────────
const AVATAR_COLORS = [
  "from-[#E8A0A0] to-[#D4847B]",
  "from-[#D4847B] to-[#C67068]",
  "from-[#7EB8C9] to-[#5FA3B8]",
  "from-[#A889BD] to-[#9070A8]",
  "from-[#E8C0A0] to-[#D4A87B]",
  "from-[#A8BD89] to-[#90A870]",
]

function formatDate(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return "たった今"
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`
  return `${Math.floor(diff / 86400)}日前`
}

function getDisplayName(user: User): string {
  return (
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "ユーザー"
  )
}

// ─── ログインモーダル ────────────────────────────────────────
function LoginModal({ onClose, currentPath }: { onClose: () => void; currentPath: string }) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState<"email" | "google" | null>(null)
  const [error, setError] = useState("")
  const supabase = getSupabaseBrowser()

  const callbackUrl = typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(currentPath)}`
    : "/auth/callback"

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading("email")
    setError("")
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: callbackUrl,
      },
    })
    setLoading(null)
    if (err) {
      setError("メールの送信に失敗しました。再度お試しください。")
    } else {
      setSent(true)
    }
  }

  const handleGoogle = async () => {
    setLoading("google")
    setError("")
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    })
    if (err) {
      setError("Googleログインに失敗しました。")
      setLoading(null)
    }
    // 成功時はリダイレクトされるのでローディングはそのまま
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "32px 28px", maxWidth: "380px", width: "100%", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: "4px" }}
        >
          <X style={{ width: "18px", height: "18px" }} />
        </button>

        {/* ヘッダー */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#FFF0F4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <MessageCircle style={{ width: "24px", height: "24px", color: "#E8A0A0" }} />
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700, color: "#1a1a1a" }}>ログインしてコメント</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>同じタイプの仲間と交流しよう</p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📧</div>
            <p style={{ fontSize: "15px", color: "#333", lineHeight: 1.7, margin: "0 0 6px", fontWeight: 600 }}>メールを送信しました</p>
            <p style={{ fontSize: "13px", color: "#999", margin: 0 }}>メール内のリンクをクリックするとログインできます</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Googleログイン */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading !== null}
              style={{
                width: "100%", padding: "12px", borderRadius: "12px",
                border: "1.5px solid #e0e0e0", backgroundColor: "#fff",
                fontSize: "14px", fontWeight: 600, color: "#333",
                cursor: loading !== null ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                opacity: loading !== null ? 0.6 : 1, transition: "background 0.15s",
              }}
            >
              {loading === "google"
                ? <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                : <Globe style={{ width: "18px", height: "18px", color: "#4285F4" }} />
              }
              Googleでログイン
            </button>

            {/* 区切り */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#f0f0f0" }} />
              <span style={{ fontSize: "12px", color: "#ccc" }}>または</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#f0f0f0" }} />
            </div>

            {/* メールログイン */}
            <form onSubmit={handleEmailSend} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e0e0e0" }}>
                <Mail style={{ width: "16px", height: "16px", color: "#ccc", flexShrink: 0 }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="メールアドレスを入力"
                  required
                  style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", color: "#333", backgroundColor: "transparent" }}
                />
              </div>
              {error && <p style={{ margin: 0, fontSize: "12px", color: "#E8A0A0" }}>{error}</p>}
              <button
                type="submit"
                disabled={loading !== null || !email.trim()}
                style={{
                  width: "100%", padding: "12px", borderRadius: "12px",
                  background: "linear-gradient(to right, #E8A0A0, #D4847B)", color: "#fff",
                  border: "none", fontSize: "14px", fontWeight: 600,
                  cursor: loading !== null || !email.trim() ? "not-allowed" : "pointer",
                  opacity: loading !== null || !email.trim() ? 0.6 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {loading === "email" && <Loader2 style={{ width: "15px", height: "15px", animation: "spin 1s linear infinite" }} />}
                メールでログインリンクを送る
              </button>
            </form>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── メインコンポーネント ────────────────────────────────────
export function CommunityCommentsSection({ typeName, typeCode }: CommunityCommentsSectionProps) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [showLogin, setShowLogin] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loadingComments, setLoadingComments] = useState(true)
  const [likingId, setLikingId] = useState<string | null>(null)
  const currentPath = useRef(typeof window !== "undefined" ? window.location.pathname : "/")

  // ── コメント一覧を取得 ──────────────────────────────────────
  const loadComments = useCallback(async () => {
    setLoadingComments(true)
    try {
      const res = await fetch(`/api/comments?code=${typeCode}`)
      if (res.ok) setComments(await res.json())
    } finally {
      setLoadingComments(false)
    }
  }, [typeCode])

  // ── いいね済みIDを取得 ─────────────────────────────────────
  const loadLikedIds = useCallback(async (token: string) => {
    try {
      const res = await fetch(`/api/comments/liked?code=${typeCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const ids: string[] = await res.json()
        setLikedIds(new Set(ids))
      }
    } catch { /* ignore */ }
  }, [typeCode])

  // ── 認証状態の監視 ─────────────────────────────────────────
  useEffect(() => {
    const supabase = getSupabaseBrowser()

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      setUser(session?.user ?? null)
      setAccessToken(session?.access_token ?? null)
      if (session?.access_token) {
        loadLikedIds(session.access_token)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setAccessToken(session?.access_token ?? null)
      if (session?.access_token) {
        loadLikedIds(session.access_token)
      } else {
        setLikedIds(new Set())
      }
    })

    return () => subscription.unsubscribe()
  }, [loadLikedIds])

  useEffect(() => { loadComments() }, [loadComments])

  // ── コメント投稿 ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user || !accessToken) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ typeCode, content: newComment.trim() }),
      })
      if (res.ok) {
        const comment = await res.json()
        setComments(prev => [comment, ...prev])
        setNewComment("")
      }
    } finally {
      setSubmitting(false)
    }
  }

  // ── いいね ─────────────────────────────────────────────────
  const handleLike = async (commentId: string) => {
    if (!user) { setShowLogin(true); return }
    if (!accessToken || likingId) return

    // 楽観的 UI 更新
    const isLiked = likedIds.has(commentId)
    setLikedIds(prev => {
      const next = new Set(prev)
      isLiked ? next.delete(commentId) : next.add(commentId)
      return next
    })
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, likes: c.likes + (isLiked ? -1 : 1) } : c
    ))

    setLikingId(commentId)
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ commentId }),
      })
      if (!res.ok) {
        // 失敗時は元に戻す
        setLikedIds(prev => {
          const next = new Set(prev)
          isLiked ? next.add(commentId) : next.delete(commentId)
          return next
        })
        setComments(prev => prev.map(c =>
          c.id === commentId ? { ...c, likes: c.likes + (isLiked ? 1 : -1) } : c
        ))
      }
    } catch {
      // 失敗時は元に戻す
      setLikedIds(prev => {
        const next = new Set(prev)
        isLiked ? next.add(commentId) : next.delete(commentId)
        return next
      })
    } finally {
      setLikingId(null)
    }
  }

  const handleLogout = async () => {
    await getSupabaseBrowser().auth.signOut()
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4">

        {/* ヘッダー */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-[#E8A0A0]/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-5 h-5 text-[#E8A0A0]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground/90 mb-2">
            みんなのコメント
          </h2>
          <p className="text-foreground/50 text-sm">{typeName}タイプの仲間たちの声</p>
        </div>

        {/* ログイン状態バー */}
        {user ? (
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-sm text-foreground/50">
              <span className="font-medium text-foreground/70">{getDisplayName(user)}</span> さんでログイン中
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-foreground/40 hover:text-foreground/60 underline transition-colors"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div className="mb-6 p-5 rounded-2xl bg-[#FFF8F5] border border-[#E8A0A0]/20 text-center">
            <p className="text-sm text-foreground/60 mb-3">コメントするにはログインが必要です</p>
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(to right, #E8A0A0, #D4847B)" }}
            >
              <MessageCircle className="w-4 h-4" />
              ログインしてコメントする
            </button>
          </div>
        )}

        {/* コメント入力フォーム */}
        {user && (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8A0A0] to-[#D4847B] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">
                  {getDisplayName(user)[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder={`${typeName}タイプについてコメントを書く…`}
                  maxLength={200}
                  className="flex-1 px-4 py-2.5 rounded-full text-sm bg-[#FFF8F5] border border-foreground/10 focus:outline-none focus:border-[#E8A0A0] focus:ring-1 focus:ring-[#E8A0A0]/20"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white disabled:opacity-40 transition-opacity"
                  style={{ background: "linear-gradient(to bottom right, #E8A0A0, #D4847B)" }}
                >
                  {submitting
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  <span className="sr-only">送信</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* コメント一覧 */}
        {loadingComments ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-[#FFF8F5] animate-pulse" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-foreground/40 text-sm">まだコメントがありません。</p>
            <p className="text-foreground/30 text-xs mt-1">最初のコメントを書いてみましょう！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment, index) => {
              const liked = likedIds.has(comment.id)
              return (
                <div
                  key={comment.id}
                  className="flex gap-3 p-4 rounded-2xl bg-[#FFF8F5] hover:bg-[#FFF0ED] transition-colors"
                >
                  {/* アバター */}
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">
                      {comment.username[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>

                  {/* 本文 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground/80 text-sm">{comment.username}</span>
                      <span className="text-xs text-foreground/40">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-foreground/70 text-sm leading-relaxed">{comment.content}</p>
                  </div>

                  {/* いいねボタン */}
                  <button
                    onClick={() => handleLike(comment.id)}
                    disabled={likingId === comment.id}
                    className="flex items-center gap-1 self-start pt-1 flex-shrink-0 transition-colors disabled:opacity-60"
                    style={{ color: liked ? "#E8A0A0" : undefined }}
                  >
                    <Heart
                      className="w-4 h-4 transition-all"
                      style={{
                        fill: liked ? "#E8A0A0" : "none",
                        color: liked ? "#E8A0A0" : "#ccc",
                        transform: likingId === comment.id ? "scale(0.85)" : "scale(1)",
                      }}
                    />
                    <span className="text-xs" style={{ color: liked ? "#E8A0A0" : "#ccc" }}>
                      {comment.likes}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          currentPath={currentPath.current}
        />
      )}
    </section>
  )
}

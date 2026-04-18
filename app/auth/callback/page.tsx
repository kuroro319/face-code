"use client"

import { Suspense, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase-client"

const Spinner = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8F5" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #E8A0A0", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
      <p style={{ color: "#aaa", fontSize: "14px" }}>ログイン処理中…</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const code = searchParams.get("code")
    const rawNext = searchParams.get("next") ?? "/"
    const next = rawNext.startsWith("/") ? rawNext : "/"

    if (code) {
      getSupabaseBrowser()
        .auth.exchangeCodeForSession(code)
        .finally(() => router.replace(next))
    } else {
      router.replace(next)
    }
  }, [router, searchParams])

  return <Spinner />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthCallbackInner />
    </Suspense>
  )
}

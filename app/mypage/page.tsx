'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase-client'
import { TYPE_NAMES } from '@/lib/face-types'
import { Header } from '@/components/face-code/header'
import { Footer } from '@/components/face-code/footer'

interface MypageData {
  email: string
  purchases: Array<{ plan: string; face_code: string; created_at: string | null }>
  diagnoses: Array<{ id: string; type_code: string; created_at: string }>
}

const PLAN_LABEL: Record<string, string> = {
  full: 'フルプラン（¥580 買い切り）',
  subscription: '継続プラン（¥880/月）',
}

export default function MyPage() {
  const router = useRouter()
  const [data, setData] = useState<MypageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelMsg, setCancelMsg] = useState(false)

  useEffect(() => {
    async function init() {
      const supabase = getSupabaseBrowser()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login?next=/mypage')
        return
      }
      try {
        const res = await fetch('/api/mypage/data', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (res.ok) setData(await res.json())
      } catch { /* ignore */ }
      setLoading(false)
    }
    init()
  }, [router])

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#FFF8F5' }}>
        <Header />
        <div style={{ paddingTop: '120px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
          読み込み中…
        </div>
      </main>
    )
  }

  if (!data) return null

  const latestPurchase = data.purchases[0] ?? null
  const isSubscription = latestPurchase?.plan === 'subscription'
  const initial = data.email[0]?.toUpperCase() ?? '?'

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FFF8F5' }}>
      <Header />

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '100px 20px 60px',
        fontFamily: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>

        <h1 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>
          マイページ
        </h1>

        {/* アカウント情報 */}
        <section style={{
          backgroundColor: '#fff', borderRadius: '20px', padding: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              backgroundColor: '#E8A0A0', color: '#fff',
              fontSize: '20px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {initial}
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#aaa' }}>メールアドレス</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#333', wordBreak: 'break-all' }}>
                {data.email}
              </p>
            </div>
          </div>
        </section>

        {/* 購入済みプラン */}
        <section style={{
          backgroundColor: '#fff', borderRadius: '20px', padding: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)', borderLeft: '4px solid #E8A0A0',
        }}>
          <h2 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>
            購入済みプラン
          </h2>
          {latestPurchase ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: '#C9546E',
                  backgroundColor: '#FFF0F4', padding: '3px 10px', borderRadius: '20px',
                }}>
                  {isSubscription ? '継続プラン' : 'フルプラン'}
                </span>
                <span style={{ fontSize: '13px', color: '#555' }}>
                  {PLAN_LABEL[latestPurchase.plan] ?? latestPurchase.plan}
                </span>
              </div>
              {isSubscription && (
                cancelMsg ? (
                  <div style={{
                    padding: '12px 14px', backgroundColor: '#FFF8F5',
                    borderRadius: '10px', border: '1px solid #F0E0E0',
                  }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.8 }}>
                      キャンセルをご希望の場合は、サポートまでご連絡ください：
                      <br />
                      <a href="mailto:facecode48@gmail.com" style={{ color: '#E8A0A0', fontWeight: 600 }}>
                        facecode48@gmail.com
                      </a>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setCancelMsg(true)}
                    style={{
                      alignSelf: 'flex-start', fontSize: '13px', color: '#aaa',
                      backgroundColor: '#fff', border: '1px solid #e8e8e8',
                      borderRadius: '8px', padding: '8px 14px', cursor: 'pointer',
                    }}
                  >
                    継続プランをキャンセル
                  </button>
                )
              )}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>未購入</p>
          )}
        </section>

        {/* 診断履歴 */}
        <section style={{
          backgroundColor: '#fff', borderRadius: '20px', padding: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)', borderLeft: '4px solid #A0A8D4',
        }}>
          <h2 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>
            診断履歴
          </h2>
          {data.diagnoses.length === 0 ? (
            <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>診断履歴がありません</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.diagnoses.map((d, i) => (
                <Link
                  key={i}
                  href={d.id ? `/result/${d.type_code}?diagId=${d.id}` : `/result/${d.type_code}`}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 14px', backgroundColor: '#FFF8F5', borderRadius: '12px',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FFEEE8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#FFF8F5')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#C9546E', letterSpacing: '2px' }}>
                      {d.type_code}
                    </span>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      {TYPE_NAMES[d.type_code] ?? d.type_code}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#bbb', flexShrink: 0 }}>
                    {new Date(d.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ログアウト */}
        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <button
            onClick={handleSignOut}
            style={{
              padding: '12px 36px', fontSize: '14px', fontWeight: 600,
              color: '#E8A0A0', backgroundColor: '#fff',
              border: '1.5px solid #E8C0C0', borderRadius: '12px', cursor: 'pointer',
            }}
          >
            ログアウト
          </button>
        </div>
      </div>

      <Footer />
    </main>
  )
}

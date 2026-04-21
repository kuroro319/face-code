import { createClient } from '@supabase/supabase-js'

let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowser() {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    if (typeof window !== 'undefined') {
      console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません')
    }
    // 環境変数未設定時はダミー値で初期化（クラッシュ防止）
    // 認証・DBアクセスは失敗するがページは表示される
    browserClient = createClient('https://placeholder.supabase.co', 'placeholder-key')
    return browserClient
  }

  browserClient = createClient(url, key)
  return browserClient
}

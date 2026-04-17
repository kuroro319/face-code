import { createClient } from '@supabase/supabase-js'

// ブラウザ側クライアント（認証用）
// NEXT_PUBLIC_SUPABASE_ANON_KEY は Supabase ダッシュボード → Settings → API → anon/public key を設定してください
let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}

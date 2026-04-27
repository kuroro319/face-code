import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7))
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 診断履歴（user_idで取得）
  const { data: diagnoses } = await supabase
    .from('diagnoses')
    .select('type_code, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // 購入履歴（user_idで直接取得）
  const { data: purchaseData } = await supabase
    .from('purchases')
    .select('plan, face_code, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  const purchases = purchaseData ?? []

  return Response.json({
    email: user.email ?? '',
    diagnoses: diagnoses ?? [],
    purchases,
  })
}

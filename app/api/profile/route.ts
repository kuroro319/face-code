import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const supabase = getSupabase()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

// GET /api/profile — 自分のプロフィール取得
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabase()
  const { data } = await supabase
    .from('profiles')
    .select('country, type_code')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json(data ?? { country: null, type_code: null })
}

// PUT /api/profile — 国・タイプコードを保存
export async function PUT(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { country?: string; type_code?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: user.id,
      ...(body.country !== undefined && { country: body.country }),
      ...(body.type_code !== undefined && { type_code: body.type_code }),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    console.error('[profile PUT] error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

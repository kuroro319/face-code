import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// Authorization ヘッダーからユーザーを検証する
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const supabase = getSupabase()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

// ユーザー表示名を取得（Google: full_name, メール: email prefix）
function getUsername(user: { email?: string; user_metadata?: Record<string, string> }): string {
  return (
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'ユーザー'
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const typeCode = searchParams.get('code')

  if (!typeCode) {
    return NextResponse.json({ error: 'code is required' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('comments')
      .select('id, username, content, likes, created_at')
      .eq('type_code', typeCode)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[comments GET] supabase error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[comments GET] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // サーバー側でユーザーを検証（クライアントの userId を信頼しない）
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { typeCode?: string; content?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { typeCode, content } = body
  if (!typeCode || !content?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const username = getUsername(user)

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('comments')
      .insert({ type_code: typeCode, user_id: user.id, username, content: content.trim(), likes: 0 })
      .select('id, username, content, likes, created_at')
      .single()

    if (error) {
      console.error('[comments POST] supabase error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[comments POST] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  // サーバー側でユーザーを検証
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { commentId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { commentId } = body
  if (!commentId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    // いいね済みかチェック
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      // いいね取り消し
      await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', user.id)
      await supabase.rpc('decrement_comment_likes', { comment_id: commentId })
      return NextResponse.json({ liked: false })
    } else {
      // いいね追加
      await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id })
      await supabase.rpc('increment_comment_likes', { comment_id: commentId })
      return NextResponse.json({ liked: true })
    }
  } catch (err) {
    console.error('[comments PATCH] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

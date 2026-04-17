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

// GET /api/comments/liked?code=XXXX
// 現在のユーザーがいいねしているコメントIDを返す
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json([])

  const { searchParams } = new URL(request.url)
  const typeCode = searchParams.get('code')
  if (!typeCode) return NextResponse.json({ error: 'code required' }, { status: 400 })

  try {
    const supabase = getSupabase()

    // このタイプコードのコメントIDを取得
    const { data: comments } = await supabase
      .from('comments')
      .select('id')
      .eq('type_code', typeCode)

    if (!comments?.length) return NextResponse.json([])

    const commentIds = comments.map((c: { id: string }) => c.id)

    // ユーザーがいいねしているIDだけ返す
    const { data: likes } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', user.id)
      .in('comment_id', commentIds)

    return NextResponse.json(likes?.map((l: { comment_id: string }) => l.comment_id) ?? [])
  } catch (err) {
    console.error('[comments/liked] error:', err)
    return NextResponse.json([])
  }
}

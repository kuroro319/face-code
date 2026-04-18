import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const MIN_DATA_POINTS = 5

// GET /api/country-stats?country=JP — 国別タイプ分布を返す
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country')

  if (!country) {
    return NextResponse.json({ error: 'country is required' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('profiles')
      .select('type_code')
      .eq('country', country)
      .not('type_code', 'is', null)

    if (error) {
      console.error('[country-stats] error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const total = data?.length ?? 0

    if (total < MIN_DATA_POINTS) {
      return NextResponse.json({ insufficient: true, total })
    }

    const counts: Record<string, number> = {}
    for (const row of data!) {
      if (row.type_code) counts[row.type_code] = (counts[row.type_code] ?? 0) + 1
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const topType = sorted[0]?.[0] ?? null
    const topCount = sorted[0]?.[1] ?? 0

    return NextResponse.json({
      insufficient: false,
      total,
      topType,
      percentage: Math.round((topCount / total) * 100),
      distribution: sorted.slice(0, 3).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / total) * 100),
      })),
    })
  } catch (err) {
    console.error('[country-stats] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

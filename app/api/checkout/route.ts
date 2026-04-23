import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS: Record<string, string> = {
  full: process.env.STRIPE_PRICE_FULL!,
  subscription: process.env.STRIPE_PRICE_SUBSCRIPTION!,
}

export async function POST(request: NextRequest) {
  try {
    const { plan, code } = await request.json()

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const origin = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://face-code-xi.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'subscription' ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { face_code: code, plan },
      success_url: `${origin}/result/${code}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${origin}/result/${code}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] Stripe error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

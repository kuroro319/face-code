import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS: Record<string, string> = {
  light: process.env.STRIPE_PRICE_LIGHT!,
  full: process.env.STRIPE_PRICE_FULL!,
  subscription: process.env.STRIPE_PRICE_SUBSCRIPTION!,
}

export async function POST(request: NextRequest) {
  const { plan, code } = await request.json()

  const priceId = PRICE_IDS[plan]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const origin = request.headers.get('origin') ?? ''

  const session = await stripe.checkout.sessions.create({
    mode: plan === 'subscription' ? 'subscription' : 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { face_code: code, plan },
    success_url: `${origin}/result/${code}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
    cancel_url: `${origin}/result/${code}`,
  })

  return NextResponse.json({ url: session.url })
}

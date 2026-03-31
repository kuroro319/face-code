// これをapp/api/webhook/route.tsに上書き
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getSupabase()

  // 通常購入・初回サブスク
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { face_code, plan } = session.metadata ?? {}
    if (face_code && plan) {
      await supabase.from('purchases').upsert({
        stripe_session_id: session.id,
        face_code,
        plan,
        stripe_customer_id: session.customer as string | null,
      })
    }
  }

  // サブスク継続課金（毎月）
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = (invoice as any).subscription as string | null
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const { face_code } = subscription.metadata ?? {}
      if (face_code) {
        await supabase.from('purchases').upsert({
          stripe_session_id: `sub_${subscriptionId}_${invoice.id}`,
          face_code,
          plan: 'subscription',
          stripe_customer_id: invoice.customer as string | null,
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
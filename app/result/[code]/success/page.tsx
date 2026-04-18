import Stripe from 'stripe'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/face-code/header'
import { Footer } from '@/components/face-code/footer'
import { PurchasedContent } from '@/components/face-code/purchased-content'
import { CheckCircle } from 'lucide-react'
import type { Plan } from '@/lib/face-types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) notFound()

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch (err) {
    console.error('[success] stripe.retrieve error:', err)
    notFound()
  }

  // サブスクリプションはStripe側の反映に数秒かかる場合があるためリトライ
  let retries = 0
  while (session.status !== 'complete' && retries < 6) {
    await new Promise(r => setTimeout(r, 1500))
    session = await stripe.checkout.sessions.retrieve(session_id)
    retries++
  }
  if (session.status !== 'complete') notFound()

  // URLのcodeではなくStripeセッションのmetadataを信頼する
  const code = session.metadata?.face_code
  if (!code) notFound()

  const plan = (session.metadata?.plan ?? 'full') as Plan

  const PLAN_LABELS: Record<Plan, string> = {
    full: 'フルプラン',
    subscription: '継続プラン',
  }

  return (
    <main className="min-h-screen bg-[#FFF8F5]">
      <Header />

      <div className="max-w-2xl mx-auto px-4 pt-16 pb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#E8A0A0]/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#E8A0A0]" />
        </div>
        <h1 className="text-2xl font-serif font-semibold text-foreground/90 mb-2">
          ご購入ありがとうございます
        </h1>
        <p className="text-foreground/50 text-sm">{PLAN_LABELS[plan]}のご購入が完了しました</p>
      </div>

      <PurchasedContent code={code} plan={plan} />

      <div className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <Link
          href={`/result/${code}`}
          className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-[#E8A0A0]/30 text-[#E8A0A0] text-sm hover:bg-[#E8A0A0]/5 transition-colors"
        >
          診断結果トップに戻る
        </Link>
      </div>

      <Footer />
    </main>
  )
}

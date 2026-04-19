import { LandingHeader } from "@/components/face-code/landing-header"
import { Hero } from "@/components/face-code/hero"
import { Buzz } from "@/components/face-code/buzz"
import { TypesGrid } from "@/components/face-code/types-grid"
import { Features } from "@/components/face-code/features"
import { HowItWorks } from "@/components/face-code/how-it-works"
import { About } from "@/components/face-code/about"
import { Cta } from "@/components/face-code/cta"
import { Footer } from "@/components/face-code/footer"

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FACE CODE',
  url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://face-code-xi.vercel.app',
  description: 'AIが顔写真を分析して16タイプの性格を診断。メイク・ファッション・恋愛傾向・仕事運まで。無料で今すぐ診断できます。',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
  inLanguage: 'ja',
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background text-foreground">
        <LandingHeader />
        <main>
          <Hero />
          <Buzz />
          <div id="types"><TypesGrid /></div>
          <Features />
          <HowItWorks />
          <About />
          <Cta />
        </main>
        <Footer />
      </div>
    </>
  )
}

import { LandingHeader } from "@/components/face-code/landing-header"
import { Hero } from "@/components/face-code/hero"
import { Buzz } from "@/components/face-code/buzz"
import { TypesGrid } from "@/components/face-code/types-grid"
import { Features } from "@/components/face-code/features"
import { HowItWorks } from "@/components/face-code/how-it-works"
import { About } from "@/components/face-code/about"
import { Cta } from "@/components/face-code/cta"
import { Footer } from "@/components/face-code/footer"

export default function HomePage() {
  return (
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
  )
}

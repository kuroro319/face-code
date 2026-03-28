import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 border-t border-[#E8A0A0]/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[#E8A0A0]">FACE</span>
                <span className="text-foreground/60">CODE</span>
              </span>
            </Link>
            <p className="text-sm text-foreground/40 mt-2">
              顔のパーツから読み解く性格診断
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-foreground/50">
            <Link href="/terms" className="hover:text-foreground/80 transition-colors">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-foreground/80 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/tokutei" className="hover:text-foreground/80 transition-colors">
              特定商取引法に基づく表記
            </Link>
            <Link href="/contact" className="hover:text-foreground/80 transition-colors">
              お問い合わせ
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-[#E8A0A0]/5 text-center">
          <p className="text-xs text-foreground/30">
            &copy; 2026 FACE CODE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

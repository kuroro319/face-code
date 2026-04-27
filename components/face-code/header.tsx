"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const pathname = usePathname()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F5]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#E8A0A0]">FACE</span>
            <span className="text-foreground/80">CODE</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/diagnose"
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            診断を受ける
          </Link>
          <Link
            href="/#types"
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            タイプ一覧
          </Link>
          <Link
            href="/faq"
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
          <Link href={`/login?next=${encodeURIComponent(pathname)}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-[#E8A0A0] text-[#E8A0A0] hover:bg-[#E8A0A0]/10"
            >
              ログイン
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#FFF8F5]">
            <nav className="flex flex-col gap-6 mt-8">
              <Link
                href="/diagnose"
                className="text-lg text-foreground/70 hover:text-foreground transition-colors"
              >
                診断を受ける
              </Link>
              <Link
                href="/#types"
                className="text-lg text-foreground/70 hover:text-foreground transition-colors"
              >
                タイプ一覧
              </Link>
              <Link
                href="/faq"
                className="text-lg text-foreground/70 hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
              <Link href={`/login?next=${encodeURIComponent(pathname)}`}>
                <Button
                  variant="outline"
                  className="border-[#E8A0A0] text-[#E8A0A0] hover:bg-[#E8A0A0]/10 mt-4"
                >
                  ログイン
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

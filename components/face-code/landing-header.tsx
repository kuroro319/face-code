"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function LandingHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-1">
          <span className="text-xl font-black tracking-widest text-primary">FACE</span>
          <span className="text-xl font-black tracking-widest text-foreground">CODE</span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">機能</a>
          <a href="#how" className="hover:text-foreground transition-colors">使い方</a>
          <a href="#about" className="hover:text-foreground transition-colors">人相学とは</a>
        </nav>

        <Link
          href="/diagnose"
          className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
        >
          無料で診断する
        </Link>

        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="メニューを開く"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm font-medium" onClick={() => setOpen(false)}>機能</a>
          <a href="#how" className="text-sm font-medium" onClick={() => setOpen(false)}>使い方</a>
          <a href="#about" className="text-sm font-medium" onClick={() => setOpen(false)}>人相学とは</a>
          <Link
            href="/diagnose"
            className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold"
            onClick={() => setOpen(false)}
          >
            無料で診断する
          </Link>
        </div>
      )}
    </header>
  )
}

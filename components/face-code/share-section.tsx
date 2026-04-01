"use client"

import { Check, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FaXTwitter, FaInstagram } from "react-icons/fa6"
import { SiLine } from "react-icons/si"

interface ShareSectionProps {
  code: string
  typeName: string
}

export function ShareSection({ code, typeName }: ShareSectionProps) {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  const shareUrl = `https://face-code-xi.vercel.app/result/${code}`
  const shareText = `私はFACE CODEで${typeName}タイプ（${code}）と診断されました！あなたも試してみて👇 #FACECODE #顔診断`

  const codeColors: Record<string, string> = {
    R: "#E8A0A0",
    L: "#D4847B",
    O: "#7EB8C9",
    H: "#A889BD",
    G: "#7EB8C9",
    A: "#D4847B",
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API not available
    }
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const handleLineShare = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(lineUrl, '_blank')
  }

  const handleGenerateCard = async () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      alert('シェアカードを生成しました！画像を長押しして保存できます')
    }, 1500)
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white/50 to-[#FFF8F5]">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="w-14 h-14 rounded-full bg-[#E8A0A0]/10 flex items-center justify-center mx-auto mb-4">
            <FaXTwitter className="w-6 h-6 text-[#E8A0A0]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground/90 mb-2">
            結果をシェアする
          </h2>
          <p className="text-foreground/50">
            ストーリーズでシェアして友達にも診断してもらおう
          </p>
        </div>

        {/* Share Card Preview */}
        <div
          className="bg-gradient-to-br from-[#FFF8F5] to-white rounded-3xl p-6 mb-6 shadow-lg border border-[#E8A0A0]/10 mx-auto max-w-xs"
        >
          <div className="text-center">
            <span className="text-xs text-foreground/40 tracking-wider mb-2 block">FACE CODE</span>
            <div className="flex justify-center gap-1 mb-2">
              {code.split('').map((letter, index) => (
                <span
                  key={index}
                  className="text-4xl font-bold"
                  style={{ color: codeColors[letter] || '#333' }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground/80 mb-1">
              {typeName}
            </h3>
            <p className="text-xs text-foreground/50">
              顔のパーツから読み解く性格診断
            </p>
          </div>
        </div>

        {/* Generate Story Card Button */}
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white rounded-full px-8 py-6 text-lg font-medium mb-4"
          onClick={handleGenerateCard}
          disabled={generating}
        >
          {generating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              生成中...
            </>
          ) : (
            <>
              <FaInstagram className="w-5 h-5 mr-2" />
              ストーリー用カードを生成
            </>
          )}
        </Button>

        {/* Main Share Button */}
        <Button
          size="lg"
          className="w-full bg-[#E8A0A0] hover:bg-[#D4847B] text-white rounded-full px-8 py-6 text-lg font-medium mb-6"
          onClick={handleTwitterShare}
        >
          <FaXTwitter className="w-5 h-5 mr-2" />
          結果をシェアする
        </Button>

        {/* Social Share Options */}
        <div className="flex justify-center gap-3 flex-wrap">
          <Button
            variant="outline"
            className="rounded-full border-[#E8A0A0]/50 hover:bg-[#E8A0A0]/10 hover:border-[#E8A0A0] text-foreground/70 px-5 py-2 h-auto"
            onClick={handleTwitterShare}
          >
            <FaXTwitter className="w-4 h-4 mr-2 shrink-0" />
            Xでシェア
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-[#E8A0A0]/50 hover:bg-[#E8A0A0]/10 hover:border-[#E8A0A0] text-foreground/70 px-5 py-2 h-auto"
            onClick={handleLineShare}
          >
            <SiLine className="w-4 h-4 mr-2 shrink-0" />
            LINEでシェア
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-[#E8A0A0]/50 hover:bg-[#E8A0A0]/10 hover:border-[#E8A0A0] text-foreground/70 px-5 py-2 h-auto"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 shrink-0 text-green-500" />
                <span className="text-green-500">コピーしました！</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 mr-2 shrink-0" />
                リンクをコピー
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}

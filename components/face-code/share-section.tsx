"use client"

import { Check, Link2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { FaXTwitter, FaInstagram } from "react-icons/fa6"
import { SiLine } from "react-icons/si"

interface ShareSectionProps {
  code: string
  typeName: string
}

export function ShareSection({ code, typeName }: ShareSectionProps) {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches)
  }, [])

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
    window.open(twitterUrl, "_blank", "width=550,height=420")
  }

  const handleLineShare = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(lineUrl, "_blank")
  }

  const handleGenerateCard = () => {
    setGenerating(true)

    const width = 540
    const height = 960

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")!

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, width, height)
    bg.addColorStop(0, "#FFF8F5")
    bg.addColorStop(1, "#FFFFFF")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    // Card container (rounded rect)
    const cardX = 60
    const cardY = 260
    const cardW = width - 120
    const cardH = 400
    const r = 30

    ctx.shadowColor = "rgba(0,0,0,0.08)"
    ctx.shadowBlur = 24
    ctx.beginPath()
    ctx.moveTo(cardX + r, cardY)
    ctx.lineTo(cardX + cardW - r, cardY)
    ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + r, r)
    ctx.lineTo(cardX + cardW, cardY + cardH - r)
    ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH, r)
    ctx.lineTo(cardX + r, cardY + cardH)
    ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - r, r)
    ctx.lineTo(cardX, cardY + r)
    ctx.arcTo(cardX, cardY, cardX + r, cardY, r)
    ctx.closePath()
    ctx.fillStyle = "#FFFFFF"
    ctx.fill()
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // "FACE CODE" label
    ctx.textAlign = "center"
    ctx.font = "20px sans-serif"
    ctx.fillStyle = "rgba(0,0,0,0.28)"
    ctx.fillText("FACE CODE", width / 2, cardY + 72)

    // Colored letters
    const letters = code.split("")
    const letterW = 72
    const lettersStartX =
      width / 2 - (letters.length * letterW) / 2 + letterW / 2
    ctx.font = "bold 82px sans-serif"
    letters.forEach((letter, i) => {
      ctx.fillStyle = codeColors[letter] || "#333"
      ctx.fillText(letter, lettersStartX + i * letterW, cardY + 190)
    })

    // Type name
    ctx.font = "600 36px serif"
    ctx.fillStyle = "rgba(0,0,0,0.72)"
    ctx.fillText(typeName, width / 2, cardY + 265)

    // Sub description
    ctx.font = "20px sans-serif"
    ctx.fillStyle = "rgba(0,0,0,0.38)"
    ctx.fillText("顔のパーツから読み解く性格診断", width / 2, cardY + 315)

    // URL footer
    ctx.font = "20px sans-serif"
    ctx.fillStyle = "rgba(0,0,0,0.22)"
    ctx.fillText("face-code-xi.vercel.app", width / 2, height - 72)

    setGeneratedImageUrl(canvas.toDataURL("image/png"))
    setGenerating(false)
  }

  const handleDownload = () => {
    if (!generatedImageUrl) return
    const a = document.createElement("a")
    a.href = generatedImageUrl
    a.download = `facecode-${code}.png`
    a.click()
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
        <div className="bg-gradient-to-br from-[#FFF8F5] to-white rounded-3xl p-6 mb-6 shadow-lg border border-[#E8A0A0]/10 mx-auto max-w-xs">
          <div className="text-center">
            <span className="text-xs text-foreground/40 tracking-wider mb-2 block">
              FACE CODE
            </span>
            <div className="flex justify-center gap-1 mb-2">
              {code.split("").map((letter, index) => (
                <span
                  key={index}
                  className="text-4xl font-bold"
                  style={{ color: codeColors[letter] || "#333" }}
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

        {/* Generated Image */}
        {generatedImageUrl && (
          <div className="mb-6">
            <img
              src={generatedImageUrl}
              alt="ストーリー用カード"
              className="mx-auto rounded-2xl shadow-lg"
              style={{ maxWidth: "220px", width: "100%" }}
            />
            {isMobile ? (
              <p className="text-sm text-foreground/50 mt-3">
                画像を長押しして保存できます
              </p>
            ) : (
              <Button
                size="sm"
                className="mt-3 bg-[#E8A0A0] hover:bg-[#D4847B] text-white rounded-full px-6"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                画像をダウンロード
              </Button>
            )}
          </div>
        )}

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

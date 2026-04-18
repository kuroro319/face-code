"use client"

import { useRef, useEffect, useState, useCallback } from "react"

type Mode = "mole" | "wrinkle" | "erase"

interface Mole { id: number; x: number; y: number }
interface WrinklePath { id: number; points: Array<{ x: number; y: number }> }
export interface DiagnosisResult { type: "mole" | "wrinkle"; location: string; advice: string }

interface Props {
  code: string
  onResult: (results: DiagnosisResult[]) => void
}

const CW = 280
const CH = 360

const ZONES = [
  { name: "額（左）",   x1: 38,  y1: 52,  x2: 113, y2: 126 },
  { name: "額（中央）", x1: 113, y1: 42,  x2: 167, y2: 126 },
  { name: "額（右）",   x1: 167, y1: 52,  x2: 242, y2: 126 },
  { name: "左眉",       x1: 72,  y1: 117, x2: 126, y2: 148 },
  { name: "右眉",       x1: 154, y1: 117, x2: 208, y2: 148 },
  { name: "左目",       x1: 72,  y1: 146, x2: 130, y2: 184 },
  { name: "右目",       x1: 150, y1: 146, x2: 208, y2: 184 },
  { name: "鼻",         x1: 116, y1: 184, x2: 164, y2: 230 },
  { name: "左頬",       x1: 36,  y1: 177, x2: 116, y2: 280 },
  { name: "右頬",       x1: 164, y1: 177, x2: 244, y2: 280 },
  { name: "人中",       x1: 120, y1: 228, x2: 160, y2: 256 },
  { name: "上唇",       x1: 107, y1: 250, x2: 173, y2: 272 },
  { name: "下唇・口元", x1: 107, y1: 272, x2: 173, y2: 296 },
  { name: "顎",         x1: 94,  y1: 294, x2: 186, y2: 342 },
  { name: "首",         x1: 106, y1: 340, x2: 174, y2: 364 },
]

function getZone(x: number, y: number): string {
  for (const z of ZONES) {
    if (x >= z.x1 && x <= z.x2 && y >= z.y1 && y <= z.y2) return z.name
  }
  if (y < 126) return "額"
  if (x < 140) return "左側"
  return "右側"
}

function getWrinkleDesc(pts: Array<{ x: number; y: number }>): string {
  if (pts.length < 2) return "不明"
  const mx = (pts[0].x + pts[pts.length - 1].x) / 2
  const my = (pts[0].y + pts[pts.length - 1].y) / 2
  const zone = getZone(mx, my)
  const dx = Math.abs(pts[pts.length - 1].x - pts[0].x)
  const dy = Math.abs(pts[pts.length - 1].y - pts[0].y)
  const dir = dx > dy * 2 ? "横向き" : dy > dx * 2 ? "縦向き" : "斜め"
  return `${zone}の${dir}のシワ`
}

function drawFace(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CW, CH)
  const skin = "#FDDBB8"
  const line = "#C9A070"
  ctx.save()
  ctx.strokeStyle = line
  ctx.lineWidth = 1.8
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  // 顔の輪郭
  ctx.fillStyle = skin
  ctx.beginPath()
  ctx.ellipse(140, 175, 106, 122, 0, 0, Math.PI * 2)
  ctx.fill(); ctx.stroke()

  // 首
  ctx.fillStyle = skin
  ctx.beginPath()
  ctx.moveTo(116, 294); ctx.lineTo(108, 355)
  ctx.lineTo(172, 355); ctx.lineTo(164, 294)
  ctx.closePath(); ctx.fill(); ctx.stroke()

  // 耳
  for (const [ex, ey] of [[32, 168], [248, 168]] as [number, number][]) {
    ctx.fillStyle = skin
    ctx.beginPath()
    ctx.ellipse(ex, ey, 9, 17, 0, 0, Math.PI * 2)
    ctx.fill(); ctx.stroke()
  }

  // 目の白目
  for (const [ex, ey] of [[100, 162], [180, 162]] as [number, number][]) {
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.ellipse(ex, ey, 20, 12, 0, 0, Math.PI * 2)
    ctx.fill(); ctx.stroke()
    // 虹彩
    ctx.fillStyle = "#7A5230"
    ctx.beginPath(); ctx.arc(ex, ey, 8, 0, Math.PI * 2); ctx.fill()
    // 瞳孔
    ctx.fillStyle = "#1a1a1a"
    ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fill()
  }

  // 眉
  ctx.strokeStyle = "#5A3A18"
  ctx.lineWidth = 2.8
  ctx.beginPath(); ctx.moveTo(76, 143); ctx.quadraticCurveTo(100, 130, 124, 140); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(156, 140); ctx.quadraticCurveTo(180, 130, 204, 143); ctx.stroke()

  ctx.strokeStyle = line
  ctx.lineWidth = 1.8

  // 鼻
  ctx.beginPath()
  ctx.moveTo(136, 172); ctx.lineTo(128, 218)
  ctx.quadraticCurveTo(140, 228, 152, 218); ctx.lineTo(144, 172)
  ctx.stroke()
  ctx.beginPath(); ctx.arc(126, 222, 6, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke()
  ctx.beginPath(); ctx.arc(154, 222, 6, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke()

  // 口
  ctx.fillStyle = "#D4888A"
  ctx.beginPath()
  ctx.moveTo(113, 260)
  ctx.quadraticCurveTo(127, 252, 140, 256)
  ctx.quadraticCurveTo(153, 252, 167, 260)
  ctx.quadraticCurveTo(153, 276, 140, 278)
  ctx.quadraticCurveTo(127, 276, 113, 260)
  ctx.closePath(); ctx.fill()
  ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke()

  ctx.restore()
}

function drawMarkers(
  ctx: CanvasRenderingContext2D,
  moles: Mole[],
  wrinkles: WrinklePath[],
  livePoints?: Array<{ x: number; y: number }>
) {
  ctx.save()
  ctx.lineCap = "round"; ctx.lineJoin = "round"

  for (const w of wrinkles) {
    if (w.points.length < 2) continue
    ctx.strokeStyle = "#8B6050"; ctx.lineWidth = 2.4
    ctx.beginPath(); ctx.moveTo(w.points[0].x, w.points[0].y)
    for (let i = 1; i < w.points.length; i++) ctx.lineTo(w.points[i].x, w.points[i].y)
    ctx.stroke()
  }

  if (livePoints && livePoints.length >= 2) {
    ctx.strokeStyle = "rgba(139,96,80,0.55)"; ctx.lineWidth = 2.4
    ctx.beginPath(); ctx.moveTo(livePoints[0].x, livePoints[0].y)
    for (let i = 1; i < livePoints.length; i++) ctx.lineTo(livePoints[i].x, livePoints[i].y)
    ctx.stroke()
  }

  for (const m of moles) {
    ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 4
    ctx.fillStyle = "#2A1008"
    ctx.beginPath(); ctx.arc(m.x, m.y, 5.5, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0
  }
  ctx.restore()
}

export function MoleWrinkleCanvas({ code, onResult }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>("mole")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [markerCount, setMarkerCount] = useState(0)

  const molesRef = useRef<Mole[]>([])
  const wrinklesRef = useRef<WrinklePath[]>([])
  const livePointsRef = useRef<Array<{ x: number; y: number }>>([])
  const isDrawingRef = useRef(false)
  const modeRef = useRef<Mode>("mole")
  const nextId = useRef(0)

  const bump = useCallback(() => setMarkerCount(n => n + 1), [])

  useEffect(() => { modeRef.current = mode }, [mode])

  // 再描画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    drawFace(ctx)
    drawMarkers(ctx, molesRef.current, wrinklesRef.current)
  }, [markerCount])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    drawFace(ctx)
  }, [])

  const getPos = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current; if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const sx = CW / rect.width, sy = CH / rect.height
    if ("touches" in e) {
      const t = e.touches[0]; if (!t) return null
      return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy }
    }
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy }
  }, [])

  const handleStart = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    const pos = getPos(e); if (!pos) return
    const m = modeRef.current

    if (m === "mole") {
      molesRef.current = [...molesRef.current, { id: nextId.current++, x: pos.x, y: pos.y }]
      bump()
    } else if (m === "wrinkle") {
      livePointsRef.current = [pos]
      isDrawingRef.current = true
    } else {
      const T = 24
      let minD = Infinity, minI = -1
      molesRef.current.forEach((mol, i) => {
        const d = Math.hypot(mol.x - pos.x, mol.y - pos.y)
        if (d < minD) { minD = d; minI = i }
      })
      if (minD < T && minI >= 0) {
        molesRef.current = molesRef.current.filter((_, i) => i !== minI)
        bump(); return
      }
      let minWD = Infinity, minWI = -1
      wrinklesRef.current.forEach((w, i) => {
        for (const pt of w.points) {
          const d = Math.hypot(pt.x - pos.x, pt.y - pos.y)
          if (d < minWD) { minWD = d; minWI = i }
        }
      })
      if (minWD < T && minWI >= 0) {
        wrinklesRef.current = wrinklesRef.current.filter((_, i) => i !== minWI)
        bump()
      }
    }
  }, [getPos, bump])

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawingRef.current || modeRef.current !== "wrinkle") return
    e.preventDefault()
    const pos = getPos(e); if (!pos) return
    livePointsRef.current = [...livePointsRef.current, pos]
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    drawFace(ctx)
    drawMarkers(ctx, molesRef.current, wrinklesRef.current, livePointsRef.current)
  }, [getPos])

  const handleEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawingRef.current || modeRef.current !== "wrinkle") return
    e.preventDefault()
    isDrawingRef.current = false
    if (livePointsRef.current.length > 2) {
      wrinklesRef.current = [
        ...wrinklesRef.current,
        { id: nextId.current++, points: livePointsRef.current },
      ]
    }
    livePointsRef.current = []
    bump()
  }, [bump])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.addEventListener("mousedown", handleStart)
    canvas.addEventListener("mousemove", handleMove)
    canvas.addEventListener("mouseup", handleEnd)
    canvas.addEventListener("touchstart", handleStart, { passive: false })
    canvas.addEventListener("touchmove", handleMove, { passive: false })
    canvas.addEventListener("touchend", handleEnd)
    return () => {
      canvas.removeEventListener("mousedown", handleStart)
      canvas.removeEventListener("mousemove", handleMove)
      canvas.removeEventListener("mouseup", handleEnd)
      canvas.removeEventListener("touchstart", handleStart)
      canvas.removeEventListener("touchmove", handleMove)
      canvas.removeEventListener("touchend", handleEnd)
    }
  }, [handleStart, handleMove, handleEnd])

  const handleSubmit = async () => {
    const moles = molesRef.current
    const wrinkles = wrinklesRef.current
    if (moles.length === 0 && wrinkles.length === 0) return
    setLoading(true); setError(false)
    try {
      const res = await fetch("/api/mole-wrinkle-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          moles: moles.map(m => getZone(m.x, m.y)),
          wrinkles: wrinkles.map(w => getWrinkleDesc(w.points)),
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      onResult(data.results)
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  const total = molesRef.current.length + wrinklesRef.current.length

  const MODES: Array<{ key: Mode; label: string; accent: string }> = [
    { key: "mole",    label: "ほくろを追加", accent: "#2A1008" },
    { key: "wrinkle", label: "シワを追加",   accent: "#8B6050" },
    { key: "erase",   label: "消す",         accent: "#C9546E" },
  ]

  const HINTS: Record<Mode, string> = {
    mole:    "タップしてほくろの位置をマーク",
    wrinkle: "ドラッグしてシワをなぞって",
    erase:   "タップしてマーカーを削除",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* モード切替 */}
      <div style={{ display: "flex", gap: "6px" }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} style={{
            flex: 1, padding: "8px 4px", borderRadius: "20px",
            border: `2px solid ${mode === m.key ? m.accent : "#e8e8e8"}`,
            backgroundColor: mode === m.key ? `${m.accent}15` : "#fff",
            color: mode === m.key ? m.accent : "#bbb",
            fontSize: "11px", fontWeight: mode === m.key ? 700 : 400,
            cursor: "pointer", transition: "all 0.15s",
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <canvas ref={canvasRef} width={CW} height={CH} style={{
          touchAction: "none", borderRadius: "16px",
          border: "1px solid #f0e8e8", maxWidth: "100%",
          cursor: "crosshair", display: "block",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }} />
      </div>

      <p style={{ margin: 0, fontSize: "12px", color: "#bbb", textAlign: "center" }}>
        {HINTS[mode]}
      </p>

      {error && (
        <p style={{ margin: 0, fontSize: "12px", color: "#C9546E", textAlign: "center" }}>
          診断に失敗しました。もう一度お試しください。
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || total === 0}
        style={{
          padding: "13px", borderRadius: "24px", border: "none",
          background: total > 0 ? "linear-gradient(135deg, #E8A0A0, #D4847B)" : "#e8e8e8",
          color: total > 0 ? "#fff" : "#bbb",
          fontSize: "14px", fontWeight: 700,
          cursor: loading || total === 0 ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1, transition: "all 0.2s",
        }}
      >
        {loading ? "診断中…" : `診断する${total > 0 ? ` (${total}件)` : ""}`}
      </button>
    </div>
  )
}

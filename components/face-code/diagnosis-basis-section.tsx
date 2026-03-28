'use client'

import { useEffect, useState } from 'react'

interface DiagnoseReasons {
  F: string
  A: string
  C: string
  E: string
}

interface DiagnosisBasisSectionProps {
  code: string
}

const AXIS_INFO: Record<string, { axis: 'F' | 'A' | 'C' | 'E'; label: string; feature: string; color: string }> = {
  R: { axis: 'F', label: 'F = 発信型（R）', feature: 'おでこ・目の大きさ・口の大きさ', color: '#E8A0A0' },
  A: { axis: 'F', label: 'F = 吸収型（A）', feature: 'おでこ・目の大きさ・口の大きさ', color: '#7BA3C4' },
  L: { axis: 'A', label: 'A = 情熱型（L）', feature: '目の形・唇の厚さ・口角', color: '#E8A0A0' },
  G: { axis: 'A', label: 'A = 秘愛型（G）', feature: '目の形・唇の厚さ・口角', color: '#A889BD' },
  O: { axis: 'C', label: 'C = 開放型（O）', feature: '眉の形・眉間の広さ・耳の大きさ', color: '#E8A0A0' },
  S: { axis: 'C', label: 'C = 選縁型（S）', feature: '眉の形・眉間の広さ・耳の大きさ', color: '#7BA3C4' },
  H: { axis: 'E', label: 'E = 直感型（H）', feature: '鼻の形・眉の濃さ・黒目の割合', color: '#E8A0A0' },
  M: { axis: 'E', label: 'E = 意志型（M）', feature: '鼻の形・眉の濃さ・黒目の割合', color: '#A889BD' },
}

const AXIS_DISPLAY = ['F', 'A', 'C', 'E'] as const

export function DiagnosisBasisSection({ code }: DiagnosisBasisSectionProps) {
  const [reasons, setReasons] = useState<DiagnoseReasons | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('faceCodeReasons')
    if (stored) {
      try {
        setReasons(JSON.parse(stored))
      } catch {
        // ignore malformed data
      }
    }
  }, [])

  const letters = code.toUpperCase().split('')

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#7BA3C4]/10 text-[#7BA3C4] text-sm rounded-full mb-4">
            Diagnosis Basis
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground/90">
            判定の根拠
          </h2>
          <p className="text-foreground/50 text-sm mt-2">
            顔のパーツからどのように判定されたか
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {letters.map((letter, index) => {
            const info = AXIS_INFO[letter]
            if (!info) return null
            const reason = reasons?.[info.axis]
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8A0A0]/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: info.color }}
                  >
                    {AXIS_DISPLAY[index]}
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 leading-none mb-0.5">
                      {info.feature}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: info.color }}>
                      {info.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {reason ?? '根拠データがありません'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

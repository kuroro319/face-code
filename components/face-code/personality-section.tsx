interface PersonalitySectionProps {
  paragraphs: string[]
}

export function PersonalitySection({ paragraphs }: PersonalitySectionProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#E8A0A0]/10 text-[#D4847B] text-sm rounded-full mb-4">
            Personality
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground/90">
            あなたの性格タイプ
          </h2>
        </div>

        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base md:text-lg leading-relaxed text-foreground/70 text-pretty"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div className="w-16 h-px bg-[#E8A0A0]/30" />
          <div className="w-2 h-2 rounded-full bg-[#E8A0A0]/50" />
          <div className="w-16 h-px bg-[#E8A0A0]/30" />
        </div>
      </div>
    </section>
  )
}

import Image from "next/image"

interface HeroSectionProps {
  code: string
  typeName: string
  catchphrase: string
  characterImage: string
}

export function HeroSection({ code, typeName, catchphrase, characterImage }: HeroSectionProps) {
  // Color mapping for FACE CODE letters
  const letterColors: Record<string, string> = {
    R: "#E8A0A0",
    L: "#D4847B",
    O: "#7BA3C4",
    H: "#A889BD",
    F: "#E8A0A0",
    A: "#D4847B",
    C: "#7BA3C4",
    E: "#A889BD",
    G: "#7BA3C4",
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Character Illustration */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div style={{ position: 'relative' }} className="w-64 h-80 md:w-80 md:h-96 rounded-3xl overflow-hidden shadow-xl shadow-[#E8A0A0]/20">
              <Image
                src={characterImage}
                alt={`${typeName}タイプのキャラクター`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F5]/30 to-transparent" />
            </div>
          </div>

          {/* Result Info */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-sm text-foreground/50 tracking-widest mb-2 uppercase">
              Your Face Code
            </p>

            {/* Large Code Display */}
            <div className="flex justify-center md:justify-start gap-2 mb-4">
              {code.split("").map((letter, index) => (
                <span
                  key={index}
                  className="text-6xl md:text-8xl font-bold tracking-tight"
                  style={{ color: letterColors[letter] || "#E8A0A0" }}
                >
                  {letter}
                </span>
              ))}
            </div>

            {/* Type Name */}
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground/90 mb-4">
              {typeName}
            </h1>

            {/* Catchphrase */}
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed text-balance">
              {catchphrase}
            </p>

            {/* Decorative Elements */}
            <div className="flex justify-center md:justify-start gap-3 mt-6">
              <span className="w-2 h-2 rounded-full bg-[#E8A0A0]" />
              <span className="w-2 h-2 rounded-full bg-[#D4847B]" />
              <span className="w-2 h-2 rounded-full bg-[#7BA3C4]" />
              <span className="w-2 h-2 rounded-full bg-[#A889BD]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

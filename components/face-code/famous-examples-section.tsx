import Image from "next/image"

interface Celebrity {
  name: string
  description: string
  image?: string
}

interface FamousExamplesSectionProps {
  celebrities: Celebrity[]
}

const avatarGradients = [
  "from-[#E8A0A0] to-[#D4847B]",
  "from-[#7EB8C9] to-[#5FA3B8]",
  "from-[#A889BD] to-[#9070A8]",
]

export function FamousExamplesSection({ celebrities }: FamousExamplesSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-white/50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-[#A889BD]/10 text-[#A889BD] text-sm rounded-full mb-4">
            Famous People
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground/90">
            同じタイプの有名人
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {celebrities.map((celebrity, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-[#E8A0A0]/10 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#E8A0A0]/20 shadow-sm">
                {celebrity.image ? (
                  <Image
                    src={celebrity.image}
                    alt={celebrity.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center`}>
                    <span className="text-white text-2xl font-bold">
                      {celebrity.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-foreground/80 mb-1">
                {celebrity.name}
              </h3>
              {celebrity.description && (
                <p className="text-sm text-foreground/50">
                  {celebrity.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

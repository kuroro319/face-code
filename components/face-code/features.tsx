import { Heart, Sparkles, Users, Wand2 } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "性格タイプ",
    description: "16種類の詳細な性格プロフィール。あなたの強み・弱み・価値観を深く分析。",
    color: "text-primary",
    bg: "bg-secondary",
  },
  {
    icon: Heart,
    title: "恋愛傾向",
    description: "恋愛パターン・理想のパートナー像・恋愛での注意点を顔相から読み解く。",
    color: "text-rose-400",
    bg: "bg-rose-50",
  },
  {
    icon: Users,
    title: "相性診断",
    description: "友人・恋愛・仕事での相性が良いタイプとの関係性を詳しく解説。",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Wand2,
    title: "メイクアドバイス",
    description: "あなたのFACEコードに最適なメイクアップのヒントをAIがパーソナライズ提案。",
    color: "text-sky-400",
    bg: "bg-sky-50",
  },
]

export function Features() {
  return (
    <section id="features" className="py-16 px-5 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-card text-primary border border-primary/20 mb-3">
            診断でわかること
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            あなたの<span className="text-primary">4つの側面</span>が明らかに
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                  <Icon className={f.color} size={24} />
                </div>
                <h3 className="text-base font-black text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function About() {
  const tags = ["目の形", "鼻の高さ", "口角の向き", "眉の角度", "輪郭", "額の広さ", "顎のライン", "耳の形"]

  return (
    <section id="about" className="py-16 px-5 bg-secondary/30">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-card text-primary border border-primary/20 mb-4">
          人相学とは
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6">
          1000年以上の歴史を持つ<br />
          <span className="text-primary">人相学</span>をAIで現代に
        </h2>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 text-left shadow-sm space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            人相学（にんそうがく）は、人の顔の特徴からその人の性格・運勢・才能を読み解く東洋の伝統的な知恵です。
            古代中国に起源を持ち、日本でも平安時代から武家社会で重用されてきました。
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">FACE CODE</span> は、この1000年以上の叡智をAI技術と融合させ、
            現代人に合わせてアップデートしました。最新のコンピュータービジョンと独自の人相学アルゴリズムにより、
            あなたの顔から16の個性タイプを精密に判定します。
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((item) => (
              <span
                key={item}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary border border-border text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

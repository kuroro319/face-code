import Link from "next/link"
import { Footer } from "@/components/face-code/footer"

export const metadata = {
  title: "利用規約 | FACE CODE",
  description: "FACE CODEの利用規約",
}

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: "#FFF8F5", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(232, 160, 160, 0.2)", backgroundColor: "#FFF8F5" }} className="py-4 px-5">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight">
              <span style={{ color: "#E8A0A0" }}>FACE</span>
              <span style={{ color: "rgba(45,45,45,0.6)" }}>CODE</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-12">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
              style={{ backgroundColor: "rgba(232, 160, 160, 0.1)", color: "#E8A0A0", border: "1px solid rgba(232, 160, 160, 0.3)" }}
            >
              TERMS
            </span>
            <h1 className="text-3xl md:text-4xl font-black" style={{ color: "#2D2D2D" }}>
              利用規約
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#888" }}>最終更新日：2026年3月28日</p>
          </div>

          <div className="space-y-10" style={{ color: "#2D2D2D" }}>
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第1条（適用）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                本利用規約（以下「本規約」）は、[運営者名]（以下「運営者」）が提供するウェブサービス「FACE CODE」（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第2条（サービスの性質・エンターテインメント目的）</h2>
              <div className="leading-relaxed space-y-3" style={{ color: "#555" }}>
                <p>
                  本サービスは、顔のパーツの特徴を独自のアルゴリズムで分析し、性格タイプを診断するエンターテインメントサービスです。
                </p>
                <p className="font-bold" style={{ color: "#E8A0A0" }}>
                  ⚠️ 本サービスの診断結果は、あくまでエンターテインメントを目的としたものであり、科学的・医学的根拠を保証するものではありません。診断結果を重要な意思決定の根拠として使用しないでください。
                </p>
                <p>
                  本サービスは人相学・骨相学的なエンターテインメントコンテンツとして提供されており、特定の人種・性別・外見に対する差別や偏見を助長する意図はありません。
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第3条（未成年者の利用）</h2>
              <div className="leading-relaxed space-y-3" style={{ color: "#555" }}>
                <p>
                  本サービスは、<span className="font-bold" style={{ color: "#2D2D2D" }}>18歳以上の方</span>を対象としています。
                </p>
                <p>
                  未成年者が本サービスを利用する場合は、保護者の同意が必要です。未成年者が保護者の同意なく本サービスを利用した場合、運営者はその責任を負いません。
                </p>
                <p>
                  有料プランを利用する未成年者は、保護者の同意を得た上で利用してください。未成年者による決済については、法定代理人（保護者）が同意したものとみなします。
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第4条（アカウント）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                本サービスは、アカウント登録不要でご利用いただけます。ただし、有料プランのご利用には決済情報の入力が必要です。
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第5条（禁止事項）</h2>
              <p className="mb-3 leading-relaxed" style={{ color: "#555" }}>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
              <ul className="space-y-2" style={{ color: "#555" }}>
                {[
                  "法令または公序良俗に違反する行為",
                  "犯罪行為に関連する行為",
                  "本サービスのサーバーやネットワークに過度な負荷をかける行為",
                  "本サービスの運営を妨害する恐れのある行為",
                  "他のユーザーに関する個人情報等を収集または蓄積する行為",
                  "不正アクセスをし、またはこれを試みる行為",
                  "他のユーザーに成りすます行為",
                  "本サービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為",
                  "第三者の顔写真を無断でアップロードする行為",
                  "診断結果を用いて他者を誹謗中傷する行為",
                  "その他、運営者が不適切と判断する行為",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: "#E8A0A0" }} className="mt-1 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第6条（本サービスの提供の停止等）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。システムメンテナンス、天災・障害による中断、その他運営者が必要と判断した場合が該当します。
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第7条（著作権）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                本サービスのコンテンツ（診断結果のテキスト・デザイン・ロジック等）の著作権は運営者に帰属します。ユーザーがアップロードした画像の著作権はユーザーに帰属します。ただし、ユーザーは運営者が診断目的でその画像を利用することを許諾するものとします。
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第8条（保証の否認および免責事項）</h2>
              <div className="leading-relaxed space-y-3" style={{ color: "#555" }}>
                <p>運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</p>
                <p>運営者は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません（運営者の故意または重過失による場合を除きます）。</p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第9条（サービス内容の変更等）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                運営者は、ユーザーへの事前の告知なしに、本サービスの内容を変更または本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第10条（利用規約の変更）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                運営者は必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の利用規約はサービス上に掲示した時点より効力を生じるものとします。
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第11条（準拠法・裁判管轄）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
            </section>

            {/* Contact */}
            <section
              className="rounded-2xl p-6"
              style={{ backgroundColor: "rgba(232, 160, 160, 0.08)", border: "1px solid rgba(232, 160, 160, 0.2)" }}
            >
              <h2 className="text-lg font-black mb-2" style={{ color: "#2D2D2D" }}>お問い合わせ</h2>
              <p style={{ color: "#555" }}>
                本規約に関するお問い合わせは、<Link href="/contact" style={{ color: "#E8A0A0" }} className="underline">お問い合わせフォーム</Link>よりご連絡ください。
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

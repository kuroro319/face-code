import Link from "next/link"
import { Footer } from "@/components/face-code/footer"

export const metadata = {
  title: "プライバシーポリシー | FACE CODE",
  description: "FACE CODEのプライバシーポリシー",
}

export default function PrivacyPage() {
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
              PRIVACY
            </span>
            <h1 className="text-3xl md:text-4xl font-black" style={{ color: "#2D2D2D" }}>
              プライバシーポリシー
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#888" }}>最終更新日：2026年3月30日</p>
          </div>

          <div className="space-y-10">
            {/* Intro */}
            <section>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                [運営者名]（以下「運営者」）は、FACE CODE（以下「本サービス」）における個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
              </p>
            </section>

            {/* Face Photo Policy - Highlighted ← ここを強化 */}
            <section
              className="rounded-2xl p-6"
              style={{ backgroundColor: "rgba(232, 160, 160, 0.08)", border: "2px solid rgba(232, 160, 160, 0.4)" }}
            >
              <h2 className="text-lg font-black mb-3" style={{ color: "#E8A0A0" }}>
                📷 顔写真の取り扱いについて（重要）
              </h2>
              <div className="space-y-3 leading-relaxed" style={{ color: "#2D2D2D" }}>
                {/* ← 追加 */}
                <div
                  className="rounded-xl p-3"
                  style={{ backgroundColor: "rgba(232, 160, 160, 0.12)", border: "1px solid rgba(232, 160, 160, 0.4)" }}
                >
                  <p className="font-bold">
                    ⚠️ アップロードできる写真はご自身の顔写真のみです。第三者の顔写真を本人の同意なくアップロードすることは禁止しており、18歳未満の第三者が写っている写真のアップロードもいかなる場合も禁止します。
                  </p>
                </div>

                <p>
                  <span className="font-bold">顔写真はAI判定のみに使用し、サーバーに保存しません。</span>アップロードされた顔写真は、診断処理が完了した後、直ちに破棄されます。
                </p>
                <p>
                  本サービスの診断処理にはAnthropic社のAI API（Claude）を使用しています。顔写真はAnthropicのAPIを経由してAI分析に利用されますが、<span className="font-bold">Anthropicのプライバシーポリシーに準拠した取り扱い</span>がなされます。
                </p>
                <p>
                  Anthropicのプライバシーポリシーについては、Anthropic社の公式サイトをご確認ください。診断目的以外で顔写真を第三者に提供することはありません。
                </p>
              </div>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第1条（収集する情報）</h2>
              <p className="mb-4 leading-relaxed" style={{ color: "#555" }}>運営者は、本サービスの提供にあたり、以下の情報を収集します。</p>

              <div className="space-y-4">
                <div className="pl-4" style={{ borderLeft: "3px solid #E8A0A0" }}>
                  <h3 className="font-bold mb-2" style={{ color: "#2D2D2D" }}>1. ユーザーが提供する情報</h3>
                  <ul className="space-y-1" style={{ color: "#555" }}>
                    <li>• 顔写真（診断処理のみに使用し、保存しません）</li>
                    <li>• お問い合わせ時のメールアドレス・氏名・メッセージ</li>
                    <li>• 有料プラン利用時の決済情報（決済代行業者を通じて処理）</li>
                  </ul>
                </div>

                <div className="pl-4" style={{ borderLeft: "3px solid #E8A0A0" }}>
                  <h3 className="font-bold mb-2" style={{ color: "#2D2D2D" }}>2. 自動的に収集される情報</h3>
                  <ul className="space-y-1" style={{ color: "#555" }}>
                    <li>• アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
                    <li>• Cookieおよびセッション情報</li>
                    <li>• 利用状況データ（診断回数、ページ遷移等）</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第2条（情報の利用目的）</h2>
              <p className="mb-3 leading-relaxed" style={{ color: "#555" }}>収集した情報は、以下の目的で利用します。</p>
              <ul className="space-y-2" style={{ color: "#555" }}>
                {[
                  "本サービスの提供・維持・改善",
                  "顔写真を用いたAI診断処理",
                  "お問い合わせへの対応",
                  "サービスの不正利用の防止",
                  "利用状況の分析・統計処理（個人を特定しない形式）",
                  "有料プランの決済処理",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: "#E8A0A0" }} className="mt-1 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第3条（第三者への提供）</h2>
              <p className="mb-3 leading-relaxed" style={{ color: "#555" }}>
                運営者は、次に掲げる場合を除いて、個人情報を第三者に提供することはありません。
              </p>
              <ul className="space-y-2" style={{ color: "#555" }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#E8A0A0" }} className="mt-1 flex-shrink-0">•</span>
                  <span>ユーザーの同意がある場合</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#E8A0A0" }} className="mt-1 flex-shrink-0">•</span>
                  <span>法令に基づく場合</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#E8A0A0" }} className="mt-1 flex-shrink-0">•</span>
                  <span>人の生命・身体・財産の保護のために必要がある場合</span>
                </li>
              </ul>

              <div
                className="mt-4 rounded-xl p-4"
                style={{ backgroundColor: "rgba(232, 160, 160, 0.06)", border: "1px solid rgba(232, 160, 160, 0.2)" }}
              >
                <p className="text-sm font-bold mb-2" style={{ color: "#2D2D2D" }}>利用している外部サービス</p>
                <ul className="text-sm space-y-1" style={{ color: "#555" }}>
                  <li>• <span className="font-semibold">Anthropic Claude API</span>：顔写真のAI分析処理</li>
                  <li>• 決済代行業者：有料プランの決済処理</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第4条（Cookieについて）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                本サービスでは、セッション管理およびサービス改善のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第5条（個人情報の管理）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                運営者は、個人情報の漏洩・滅失・毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。個人情報の取り扱いを委託する場合は、委託先において個人情報の安全管理が図られるよう、委託先に対する必要かつ適切な監督を行います。
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第6条（開示・訂正・削除の請求）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                ユーザーは、運営者が保有する自己の個人情報について、開示・訂正・削除を求めることができます。請求は<Link href="/contact" style={{ color: "#E8A0A0" }} className="underline">お問い合わせフォーム</Link>よりご連絡ください。本人確認の上、合理的な期間内に対応いたします。
              </p>
            </section>

            {/* Section 7 ← 追加 */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第7条（ユーザーの行為に起因するトラブルの免責）</h2>
              <div className="leading-relaxed space-y-3" style={{ color: "#555" }}>
                <p>
                  ユーザーが第三者の顔写真を本人の同意なくアップロードしたこと、または診断結果を第三者へのいじめ・誹謗中傷・ハラスメント・差別目的で使用したことに起因して生じたトラブル・損害（名誉毀損・プライバシー侵害・精神的損害等を含む）については、運営者は一切の責任を負いません。
                </p>
                <p>
                  当該行為を行ったユーザーが自己の責任において解決するものとし、運営者に損害が生じた場合はユーザーがその損害を賠償するものとします。
                </p>
              </div>
            </section>

            {/* Section 8 （旧7） */}
            <section>
              <h2 className="text-xl font-black mb-4" style={{ color: "#2D2D2D" }}>第8条（プライバシーポリシーの変更）</h2>
              <p className="leading-relaxed" style={{ color: "#555" }}>
                本ポリシーの内容は変更されることがあります。変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。重要な変更がある場合は、サービス上でお知らせします。
              </p>
            </section>

            {/* Contact */}
            <section
              className="rounded-2xl p-6"
              style={{ backgroundColor: "rgba(232, 160, 160, 0.08)", border: "1px solid rgba(232, 160, 160, 0.2)" }}
            >
              <h2 className="text-lg font-black mb-2" style={{ color: "#2D2D2D" }}>お問い合わせ窓口</h2>
              <div style={{ color: "#555" }} className="space-y-1">
                <p>事業者名：[運営者名]</p>
                <p>メールアドレス：[メールアドレス]</p>
                <p>受付時間：平日10:00〜18:00（土日祝除く）</p>
                <p className="mt-3">
                  <Link href="/contact" style={{ color: "#E8A0A0" }} className="underline">
                    → お問い合わせフォームはこちら
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

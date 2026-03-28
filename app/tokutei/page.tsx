import Link from "next/link"
import { Footer } from "@/components/face-code/footer"

export const metadata = {
  title: "特定商取引法に基づく表記 | FACE CODE",
  description: "FACE CODEの特定商取引法に基づく表記",
}

const rows: { label: string; value: string }[] = [
  { label: "販売業者", value: "[運営者名]" },
  { label: "代表者名", value: "[代表者名]" },
  { label: "所在地", value: "[所在地]（請求があれば遅滞なく開示します）" },
  { label: "電話番号", value: "請求があれば遅滞なく開示します" },
  { label: "メールアドレス", value: "[メールアドレス]" },
  { label: "販売URL", value: "https://face-code.vercel.app（またはご利用のURL）" },
  {
    label: "販売価格",
    value: "以下のプランをご参照ください",
  },
  { label: "商品代金以外の必要料金", value: "なし（通信料・接続料はお客様負担）" },
  { label: "支払方法", value: "クレジットカード決済" },
  { label: "支払時期", value: "購入手続き完了時" },
  { label: "サービス提供時期", value: "決済完了後、即時提供" },
  {
    label: "返品・キャンセル",
    value:
      "デジタルコンテンツの性質上、購入完了後の返品・返金はお断りしております。ただし、サービスの重大な不具合による場合はこの限りではありません。",
  },
  { label: "動作環境", value: "インターネット接続環境および対応ブラウザ（Chrome / Safari / Firefox 最新版推奨）" },
]

const plans = [
  {
    name: "ベーシック診断",
    price: "¥200",
    desc: "1回の詳細診断レポート",
    type: "買い切り",
  },
  {
    name: "プレミアム診断",
    price: "¥480",
    desc: "詳細診断レポート＋有名人比較・深掘り分析",
    type: "買い切り",
  },
  {
    name: "月額プラン",
    price: "¥980 / 月",
    desc: "月間診断し放題＋全プレミアム機能",
    type: "月額継続",
  },
]

export default function TokuteiPage() {
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
              LEGAL
            </span>
            <h1 className="text-3xl md:text-4xl font-black" style={{ color: "#2D2D2D" }}>
              特定商取引法に基づく表記
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#888" }}>最終更新日：2026年3月28日</p>
          </div>

          {/* Plans */}
          <div className="mb-12">
            <h2 className="text-xl font-black mb-6" style={{ color: "#2D2D2D" }}>料金プラン</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(232, 160, 160, 0.25)" }}
                >
                  <div
                    className="inline-block px-3 py-0.5 rounded-full text-xs font-bold mb-3"
                    style={{ backgroundColor: "rgba(232, 160, 160, 0.1)", color: "#E8A0A0" }}
                  >
                    {plan.type}
                  </div>
                  <p className="font-black text-lg mb-1" style={{ color: "#2D2D2D" }}>{plan.name}</p>
                  <p className="text-2xl font-black mb-2" style={{ color: "#E8A0A0" }}>{plan.price}</p>
                  <p className="text-sm" style={{ color: "#555" }}>{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(232, 160, 160, 0.2)" }}>
            <table className="w-full">
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: i < rows.length - 1 ? "1px solid rgba(232, 160, 160, 0.15)" : "none",
                    }}
                  >
                    <th
                      className="text-left text-sm font-bold px-5 py-4 align-top"
                      style={{
                        backgroundColor: "rgba(232, 160, 160, 0.06)",
                        color: "#2D2D2D",
                        width: "35%",
                        minWidth: "120px",
                      }}
                    >
                      {row.label}
                    </th>
                    <td
                      className="text-sm px-5 py-4 align-top leading-relaxed"
                      style={{ color: "#555", backgroundColor: "rgba(255,255,255,0.5)" }}
                    >
                      {row.label === "販売価格" ? (
                        <span>
                          ¥200（ベーシック診断） / ¥480（プレミアム診断） / ¥980/月（月額プラン）<br />
                          <span className="text-xs" style={{ color: "#888" }}>※ 表示価格はすべて税込です</span>
                        </span>
                      ) : (
                        row.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div
            className="mt-8 rounded-2xl p-6"
            style={{ backgroundColor: "rgba(232, 160, 160, 0.08)", border: "1px solid rgba(232, 160, 160, 0.2)" }}
          >
            <h3 className="font-black mb-2" style={{ color: "#2D2D2D" }}>月額継続プランについて</h3>
            <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "#555" }}>
              <li>• 月額プランは毎月自動更新されます。</li>
              <li>• 解約はいつでも可能です。解約後は次回更新日まで引き続きご利用いただけます。</li>
              <li>• 解約手続きは<Link href="/contact" style={{ color: "#E8A0A0" }} className="underline">お問い合わせフォーム</Link>よりお申し込みください。</li>
              <li>• 月途中での解約の場合、日割り返金は行っておりません。</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

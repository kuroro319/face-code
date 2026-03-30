"use client";

import { getCompatibility, COMPATIBILITY_CATEGORIES, TYPE_NAMES, TypeCompatibility } from "@/lib/compatibility-data";

// ─── カラーマップ ───────────────────────────────────────────
const CATEGORY_STYLES = {
  soulmate: {
    bg: "#FFF0F4",
    border: "#E8A0B4",
    accent: "#C9546E",
    badgeBg: "#FDDDE8",
    badgeText: "#9B3050",
    pillBg: "#FCE8EE",
  },
  rival: {
    bg: "#FFFBF0",
    border: "#F0C060",
    accent: "#B87D0A",
    badgeBg: "#FEF3CC",
    badgeText: "#8A5D08",
    pillBg: "#FEF0C0",
  },
  healing: {
    bg: "#F2FAF4",
    border: "#74C98A",
    accent: "#2E7D45",
    badgeBg: "#D8F2DF",
    badgeText: "#1E5E31",
    pillBg: "#D4F0DC",
  },
  caution: {
    bg: "#FFF6F0",
    border: "#F0946A",
    accent: "#B04D1E",
    badgeBg: "#FDDECE",
    badgeText: "#8C3A15",
    pillBg: "#FCD8C4",
  },
  mirror: {
    bg: "#F6F3FF",
    border: "#A48FD8",
    accent: "#5C3DAE",
    badgeBg: "#E8E0F8",
    badgeText: "#432C8A",
    pillBg: "#E0D8F8",
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_STYLES;

// ─── 型バッジ ───────────────────────────────────────────────
function TypeBadge({
  code,
  badgeBg,
  badgeText,
}: {
  code: string;
  badgeBg: string;
  badgeText: string;
}) {
  const name = TYPE_NAMES[code] ?? code;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: badgeBg,
        color: badgeText,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "3px 8px",
        borderRadius: "20px",
        marginRight: "6px",
        marginBottom: "4px",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "10px", opacity: 0.7 }}>{code}</span>
      <span>{name}</span>
    </span>
  );
}

// ─── 相性カード（1パターン） ────────────────────────────────
function CompatCard({
  categoryKey,
  compat,
}: {
  categoryKey: CategoryKey;
  compat: TypeCompatibility[CategoryKey];
}) {
  const meta = COMPATIBILITY_CATEGORIES.find((c) => c.key === categoryKey)!;
  const style = CATEGORY_STYLES[categoryKey];

  return (
    <div
      style={{
        backgroundColor: style.bg,
        borderRadius: "16px",
        borderLeft: `4px solid ${style.border}`,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* カテゴリヘッダー */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "18px", lineHeight: 1 }}>{meta.emoji}</span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: style.accent,
            letterSpacing: "0.06em",
          }}
        >
          {meta.label}
        </span>
      </div>

      {/* タイプバッジ群 */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {compat.types.map((code) => (
          <TypeBadge
            key={code}
            code={code}
            badgeBg={style.badgeBg}
            badgeText={style.badgeText}
          />
        ))}
      </div>

      {/* キャッチコピー（メインテキスト） */}
      <div
        style={{
          backgroundColor: style.pillBg,
          borderRadius: "10px",
          padding: "10px 14px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            fontWeight: 700,
            color: style.accent,
            lineHeight: 1.6,
          }}
        >
          {compat.catchphrase}
        </p>
      </div>

      {/* 説明文 */}
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "#888",
          lineHeight: 1.7,
        }}
      >
        {compat.description}
      </p>
    </div>
  );
}

// ─── メインコンポーネント ──────────────────────────────────
export default function CompatibilitySection({ typeCode }: { typeCode: string }) {
  const data = getCompatibility(typeCode);

  if (!data) {
    return (
      <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>
        相性データが見つかりません
      </p>
    );
  }

  return (
    <section
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "0 16px 40px",
        fontFamily:
          "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
      }}
    >
      {/* セクションヘッダー */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "28px",
          paddingTop: "8px",
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontSize: "11px",
            letterSpacing: "0.12em",
            color: "#C9546E",
            fontWeight: 600,
          }}
        >
          COMPATIBILITY
        </p>
        <h2
          style={{
            margin: "0 0 4px",
            fontSize: "22px",
            fontWeight: 700,
            color: "#1a1a1a",
            letterSpacing: "-0.01em",
          }}
        >
          16タイプとの相性
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
          {data.name}タイプ（{typeCode}）の人間関係パターン
        </p>
      </div>

      {/* 5パターンカード */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {(["soulmate", "rival", "healing", "caution", "mirror"] as const).map(
          (key) => (
            <CompatCard key={key} categoryKey={key} compat={data[key]} />
          )
        )}
      </div>

      {/* フッター注記 */}
      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#bbb",
          marginTop: "24px",
          lineHeight: 1.6,
        }}
      >
        ※ 相性はあくまで傾向です。どんな組み合わせでも
        <br />
        理解と歩み寄りで素敵な関係を築けます。
      </p>
    </section>
  );
}

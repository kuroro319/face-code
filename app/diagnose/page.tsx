'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type FaceKey = 'F' | 'A' | 'C' | 'E';

const ITEMS: { key: FaceKey; color: string; bg: string; title: string; desc: string }[] = [
  { key: 'F', color: '#E8A0A0', bg: '#FFF0EE', title: 'Flow — エネルギーの方向', desc: 'おでこの広さ・目の大きさ・口の大きさ' },
  { key: 'A', color: '#E8A0A0', bg: '#FFF0F5', title: 'Affection — 愛情スタイル', desc: '目の形・唇の厚さ・口角の向き' },
  { key: 'C', color: '#A0C8E8', bg: '#F0F8FF', title: 'Connection — 対人スタイル', desc: '眉の形・眉間の広さ・耳の大きさ' },
  { key: 'E', color: '#B0A0E8', bg: '#F5F0FF', title: 'Emotion — 感情処理', desc: '鼻の形・眉の濃さ・黒目の割合' },
];

// SVG coordinate space: 170×220
// 画像はsquare（約170×170）でobjectPosition:topにより上端から配置
const HIGHLIGHTS: Record<FaceKey, { cx: number; cy: number; rx: number; ry: number }[]> = {
  F: [
    { cx: 85, cy: 30, rx: 50, ry: 22 },   // おでこ
    { cx: 58, cy: 68, rx: 20, ry: 12 },   // 左目
    { cx: 112, cy: 68, rx: 20, ry: 12 },  // 右目
    { cx: 85, cy: 109, rx: 24, ry: 13 },  // 口
  ],
  A: [
    { cx: 58, cy: 68, rx: 20, ry: 12 },   // 左目
    { cx: 112, cy: 68, rx: 20, ry: 12 },  // 右目
    { cx: 85, cy: 109, rx: 24, ry: 13 },  // 唇
  ],
  C: [
    { cx: 85, cy: 55, rx: 52, ry: 14 },   // 眉
    { cx: 38, cy: 72, rx: 10, ry: 18 },   // 左耳
    { cx: 132, cy: 72, rx: 10, ry: 18 },  // 右耳
  ],
  E: [
    { cx: 85, cy: 90, rx: 18, ry: 24 },   // 鼻
    { cx: 60, cy: 55, rx: 22, ry: 9 },    // 左眉
    { cx: 110, cy: 55, rx: 22, ry: 9 },   // 右眉
    { cx: 63, cy: 69, rx: 9, ry: 10 },    // 左黒目
    { cx: 107, cy: 69, rx: 9, ry: 10 },   // 右黒目
  ],
};

export default function DiagnosePage() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeKey, setActiveKey] = useState<FaceKey>('F');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '診断に失敗しました');
      if (data.reasons) {
        sessionStorage.setItem('faceCodeReasons', JSON.stringify(data.reasons));
      }
      router.push(`/result/${data.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : '診断中にエラーが発生しました');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F5]">
      <header className="flex justify-between items-center px-8 py-5">
        <a href="/" className="text-2xl font-bold tracking-widest text-[#2D2D2D]">FACE CODE</a>
        <nav className="flex gap-6 text-sm text-[#888]">
          <a href="#">タイプ一覧</a>
          <a href="#">相性診断</a>
          <a href="#">JP / EN</a>
        </nav>
      </header>

      <section className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-2 gap-12 items-start">

        {/* 左カラム */}
        <div>
          <p className="text-sm tracking-widest text-[#E8A0A0] mb-3 uppercase">Step 1</p>
          <h2 className="text-3xl font-bold text-[#2D2D2D] mb-2">写真をアップロード</h2>
          <p className="text-[#888] mb-6 text-sm">正面を向いた顔写真を使用してください</p>

          {!image ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-[#E8A0A0] bg-[#FFF0EE]' : 'border-[#ddd] hover:border-[#E8A0A0]'
              }`}
            >
              <div className="text-4xl mb-3">📷</div>
              <p className="text-[#888] text-sm mb-2">写真をドラッグ＆ドロップ</p>
              <p className="text-[#bbb] text-xs">または</p>
              <button className="mt-3 bg-[#2D2D2D] text-white px-6 py-2 rounded-full text-sm hover:bg-[#E8A0A0] transition-colors">
                ファイルを選択
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="text-center">
              <img src={image} alt="アップロード画像" className="w-56 h-56 object-cover rounded-3xl mx-auto mb-5 shadow-md" />
              {error && (
                <p className="text-sm text-red-400 mb-3">{error}</p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => { setImage(null); setError(null); }}
                  disabled={isLoading}
                  className="border border-[#ddd] text-[#888] px-6 py-2 rounded-full text-sm hover:border-[#E8A0A0] transition-colors disabled:opacity-40"
                >
                  撮り直す
                </button>
                <button
                  onClick={handleDiagnose}
                  disabled={isLoading}
                  className="bg-[#2D2D2D] text-white px-8 py-2 rounded-full text-sm hover:bg-[#E8A0A0] transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      分析中...
                    </>
                  ) : '診断する →'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-medium text-[#2D2D2D] mb-3 text-sm">📌 撮影のコツ</h3>
            <ul className="text-sm text-[#888] space-y-2">
              <li>✓ 正面を向いて撮影する</li>
              <li>✓ 明るい場所で撮影する</li>
              <li>✓ サングラスや帽子は外す</li>
              <li>✓ 髪で顔が隠れないようにする</li>
            </ul>
          </div>
          <p className="text-center text-xs text-[#bbb] mt-4">アップロードされた写真は診断後すぐに削除されます</p>
        </div>

        {/* 右カラム */}
        <div>
          <p className="text-sm tracking-widest text-[#E8A0A0] mb-3 uppercase">診断ポイント</p>
          <h3 className="text-xl font-bold text-[#2D2D2D] mb-6">顔のここを分析します</h3>

          <div className="flex gap-6 items-start">

            {/* 顔イラスト + SVGオーバーレイ */}
            <div style={{ position: 'relative', flexShrink: 0, width: '170px', height: '220px' }}>
              <img
                src="/face-model.png"
                alt="顔"
                style={{ display: 'block', width: '170px', height: '220px', objectFit: 'contain', objectPosition: 'top' }}
              />
              <svg
                viewBox="0 0 170 220"
                style={{ position: 'absolute', top: 0, left: 0, width: '170px', height: '220px', pointerEvents: 'none', overflow: 'visible' }}
              >
                {HIGHLIGHTS[activeKey].map((shape, i) => {
                  const item = ITEMS.find(it => it.key === activeKey)!;
                  return (
                    <ellipse
                      key={i}
                      cx={shape.cx}
                      cy={shape.cy}
                      rx={shape.rx}
                      ry={shape.ry}
                      fill={item.color + '22'}
                      stroke={item.color}
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                    />
                  );
                })}
              </svg>
            </div>

            {/* ボタンリスト */}
            <div className="flex flex-col gap-3 flex-1">
              {ITEMS.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className="flex items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-all"
                  style={{
                    background: activeKey === item.key ? item.bg : 'transparent',
                    border: `1.5px solid ${activeKey === item.key ? item.color : '#eee'}`,
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: activeKey === item.key ? item.color : item.bg,
                      color: activeKey === item.key ? '#fff' : item.color,
                      border: `1px solid ${item.color}`,
                    }}
                  >
                    {item.key}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#2D2D2D]">{item.title}</p>
                    <p className="text-xs text-[#888] mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}
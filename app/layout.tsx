import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://face-code-xi.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'FACE CODE｜顔写真でわかるあなたの本当の性格',
    template: '%s | FACE CODE',
  },
  description:
    'AIが顔写真を分析して16タイプの性格を診断。メイク・ファッション・恋愛傾向・仕事運まで。無料で今すぐ診断できます。',
  keywords: ['顔診断', '性格診断', '人相学', 'AI診断', 'パーソナリティ', 'FACE CODE'],
  authors: [{ name: 'FACE CODE' }],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: BASE_URL,
    siteName: 'FACE CODE',
    title: 'FACE CODE｜顔写真でわかるあなたの本当の性格',
    description:
      'AIが顔写真を分析して16タイプの性格を診断。メイク・ファッション・恋愛傾向・仕事運まで。無料で今すぐ診断できます。',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'FACE CODE - 顔写真でわかるあなたの本当の性格',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FACE CODE｜顔写真でわかるあなたの本当の性格',
    description:
      'AIが顔写真を分析して16タイプの性格を診断。メイク・ファッション・恋愛傾向・仕事運まで。無料で今すぐ診断できます。',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}

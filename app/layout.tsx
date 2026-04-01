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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://face-code.vercel.app'
  ),
  title: 'FACE CODE | 顔写真でわかるあなたの本当の性格',
  description:
    '人相学×AIで導き出す、新感覚パーソナリティ診断。あなたの顔が語る、本当の自分を発見しよう。',
  openGraph: {
    title: 'FACE CODE | 顔写真でわかるあなたの本当の性格',
    description:
      '人相学×AIで導き出す、新感覚パーソナリティ診断。あなたの顔が語る、本当の自分を発見しよう。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FACE CODE | 顔写真でわかるあなたの本当の性格',
    description:
      '人相学×AIで導き出す、新感覚パーソナリティ診断。あなたの顔が語る、本当の自分を発見しよう。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}

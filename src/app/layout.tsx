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
  title: "バドミントン大会検索 | 全国の大会情報を簡単検索",
  description: "日本全国のバドミントン大会情報を開催日、都道府県、カテゴリーから簡単に検索できます。一般・学生・シニア・実業団など幅広い大会情報を掲載。",
  keywords: "バドミントン,大会,検索,競技,トーナメント,日本,全国,スポーツ",
  authors: [{ name: "バドミントン大会検索" }],
  openGraph: {
    title: "バドミントン大会検索",
    description: "全国のバドミントン大会情報を簡単に検索",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "バドミントン大会検索",
    description: "全国のバドミントン大会情報を簡単に検索",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {children}
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                © 2024 バドミントン大会検索. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  プライバシーポリシー
                </a>
                <a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  利用規約
                </a>
                <a href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                  管理者ページ
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

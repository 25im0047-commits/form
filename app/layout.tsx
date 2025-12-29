import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "K-PASS｜受験相談＆説明会予約ページ",
  description: "K-PASSの受験相談＆説明会予約ページです。",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="text-[#304036] bg-[#f9f9f9]">
        <header className="h-20 mb-1 shadow-md flex items-center justify-center font-bold bg-white">
          <h1>受験相談＆説明会 申込フォーム</h1>
        </header>
        <main className=" min-h-[80vh]">{children}</main>
        <footer className="bg-white drop-shadow-2xl">
          <div className="w-fit m-auto">
            <Link href="/">
              <Image src="/lib/logo.jpg" alt="logo" width={200} height={200} />
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}

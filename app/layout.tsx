import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="text-[#304036] bg-[#f9f9f9]">
        <header className="h-20 mb-1 shadow-md flex items-center justify-center font-bold bg-white">
          <h1>無料説明会申し込みフォーム</h1>
        </header>
        <main className=" min-h-[80vh]">
          {children}
        </main>
        <footer className="bg-white h-20 drop-shadow-2xl">
          footer
        </footer>
      </body>
    </html>
  );
}

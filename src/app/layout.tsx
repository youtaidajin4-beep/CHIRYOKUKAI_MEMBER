import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { MemberProvider } from "@/context/MemberContext";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Supira 知力会ネットワーク管理",
  description:
    "知力会の紹介ネットワークを、求人開拓・OB訪問・学生紹介につなげる管理システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={noto.variable}>
      <body className={`${noto.className} min-h-screen`}>
        <MemberProvider>{children}</MemberProvider>
      </body>
    </html>
  );
}

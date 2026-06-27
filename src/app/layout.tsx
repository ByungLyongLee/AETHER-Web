import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "AETHER Protocol — Decentralized Music Streaming",
  description: "탈중앙화 음악 스트리밍 플랫폼. 음악을 소유하고, 큐레이션하고, 수익을 나눈다.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

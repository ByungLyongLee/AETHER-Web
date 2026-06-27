"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "발견" },
  { href: "/drops", label: "라이브 드롭" },
  { href: "/propagation", label: "확산 지도" },
  { href: "/portfolio", label: "내 시그널" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-aether-border bg-aether-bg/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-aether-signal opacity-20 ripple-ring" />
              <div className="relative h-8 w-8 rounded-full bg-aether-signal/10 border border-aether-signal/40 flex items-center justify-center">
                <Radio className="h-4 w-4 text-aether-signal" />
              </div>
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">AETHER</span>
              <span className="text-xs text-aether-signal/70 ml-1.5 hidden sm:inline">mesh</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-aether-signal/10 text-aether-signal"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}>
                {link.label}
              </Link>
            ))}
          </nav>

          <ConnectButton label="지갑 연결" accountStatus="avatar" chainStatus="icon" showBalance={false} />
        </div>
      </div>
    </header>
  );
}

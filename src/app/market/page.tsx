"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Flame, Clock, Star } from "lucide-react";

const MOCK_SEEDS = [
  { id: 6, title: "Genesis Block", artist: "Satoshi.eth", cover: "🔮",
    price: "0.279 AETH", pct: 79, genre: "Techno", trend: "+34%", hot: true },
  { id: 3, title: "Protocol Break", artist: "CryptoBeats.eth", cover: "⚡",
    price: "0.0912 AETH", pct: 21, genre: "Hip-Hop", trend: "+12%", hot: true },
  { id: 1, title: "Neon Drift", artist: "0xArtist.eth", cover: "🌌",
    price: "0.0334 AETH", pct: 23, genre: "Electronic", trend: "+5%", hot: false },
  { id: 5, title: "FLAC Energy", artist: "HiRes.eth", cover: "🎷",
    price: "0.0756 AETH", pct: 20, genre: "Jazz", trend: "+8%", hot: false },
  { id: 2, title: "Solstice", artist: "Luna.eth", cover: "🌙",
    price: "0.089 AETH", pct: 18, genre: "Ambient", trend: "+2%", hot: false },
  { id: 4, title: "On-Chain Requiem", artist: "Vanguard.eth", cover: "🎻",
    price: "0.032 AETH", pct: 6, genre: "Classical", trend: "+1%", hot: false },
];

type SortKey = "hot" | "new" | "price" | "pct";

export default function MarketPage() {
  const [sort, setSort] = useState<SortKey>("hot");

  const SORTS = [
    { key: "hot" as SortKey, label: "인기", icon: Flame },
    { key: "new" as SortKey, label: "신규", icon: Clock },
    { key: "pct" as SortKey, label: "판매율", icon: TrendingUp },
    { key: "price" as SortKey, label: "가격순", icon: Star },
  ];

  const sorted = [...MOCK_SEEDS].sort((a, b) => {
    if (sort === "pct") return b.pct - a.pct;
    if (sort === "price") return parseFloat(b.price) - parseFloat(a.price);
    if (sort === "hot") return (b.hot ? 1 : 0) - (a.hot ? 1 : 0);
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">시드 마켓</h1>
        <div className="flex gap-1 bg-aether-card border border-aether-border rounded-xl p-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sort === s.key
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <s.icon className="h-3 w-3" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-aether-border bg-aether-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-aether-border">
              <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium">#</th>
              <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium">트랙</th>
              <th className="text-left text-xs text-slate-500 px-5 py-3 font-medium hidden sm:table-cell">장르</th>
              <th className="text-right text-xs text-slate-500 px-5 py-3 font-medium">현재가</th>
              <th className="text-right text-xs text-slate-500 px-5 py-3 font-medium hidden md:table-cell">판매율</th>
              <th className="text-right text-xs text-slate-500 px-5 py-3 font-medium">변동</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((seed, i) => (
              <tr key={seed.id} className="border-b border-aether-border/50 hover:bg-white/2 transition-colors">
                <td className="px-5 py-4 text-sm text-slate-500">{i + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{seed.cover}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{seed.title}</span>
                        {seed.hot && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">HOT</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{seed.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="text-xs border border-aether-border rounded-full px-2 py-0.5 text-slate-400">
                    {seed.genre}
                  </span>
                </td>
                <td className="px-5 py-4 text-right text-sm font-medium text-white">{seed.price}</td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-aether-border overflow-hidden">
                      <div className="h-full bonding-gradient" style={{ width: `${seed.pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-8">{seed.pct}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right text-sm text-green-400">{seed.trend}</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/seed/${seed.id}`}
                    className="px-3 py-1.5 text-xs rounded-lg bonding-gradient text-white font-medium"
                  >
                    구매
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

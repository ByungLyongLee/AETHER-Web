"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Wallet, TrendingUp, Coins, Music2, ArrowDownToLine } from "lucide-react";
import Link from "next/link";

// 목업 데이터
const MOCK_HOLDINGS = [
  {
    songId: 1, title: "Neon Drift", artist: "0xArtist.eth", cover: "🌌",
    seedCount: 5, avgCost: "0.052 AETH", currentPrice: "0.0334 AETH",
    pendingRoyalty: "12.48", totalEarned: "47.3",
  },
  {
    songId: 3, title: "Protocol Break", artist: "CryptoBeats.eth", cover: "⚡",
    seedCount: 20, avgCost: "0.061 AETH", currentPrice: "0.0912 AETH",
    pendingRoyalty: "89.2", totalEarned: "231.7",
  },
  {
    songId: 6, title: "Genesis Block", artist: "Satoshi.eth", cover: "🔮",
    seedCount: 2, avgCost: "0.179 AETH", currentPrice: "0.279 AETH",
    pendingRoyalty: "4.1", totalEarned: "18.9",
  },
];

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const [claiming, setClaiming] = useState<number | null>(null);

  const totalPending = MOCK_HOLDINGS.reduce((a, h) => a + parseFloat(h.pendingRoyalty), 0);
  const totalEarned = MOCK_HOLDINGS.reduce((a, h) => a + parseFloat(h.totalEarned), 0);
  const totalSeeds = MOCK_HOLDINGS.reduce((a, h) => a + h.seedCount, 0);

  function handleClaim(songId: number) {
    setClaiming(songId);
    // TODO: writeContract claimRoyalty
    setTimeout(() => setClaiming(null), 2000);
  }

  function handleClaimAll() {
    // TODO: 순차적으로 모든 songId 클레임
    MOCK_HOLDINGS.forEach((h) => handleClaim(h.songId));
  }

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Wallet className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">지갑을 연결하세요</h2>
        <p className="text-slate-400">포트폴리오를 확인하려면 지갑 연결이 필요합니다</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">내 포트폴리오</h1>
        <p className="text-xs text-slate-500 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "보유 시드", value: totalSeeds, unit: "개", icon: Music2 },
          { label: "미청구 수익", value: totalPending.toFixed(2), unit: "AETH", icon: Coins, highlight: true },
          { label: "총 수익", value: totalEarned.toFixed(1), unit: "AETH", icon: TrendingUp },
          { label: "보유 곡 수", value: MOCK_HOLDINGS.length, unit: "곡", icon: Wallet },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-4 ${
              s.highlight
                ? "border-purple-500/40 bg-purple-500/10"
                : "border-aether-border bg-aether-card"
            }`}
          >
            <s.icon className={`h-4 w-4 mb-2 ${s.highlight ? "text-purple-400" : "text-slate-500"}`} />
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.unit} · {s.label}</div>
          </div>
        ))}
      </div>

      {/* 전체 클레임 버튼 */}
      {totalPending > 0 && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              미청구 수익 <span className="text-purple-300">{totalPending.toFixed(2)} AETH</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">모든 곡의 로열티를 한 번에 청구</p>
          </div>
          <button
            onClick={handleClaimAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bonding-gradient text-white text-sm font-medium"
          >
            <ArrowDownToLine className="h-4 w-4" />
            전체 클레임
          </button>
        </div>
      )}

      {/* 보유 시드 목록 */}
      <div className="space-y-3">
        {MOCK_HOLDINGS.map((holding) => (
          <div
            key={holding.songId}
            className="rounded-xl border border-aether-border bg-aether-card p-5 flex items-center gap-4"
          >
            {/* 커버 */}
            <div className="h-14 w-14 rounded-xl bg-aether-border flex items-center justify-center text-2xl flex-shrink-0">
              {holding.cover}
            </div>

            {/* 트랙 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-white">{holding.title}</span>
                <span className="text-xs text-slate-500">{holding.artist}</span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                <span>보유 <strong className="text-white">{holding.seedCount}</strong> 시드</span>
                <span>평균 매입 {holding.avgCost}</span>
                <span className="hidden sm:block">현재가 {holding.currentPrice}</span>
              </div>
            </div>

            {/* 수익 + 클레임 */}
            <div className="text-right flex-shrink-0">
              <div className="text-purple-300 font-semibold">
                +{holding.pendingRoyalty} AETH
              </div>
              <div className="text-xs text-slate-500 mb-2">미청구</div>
              <button
                onClick={() => handleClaim(holding.songId)}
                disabled={claiming === holding.songId || parseFloat(holding.pendingRoyalty) === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 transition-colors disabled:opacity-40"
              >
                {claiming === holding.songId ? "처리 중..." : "클레임"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {MOCK_HOLDINGS.length === 0 && (
        <div className="text-center py-20">
          <Music2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">아직 보유한 시드가 없습니다</p>
          <Link href="/" className="mt-4 inline-block text-purple-400 text-sm hover:text-purple-300">
            음악 탐색하기 →
          </Link>
        </div>
      )}
    </div>
  );
}

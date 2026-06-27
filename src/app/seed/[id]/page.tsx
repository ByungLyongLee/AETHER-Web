"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ArrowLeft, TrendingUp, Users, Zap, Info } from "lucide-react";
import Link from "next/link";
import { CONTRACT_ADDRESSES, MUSIC_SEED_ABI, AETH_TOKEN_ABI } from "@/lib/contracts";

// 목업 (실제는 컨트랙트에서)
const MOCK_SONG = {
  id: 1, title: "Neon Drift", artist: "0xArtist.eth",
  genre: "Electronic", duration: "3:42", cover: "🌌",
  description: "블록체인 위에서 흐르는 전자음악. 메타버스 시대의 사운드트랙.",
  initialPrice: "0.0001",
  soldAmount: 234, totalSupply: 1000,
  totalRevenue: "1204.5",
  plays: 12847,
};

const PRICE_INCREMENT = 0.0001; // ether

function calcBondingPrice(n: number, initialPrice: number) {
  return initialPrice + n * PRICE_INCREMENT;
}

export default function SeedPage() {
  const { id } = useParams();
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState(1);

  const chainAddresses = CONTRACT_ADDRESSES.polygonAmoy;
  const song = MOCK_SONG; // TODO: 실제 컨트랙트 데이터

  const currentPrice = calcBondingPrice(song.soldAmount, parseFloat(song.initialPrice));
  const totalCost = Array.from({ length: amount }, (_, i) =>
    calcBondingPrice(song.soldAmount + i, parseFloat(song.initialPrice))
  ).reduce((a, b) => a + b, 0);

  const pct = Math.round((song.soldAmount / song.totalSupply) * 100);

  // 컨트랙트 write
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  function handleBuy() {
    if (!isConnected) return;
    writeContract({
      address: chainAddresses.MusicSeed,
      abi: MUSIC_SEED_ABI,
      functionName: "buySeed",
      args: [BigInt(id as string), BigInt(amount)],
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* 뒤로가기 */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8">
        <ArrowLeft className="h-4 w-4" /> 스트리밍으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 왼쪽: 트랙 정보 */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-aether-border bg-aether-card p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-20 w-20 rounded-xl bg-aether-border flex items-center justify-center text-4xl flex-shrink-0">
                {song.cover}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{song.title}</h1>
                <p className="text-purple-400">{song.artist}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs border border-aether-border rounded-full px-2 py-0.5 text-slate-400">
                    {song.genre}
                  </span>
                  <span className="text-xs text-slate-500">{song.duration}</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">{song.description}</p>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "총 플레이", value: song.plays.toLocaleString(), icon: TrendingUp },
                { label: "시드 홀더", icon: Users,
                  value: `${song.soldAmount}/${song.totalSupply}` },
                { label: "총 수익", value: `${song.totalRevenue} AETH`, icon: Zap },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-aether-bg border border-aether-border p-3 text-center">
                  <s.icon className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-white">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 본딩 커브 설명 */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">선형 본딩 커브</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>• 시드를 살수록 가격이 0.0001 AETH씩 올라갑니다</p>
              <p>• 초기 진입할수록 낮은 가격에 구매 가능</p>
              <p>• 스트리밍 수익은 보유 시드 비율로 자동 분배</p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 구매 패널 */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-aether-border bg-aether-card p-6 sticky top-20">
            <h2 className="text-lg font-bold text-white mb-4">시드 구매</h2>

            {/* 진행률 */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">판매 현황</span>
                <span className="text-purple-300 font-medium">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-aether-border overflow-hidden">
                <div
                  className="h-full bonding-gradient rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1 text-slate-500">
                <span>{song.soldAmount} sold</span>
                <span>{song.totalSupply - song.soldAmount} remaining</span>
              </div>
            </div>

            {/* 현재 가격 */}
            <div className="rounded-xl bg-aether-bg border border-aether-border p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">현재 시드 가격</span>
                <span className="text-lg font-bold text-white">
                  {currentPrice.toFixed(4)} AETH
                </span>
              </div>
            </div>

            {/* 수량 선택 */}
            <div className="mb-4">
              <label className="text-sm text-slate-400 block mb-2">구매 수량</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  className="h-10 w-10 rounded-lg border border-aether-border text-white hover:border-purple-500 transition-colors text-xl"
                >
                  −
                </button>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 h-10 rounded-lg border border-aether-border bg-aether-bg text-center text-white text-lg font-semibold focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => setAmount(amount + 1)}
                  className="h-10 w-10 rounded-lg border border-aether-border text-white hover:border-purple-500 transition-colors text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* 총 비용 */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-300">총 비용</span>
                <span className="text-xl font-bold text-white">
                  {totalCost.toFixed(4)} AETH
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                평균 {(totalCost / amount).toFixed(4)} AETH / 시드
              </p>
            </div>

            {/* 구매 버튼 */}
            {!isConnected ? (
              <div className="text-center text-sm text-slate-400 py-3">
                지갑을 연결해주세요
              </div>
            ) : isSuccess ? (
              <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-center">
                <p className="text-green-400 font-medium">✅ 구매 완료!</p>
                <p className="text-xs text-slate-400 mt-1">포트폴리오에서 확인하세요</p>
              </div>
            ) : (
              <button
                onClick={handleBuy}
                disabled={isPending || isConfirming}
                className="w-full py-3 rounded-xl bonding-gradient text-white font-semibold text-sm transition-opacity disabled:opacity-50"
              >
                {isPending ? "승인 중..." : isConfirming ? "확인 중..." : `시드 ${amount}개 구매`}
              </button>
            )}

            {txHash && (
              <p className="text-xs text-center text-slate-500 mt-2">
                Tx: {txHash.slice(0, 10)}...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

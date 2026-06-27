"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, Minus,
  Flame, Zap, Radio, Share2,
  ChevronRight, Play, MapPin, Star, Clock, BarChart2
} from "lucide-react";

const TRACKS = [
  {
    id: 11,
    title: "Analog Mesh", artist: "Hyukoh",
    cover: "📡", genre: "Indie",
    origin: "YES24 라이브홀 · 서울",
    hopsTotal: 12403,   // 누적 재생
    hops6h: 2841,       // 6시간 재생
    hopsPerHour: 847,
    seedPrice: 0.089, seedSold: 412, seedTotal: 1000,
    seedChange24h: +34,
    investScore: 92, investTag: "급등 중", investColor: "text-aether-live",
    hot: true,
  },
  {
    id: 13,
    title: "Blueprint", artist: "DPR LIVE",
    cover: "⚡", genre: "R&B",
    origin: "올림픽홀 · 잠실",
    hopsTotal: 891, hops6h: 2103, hopsPerHour: 412,
    seedPrice: 0.041, seedSold: 24, seedTotal: 300,
    seedChange24h: +61,
    investScore: 88, investTag: "초기 진입", investColor: "text-aether-signal",
    hot: true,
  },
  {
    id: 15,
    title: "Signal Drift", artist: "CIFIKA",
    cover: "🌌", genre: "Electronic",
    origin: "홍대 무브먼트 · 서울",
    hopsTotal: 203, hops6h: 1890, hopsPerHour: 198,
    seedPrice: 0.011, seedSold: 9, seedTotal: 200,
    seedChange24h: +112,
    investScore: 95, investTag: "발굴 기회", investColor: "text-aether-gold",
    hot: true,
  },
  {
    id: 12,
    title: "Proof of Presence", artist: "Giriboy",
    cover: "🔊", genre: "Hip-Hop",
    origin: "KT&G 상상마당 · 홍대",
    hopsTotal: 34891, hops6h: 340, hopsPerHour: 120,
    seedPrice: 0.279, seedSold: 789, seedTotal: 1000,
    seedChange24h: -2,
    investScore: 41, investTag: "성숙 단계", investColor: "text-slate-400",
    hot: false,
  },
  {
    id: 10,
    title: "새벽 3시의 루프", artist: "0xOrigin",
    cover: "🌙", genre: "Jazz",
    origin: "재즈바 에반스 · 이태원",
    hopsTotal: 1847, hops6h: 203, hopsPerHour: 203,
    seedPrice: 0.034, seedSold: 87, seedTotal: 500,
    seedChange24h: +8,
    investScore: 78, investTag: "초기 진입", investColor: "text-aether-signal",
    hot: false,
  },
  {
    id: 16,
    title: "On-Chain Requiem", artist: "Vanguard",
    cover: "🎻", genre: "Classical",
    origin: "예술의전당 · 서초",
    hopsTotal: 4120, hops6h: 88, hopsPerHour: 34,
    seedPrice: 0.052, seedSold: 156, seedTotal: 800,
    seedChange24h: +1,
    investScore: 33, investTag: "안정세", investColor: "text-slate-500",
    hot: false,
  },
];

type Tab = "trending" | "alltime" | "invest" | "new";

function RankChange({ curr, prev }: { curr: number; prev: number }) {
  const diff = prev - curr;
  if (diff > 0) return (
    <span className="flex items-center gap-0.5 text-xs text-aether-signal font-medium">
      <TrendingUp className="h-3 w-3" />+{diff}
    </span>
  );
  if (diff < 0) return (
    <span className="flex items-center gap-0.5 text-xs text-aether-live font-medium">
      <TrendingDown className="h-3 w-3" />{diff}
    </span>
  );
  return <Minus className="h-3 w-3 text-slate-600" />;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-aether-gold" : score >= 60 ? "bg-aether-signal" : "bg-slate-600";
  return (
    <div className="flex items-center gap-2 justify-end">
      <div className="h-1.5 w-16 rounded-full bg-aether-border overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-white w-6">{score}</span>
    </div>
  );
}

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("trending");
  const [playing, setPlaying] = useState<number | null>(null);

  const TABS: { key: Tab; label: string; sub: string; icon: React.ElementType }[] = [
    { key: "trending", label: "지금 트렌딩",  sub: "6시간 기준",    icon: Flame },
    { key: "alltime",  label: "누적 차트",    sub: "전체 기간",    icon: BarChart2 },
    { key: "invest",   label: "투자 가치",    sub: "시드 기회",    icon: Star },
    { key: "new",      label: "신규 드롭",    sub: "새로 나온 것", icon: Radio },
  ];

  const sorted = [...TRACKS].sort((a, b) => {
    if (tab === "trending") return b.hops6h - a.hops6h;
    if (tab === "alltime")  return b.hopsTotal - a.hopsTotal;
    if (tab === "invest")   return b.investScore - a.investScore;
    return a.seedSold - b.seedSold; // new: 판매량 적은 순
  });

  const top = sorted[0];

  // 탭별 서브 메트릭 설정
  const metricLabel = tab === "trending" ? "6시간 재생" : tab === "alltime" ? "누적 재생" : tab === "invest" ? "투자 점수" : "잔여 시드";
  const metricValue = (t: typeof TRACKS[0]) =>
    tab === "trending" ? t.hops6h.toLocaleString() + "회" :
    tab === "alltime"  ? t.hopsTotal.toLocaleString() + "회" :
    tab === "invest"   ? null : // ScoreBar로 별도 렌더
    (t.seedTotal - t.seedSold) + "개";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

      {/* ── 탭 ──────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-shrink-0 flex flex-col items-start px-4 py-2.5 rounded-xl
                        border text-left transition-all ${
              tab === t.key
                ? "border-aether-signal/40 bg-aether-signal/10"
                : "border-aether-border bg-aether-card hover:border-aether-signal/20"
            }`}>
            <div className={`flex items-center gap-1.5 text-sm font-semibold ${
              tab === t.key ? "text-aether-signal" : "text-white"
            }`}>
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </div>
            <span className="text-xs text-slate-500 mt-0.5">{t.sub}</span>
          </button>
        ))}
      </div>

      {/* ── 1위 피처드 ─────────────────────────────── */}
      <section className="mb-6 rounded-2xl border border-aether-signal/20
                          bg-gradient-to-br from-aether-card to-aether-bg p-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full
                        bg-aether-signal/5 ripple-ring pointer-events-none" />

        <div className="flex items-center gap-1.5 mb-4">
          {tab === "trending" && <Flame className="h-4 w-4 text-aether-live" />}
          {tab === "alltime"  && <BarChart2 className="h-4 w-4 text-aether-signal" />}
          {tab === "invest"   && <Star className="h-4 w-4 text-aether-gold" />}
          {tab === "new"      && <Radio className="h-4 w-4 text-aether-signal" />}
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {TABS.find(t => t.key === tab)?.label} 1위
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-aether-border
                          flex items-center justify-center text-3xl flex-shrink-0">
            {top.cover}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl font-black text-aether-signal">#1</span>
              {top.hot && (
                <span className="text-xs bg-aether-live/20 text-aether-live
                                 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Flame className="h-3 w-3" /> HOT
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">{top.title}</h2>
            <p className="text-slate-400 text-sm">{top.artist}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3 text-aether-gold" />
              {top.origin}
            </div>
          </div>
          <button
            onClick={() => setPlaying(playing === top.id ? null : top.id)}
            className="h-10 w-10 rounded-full signal-gradient
                       flex items-center justify-center flex-shrink-0">
            <Play className="h-4 w-4 text-white ml-0.5" />
          </button>
        </div>

        {/* 핵심 수치 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            {
              label: tab === "trending" ? "6시간 재생" : "누적 재생",
              value: tab === "trending"
                ? top.hops6h.toLocaleString() + "회"
                : top.hopsTotal.toLocaleString() + "회",
              icon: tab === "trending" ? Clock : Share2,
              color: "text-aether-signal",
            },
            { label: "시드 가격", value: top.seedPrice + " AETH", icon: TrendingUp, color: "text-white" },
            { label: "투자 점수", value: top.investScore + " / 100", icon: Star, color: "text-aether-gold" },
          ].map(s => (
            <div key={s.label}
                 className="rounded-xl bg-aether-bg border border-aether-border p-3 text-center">
              <s.icon className={`h-3.5 w-3.5 mx-auto mb-1 ${s.color}`} />
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <Link href={`/seed/${top.id}`}
              className="mt-3 flex items-center justify-center gap-2
                         w-full py-2.5 rounded-xl signal-gradient
                         text-white text-sm font-semibold">
          시드 구매하기 <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      {/* ── 차트 리스트 ─────────────────────────────── */}
      <section className="rounded-2xl border border-aether-border bg-aether-card overflow-hidden">
        {/* 컬럼 헤더 */}
        <div className="grid grid-cols-[3rem_1fr_7rem_6rem_6rem] gap-2
                        px-5 py-3 border-b border-aether-border
                        text-xs text-slate-500 font-medium uppercase tracking-wider">
          <span className="text-center">순위</span>
          <span>트랙</span>
          <span className="text-right hidden sm:block">{metricLabel}</span>
          <span className="text-right">시드 가격</span>
          <span className="text-right">
            {tab === "invest" ? "단계" : "24h 변동"}
          </span>
        </div>

        {sorted.map((track, i) => {
          const isTop = i === 0;
          const pct = Math.round((track.seedSold / track.seedTotal) * 100);
          const isPlaying = playing === track.id;

          return (
            <div key={track.id}
                 className={`grid grid-cols-[3rem_1fr_7rem_6rem_6rem] gap-2 items-center
                              px-5 py-4 border-b border-aether-border/40
                              hover:bg-white/[0.02] transition-colors group
                              ${isTop ? "bg-aether-signal/[0.03]" : ""}`}>

              {/* 순위 */}
              <div className="text-center">
                <span className={`text-lg font-black leading-none ${
                  i === 0 ? "text-aether-signal" :
                  i === 1 ? "text-slate-200" :
                  i === 2 ? "text-aether-gold" : "text-slate-500"
                }`}>{i + 1}</span>
              </div>

              {/* 트랙 */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setPlaying(isPlaying ? null : track.id)}
                  className="h-10 w-10 rounded-xl bg-aether-border flex-shrink-0
                             flex items-center justify-center text-xl relative">
                  <span className={`transition-opacity ${isPlaying ? "opacity-0" : ""}`}>
                    {track.cover}
                  </span>
                  <Play className={`absolute h-4 w-4 text-white ml-0.5 transition-opacity
                    ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-sm truncate">
                      {track.title}
                    </span>
                    {track.hot && <Flame className="h-3 w-3 text-aether-live flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400">{track.artist}</p>
                  {/* 시드 잔여 바 */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="h-1 w-16 rounded-full bg-aether-border overflow-hidden">
                      <div className="h-full signal-gradient rounded-full"
                           style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-600">
                      {(track.seedTotal - track.seedSold)}개 남음
                    </span>
                  </div>
                </div>
              </div>

              {/* 메트릭 */}
              <div className="text-right hidden sm:block">
                {tab === "invest"
                  ? <ScoreBar score={track.investScore} />
                  : (
                    <span className="text-sm font-medium text-white">
                      {metricValue(track)}
                    </span>
                  )
                }
              </div>

              {/* 시드 가격 */}
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{track.seedPrice}</p>
                <p className="text-xs text-slate-600">AETH</p>
              </div>

              {/* 변동 or 단계 */}
              <div className="text-right">
                {tab === "invest" ? (
                  <span className={`text-xs font-semibold ${track.investColor}`}>
                    {track.investTag}
                  </span>
                ) : (
                  <span className={`text-sm font-semibold ${
                    track.seedChange24h > 0 ? "text-aether-signal" :
                    track.seedChange24h < 0 ? "text-aether-live" : "text-slate-400"
                  }`}>
                    {track.seedChange24h > 0 ? "+" : ""}{track.seedChange24h}%
                  </span>
                )}
                <Link href={`/seed/${track.id}`}
                      className="mt-0.5 block text-xs text-slate-600
                                 hover:text-aether-signal transition-colors
                                 opacity-0 group-hover:opacity-100">
                  구매 →
                </Link>
              </div>

            </div>
          );
        })}
      </section>

      {/* 하단 업데이트 안내 */}
      <p className="mt-4 text-center text-xs text-slate-600">
        트렌딩 차트는 10분마다 업데이트 ·
        누적 차트는 1시간마다 업데이트 ·
        투자 점수 = 확산 속도 + 시드 잔여량 + 가격 모멘텀
      </p>

    </div>
  );
}

# AETHER Protocol — Web Frontend

탈중앙화 음악 스트리밍 플랫폼 웹 인터페이스

## 스택

- **Next.js 14** (App Router)
- **wagmi v2 + viem** — 스마트 컨트랙트 연동
- **RainbowKit** — 지갑 연결 UI
- **TailwindCSS** — 스타일링
- **Polygon Amoy** testnet → Polygon mainnet

## 시작하기

```bash
cd AETHER-Web
cp .env.local.example .env.local
# .env.local에 WalletConnect Project ID 입력

npm install
npm run dev
```

→ http://localhost:3000

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 음악 피드 + 스트리밍 플레이어 |
| `/market` | 시드 마켓 (정렬/필터) |
| `/seed/[id]` | 시드 구매 (본딩 커브) |
| `/portfolio` | 내 시드 + 로열티 클레임 |

## 컨트랙트 연동

`src/lib/contracts.ts`의 `CONTRACT_ADDRESSES`에 배포 주소 입력 후 사용.

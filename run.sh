#!/bin/bash
# AETHER Web 실행 스크립트
DIR=$(find ~/Desktop -maxdepth 2 -name "AETHER-Web" -type d 2>/dev/null | head -1)
if [ -z "$DIR" ]; then
  echo "❌ AETHER-Web 폴더를 찾을 수 없습니다"
  exit 1
fi
echo "📂 폴더: $DIR"
cd "$DIR"
if [ ! -f ".env.local" ]; then
  cp .env.local.example .env.local
  echo "✅ .env.local 생성"
fi
echo "📦 npm install 중..."
npm install
echo "🚀 개발 서버 시작..."
npm run dev

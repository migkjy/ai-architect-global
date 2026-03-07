# ai-architect-global — 개발 PL 전용

## 프로젝트 개요
AI 건축가 글로벌 랜딩 페이지 / 판매 플랫폼 (Lemon Squeezy 연동)

## 기술 스택
- 프레임워크: Next.js 16
- 언어: TypeScript
- 스타일: Tailwind CSS
- 배포: Vercel (production/staging 브랜치만)

## 프로젝트 경로
`/Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global/`

## 빌드 & 실행
```bash
npm install
npm run dev
npm run build
```

## 환경 변수
`.env` 파일 참조

## 개발 PL 권한
- 코드 수정/배포 가능
- 타 프로젝트 파일 수정 금지
- 작업 완료 후 반드시 commit + push

## Git 브랜치 규칙 (CEO 지시 2026-03-07)
- **main → production 직행 PR 절대 금지**
- 브랜치 흐름: `main` → `staging` → `production`
- PR은 반드시 main → staging으로 생성
- staging → production 머지는 VP만 수행
- 긴급 핫픽스도 staging 경유 필수 (예외 없음)

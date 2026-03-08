# ai-architect-global — 개발 PL 전용

## 프로젝트 개요
AI Native Playbook 글로벌 랜딩 페이지 / 판매 플랫폼 (Lemon Squeezy 연동)

## 리브랜딩 (2026-03-08 완료)
- **변경 전**: AI Driven Architect
- **변경 후**: AI Native Playbook
- **주 도메인**: ai-native-playbook.com (DNS 활성, SSL 발급)
- **기존 도메인**: ai-driven-architect.com (301 리다이렉트 → ai-native-playbook.com)

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

## 제품/콘텐츠 규칙 (CEO 지시 2026-03-07)
- **일본어 제품 추가 제작 금지** — 현재 영어/한국어 제품만 유지
- 기존 일본어 SEO 메타데이터(title, description, hreflang 등)는 현행 유지
- 일본어 신규 콘텐츠(블로그, 상품 설명 등) 생성 금지

## Git 브랜치 규칙 (CEO 지시 2026-03-07)
- **main → production 직행 PR 절대 금지**
- 브랜치 흐름: `main` → `staging` → `production`
- PR은 반드시 main → staging으로 생성
- staging → production 머지는 VP만 수행
- 긴급 핫픽스도 staging 경유 필수 (예외 없음)

## 소통 프로토콜
- 자비스에게 보고: `scripts/project-reply.sh "메시지" "ai-architect-global"`
- VP/CEO에게 직접 보고 금지 (자비스 경유)
- 에스컬레이션: 프로젝트 세션 -> 자비스 -> VP -> CEO
- shared-memory: `/Users/nbs22/(Claude)/(claude).projects/shared-memory/`

## 프로젝트 지식 (Knowledge)
- 세션 시작 시 `.claude/knowledge/context.md` 반드시 읽기
- 세션 종료 전 작업 결과를 `context.md`에 업데이트

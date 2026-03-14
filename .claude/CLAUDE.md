# ai-architect-global — AI Native Playbook

## 프로젝트 개요
- **제품명**: AI Native Playbook (구 AI Driven Architect)
- **한국어 브랜드**: 설계자 시리즈 (변경 금지)
- **도메인**: ai-native-playbook.com (신규), ai-driven-architect.com (기존 병행)
- **정체성**: AI 네이티브 플레이북 글로벌 랜딩/판매 플랫폼
- **판매**: Lemon Squeezy 연동

## 기술 스택
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v3
- **분석**: PostHog
- **배포**: Vercel (production/staging)

## GitHub
- **Repo**: migkjy/ai-architect-global
- **브랜치 전략**: main → staging → production
- **main → production 직행 PR 절대 금지**

## 배포
- **Production URL**: ai-native-playbook.com (Vercel)
- **배포 브랜치**: production, staging (main은 배포 안 됨)

## 도메인 마이그레이션 (HOLD)
- ai-driven-architect.com → ai-native-playbook.com
- DNS 활성화 완료, 코드 246건 교체 완료 → Paddle 심사 중 전부 revert
- **Paddle 심사 완료 + CEO 확인 후 재착수**

## 세션 시작 시
1. 이 파일 읽기
2. `.claude/knowledge/constraints.md` 읽기

## 소통 프로토콜
- 자비스에게 보고: `scripts/project-reply.sh "메시지" "ai-architect-global"`
- VP/CEO 직접 보고 금지 (자비스 경유)

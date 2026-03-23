# AI Native Playbook

AI 비즈니스 프레임워크 디지털 상품 플랫폼. 6권의 AI Native Playbook 시리즈, AI Agent Skills/Agents, Notion 실행 템플릿을 판매하는 글로벌 서비스.

- **도메인**: ai-native-playbook.com (마이그레이션 예정, 현재 ai-driven-architect.com)
- **한국어 브랜드**: '설계자 시리즈' (변경 금지)

## 기술 스택

- **프레임워크**: Next.js 15+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **다국어(i18n)**: next-intl (en, ko, ja)
- **결제**: Paddle (심사 대기 중)
- **이메일**: Brevo (온보딩 시퀀스 4단계)
- **분석**: PostHog, Sentry, GA4, Meta Pixel
- **배포**: Vercel (production 브랜치)

## 상품 구성

| 카테고리 | 내용 | 가격 |
|----------|------|------|
| AI Native Playbook Series | PDF 6권 (Brand, Content, Marketing, Startup, Story, Traffic) | 개별 $17 |
| Complete Bundle | 6권 전체 번들 | $47 (54% 할인) |
| AI Agent Skills | .md 6종 | 번들 포함 |
| AI Agent Agents | .md 6종 | 번들 포함 |
| Notion 실행 템플릿 | Master Template, Execution Tracker, Quick Reference | 번들 포함 |
| 무료 가이드 | AI Starter Guide | 무료 |

### 5개 실행 패턴

- Value Ladder
- Mass Movement
- Dream 100
- Story-Driven
- Product Launch

## 빠른 시작

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm start         # 프로덕션 서버
```

## 환경 변수

`.env` 파일을 참조하여 필요한 환경 변수를 설정합니다.

## 배포

- **브랜치 전략**: main -> staging -> production (main -> production 직행 금지)
- **플랫폼**: Vercel
- staging, production 브랜치만 Vercel에 배포됨

## 상품 파일 경로

`public/products/` 디렉토리에 배포용 상품 파일이 위치합니다. 이 디렉토리는 `.gitignore`에 포함되어 있으며, 별도 빌드 프로세스(`ai-architect-package/dist/`)에서 복사합니다.

```
public/products/
├── pdf/       # EN PDF 6권
├── skills/    # EN Skills .md 6종
├── agents/    # EN Agents .md 6종
└── notion/    # EN Notion 템플릿 .md 3종
```

## 프로젝트 경로

```
/Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global/
```

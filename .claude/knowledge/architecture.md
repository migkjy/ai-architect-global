# ai-architect-global 아키텍처

## 기술 스택
| 카테고리 | 기술 | 버전 |
|----------|------|------|
| Framework | Next.js (App Router) | ^16.1.6 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4.1 |
| Analytics | PostHog | - |
| Sales | Lemon Squeezy | - |
| Deployment | Vercel | - |

## 배포 구조
- **Vercel**: production + staging 브랜치만 배포 (main은 배포 안 됨)
- 정적 에셋 캐시 (1년), 이미지 캐시 (30일)

## 제품 구조
- 영어/한국어 제품 (디지털 PDF)
- Lemon Squeezy로 결제/배포
- 한국어 브랜드: '설계자 시리즈'

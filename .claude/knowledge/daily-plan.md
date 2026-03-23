# AI Native Playbook — Daily Growth Plan

**생성일**: 2026-03-24
**대상 OKR**: O1-KR2 (Paddle 라이브 전환 → 글로벌 판매 시작)
**프로젝트 상태**: 운영중 (결제 블로커 존재)

## 현재 상태 요약
- 사이트 운영 중 (ai-native-playbook.com, 301 리다이렉트 적용)
- Paddle 결제 통합 완료 + checkout 로딩 버그 수정 완료 (fix/paddle-checkout-loading)
- 다운로드 시스템(토큰 기반) + E2E 테스트 main 머지 완료 (3/23 batch)
- main→staging 2커밋 갭 존재 (batch 머지 + E2E 테스트 미반영)

## 어제(3/23) 대비 변경사항

### 3/23 batch → main 머지 완료
- `3c40d27` merge: batch 2026-03-23 → main (PR #229 + #230)
- EN 다운로드 시스템 (토큰 기반 배송 + 트래킹)
- EN 상품 파일 배포 설정 + README 업데이트
- E2E 테스트 추가 (다운로드 시스템)

### fix/paddle-checkout-loading 브랜치
- `a752abd` fix: resolve Paddle checkout stuck on "Preparing checkout..."
- **main 미머지 상태** — PR 필요

### 301 도메인 리다이렉트 main 머지
- ai-driven-architect.com → ai-native-playbook.com 301 리다이렉트 적용

### 어제 플랜 대비 진척
- **P1(feat/blog-ai-native-business → main)**: 이미 main 머지 완료
- **P2(feat/conversion-optimization → main)**: staging 머지 완료
- **P3(내부 링크 강화)**: 미실행
- **신규**: Paddle checkout 버그 수정, 다운로드 시스템, 도메인 리다이렉트

## 블로커 (AI 수행 불가)

| 블로커 | 상태 | 대기 주체 |
|--------|------|-----------|
| Paddle Client Token | waiting_external (12일째) | CEO/Paddle |
| 너처 이메일 활성화 | NURTURE_ENABLED=false | CEO 승인 필요 |
| 일본어 신규 콘텐츠 | CEO 금지 | - |

## 성장 과업 (우선순위순)

### P1: fix/paddle-checkout-loading → main PR 생성 — ICE: 9/9/9
- **목표**: O1-KR2 (Paddle 라이브 전환 준비)
- **구체적 작업**: fix/paddle-checkout-loading 브랜치 빌드+테스트 검증 → main PR 생성
- **예상 결과**: Paddle Token 수령 즉시 결제 정상 작동 보장 (checkout 멈춤 버그 해소)
- **제약사항**: PR 생성만. 머지는 VP 일괄 검수 후
- **긴급도**: 높음 — 결제 경험 직결 버그 수정

### P2: main → staging PR 생성 (batch 동기화) — ICE: 8/9/9
- **목표**: staging/production 배포 파이프라인 정상화
- **구체적 작업**: main의 2커밋 (batch 머지 + E2E) → staging PR 생성
- **예상 결과**: 다운로드 시스템 + E2E 테스트가 staging에 반영 → production 승격 준비
- **제약사항**: PR 생성만. VP batch 머지 규칙 준수

### P3: 블로그 내부 링크 강화 — ICE: 7/8/7
- **목표**: O2-KR2 (유기 트래픽 월 10K 세션)
- **구체적 작업**:
  - 블로그 23편 → /pricing, /products, /free-guide CTA 링크 점검
  - 고립 페이지(orphan pages) 식별 및 내부 링크 연결
  - 신규 블로그(다운로드 시스템 관련)에서 제품 페이지로 CTA 확인
- **예상 결과**: 내부 링크 강화로 페이지 권위 분산 + 전환율 향상
- **제약사항**: 콘텐츠 생성 금지 (자비스/PL), 기존 콘텐츠 내 링크만 수정

### P4: FAQ/Product 구조화 데이터(Schema.org) 보강 — ICE: 6/7/6
- **목표**: O2-KR2 (유기 트래픽)
- **구체적 작업**:
  - /pricing 또는 /products에 Product 스키마 확장
  - FAQ 섹션에 FAQPage 스키마 → 리치 스니펫 노출
- **예상 결과**: 검색결과 리치 스니펫 노출 → CTR 향상
- **제약사항**: 기존 JSON-LD 구조 유지하면서 확장

### P5: PostHog 전환 이벤트 + 다운로드 트래킹 검증 — ICE: 5/7/8
- **목표**: 전환 파이프라인 데이터 정확성 확보
- **구체적 작업**:
  - free-guide 전환, 블로그 CTA 클릭 이벤트 정상 추적 확인
  - 신규 다운로드 시스템 토큰 기반 트래킹 정상 작동 확인
- **예상 결과**: 전환율 데이터 기반 의사결정 가능
- **제약사항**: PostHog 대시보드 접근 필요

## Cross-Project Insights
- apppro.kr 뉴스레터 구독자 15K 목표 — ainp도 유사한 리드마그넷 전략 활용 가능
- membership-saas의 결제 시스템(포트원 V2)과 ainp의 Paddle — 결제 경험 패턴 공유 가능
- 다운로드 시스템(토큰 기반)이 richbukae 디지털 상품 배송에도 참고 가능

## 성장 지표 추적

| 지표 | 현재값 | 목표 | 비고 |
|------|--------|------|------|
| 블로그 수 | 23편 | 월 2~3편 추가 | 게리 에이전트 담당 |
| 결제 활성화 | 비활성 | Paddle Token 수령 즉시 | CEO 블로커 12일째 |
| 리드 캡처 | /free-guide 활성 | 전환율 모니터링 필요 | PostHog 검증 필요 |
| 이메일 퍼널 | 온보딩 v3 완료 | NURTURE_ENABLED=true | CEO 승인 대기 |
| 다운로드 시스템 | main 머지 완료 | staging→production 배포 | P2에서 처리 |
| 도메인 리다이렉트 | 301 설정 완료 | ai-native-playbook.com 주도메인 | Paddle 심사 후 |
| main→staging 갭 | 2커밋 | 0 | P2에서 처리 |
| feat 브랜치 | 1개 (checkout fix) | main PR 필요 | P1에서 처리 |

## 금지 과업 (절대 착수 불가)
- 일본어 제품/콘텐츠 추가 제작 (CEO 금지)
- 크로스 프로모션/다른 서비스 링크 (CEO 금지)
- 한국어 '설계자' 브랜드명 변경 (CEO 금지)
- 블로그/콘텐츠 신규 생성 (게리 에이전트 전담, 자비스/PL 금지)
- 도메인 마이그레이션 실행 (Paddle 심사 대기 HOLD)
- main → production 직행 PR (staging 경유 필수)
- PR 직접 머지 (VP만 머지)

## 권장 사항 (자비스 참고)

1. **P1 즉시 실행** — Paddle checkout 버그 수정 PR 생성. 매출 KR 직결
2. **P2 즉시 실행** — main→staging 동기화 PR. 다운로드 시스템 production 승격 준비
3. **Paddle Client Token CEO 재확인** — 12일째 대기. 에스컬레이션 강력 권장
4. **다운로드 시스템 E2E 테스트 통과 확인** — production 배포 전 검증 필수
5. **내부 링크(P3)** — 블로그 23편 자산 활용 극대화, SEO 효과 즉시 발생

---

*생성: 2026-03-24 | 다음 리뷰: 2026-03-25*

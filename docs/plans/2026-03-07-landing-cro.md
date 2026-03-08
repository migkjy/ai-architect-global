# ai-native-playbook.com Landing Page CRO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve landing page conversion rate by adding targeted audience section, strengthening risk reversal, and optimizing CTA placement.

**Architecture:** Modify the existing `page.tsx` landing page to add 2 new sections (Who Is This For, Guarantee) and enhance the existing pricing section. All changes are in a single file with minimal new components.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, next-intl (en/ko/ja)

---

### Task 1: Add "Who Is This For" Section (after Problem/Solution)

**Files:**
- Modify: `src/app/[locale]/page.tsx` (insert after line ~337, after Problem/Solution section closing tag)

**Step 1: Add the target audience data and section**

Insert this data array after the `faqs` array (around line 125):

```tsx
const targetAudiences = [
  {
    icon: "rocket",
    title: "Solopreneurs & Side Hustlers",
    desc: "You've read the books but can't afford a strategist. AI becomes your $10K consultant for $47.",
  },
  {
    icon: "chart",
    title: "Marketers & Agency Owners",
    desc: "You know the frameworks but implementation takes weeks. Cut execution time from days to hours.",
  },
  {
    icon: "store",
    title: "E-commerce & Course Creators",
    desc: "You need funnels, copy, and launch sequences — yesterday. Get all three systems in one bundle.",
  },
  {
    icon: "pen",
    title: "Content Creators & Writers",
    desc: "You want to grow an audience and monetize. AI runs the systematic parts while you create.",
  },
];
```

Insert this JSX after the Problem/Solution section's closing `</section>` (after line ~337):

```tsx
{/* Who Is This For */}
<section className="py-20 bg-navy-dark/40">
  <div className="max-w-5xl mx-auto px-4">
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Built For People Who <span className="gradient-gold">Execute</span>
      </h2>
      <p className="text-text-secondary max-w-2xl mx-auto">
        Not another theory course. These are implementation systems for people ready to act.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {targetAudiences.map((a) => (
        <div
          key={a.title}
          className="bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all"
        >
          <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center mb-4">
            {a.icon === "rocket" && (
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
            )}
            {a.icon === "chart" && (
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
            )}
            {a.icon === "store" && (
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" /></svg>
            )}
            {a.icon === "pen" && (
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
            )}
          </div>
          <h3 className="font-bold text-text-primary mb-2">{a.title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{a.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: Build and verify**

Run: `cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global && npm run build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: add 'Who Is This For' target audience section for CRO"
```

---

### Task 2: Add Money-Back Guarantee Badge to Pricing Section

**Files:**
- Modify: `src/app/[locale]/page.tsx` (enhance the Bundle CTA / Pricing section around line ~540)

**Step 1: Add guarantee badge below the Bundle pricing card**

Replace the closing `<p>` tag at line ~617-619 (the "Source books retail..." text) with an enhanced guarantee section:

```tsx
{/* Guarantee Badge */}
<div className="max-w-md mx-auto mt-10 bg-surface/60 border border-green-500/20 rounded-2xl p-6 text-center">
  <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
    <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  </div>
  <h3 className="font-bold text-text-primary mb-2">7-Day Money-Back Guarantee</h3>
  <p className="text-sm text-text-secondary leading-relaxed">
    Try all 6 frameworks risk-free. If they don&apos;t deliver value for your business within 7 days,
    email us and get a full refund. No questions asked. No hoops.
  </p>
</div>

<p className="text-center text-text-muted text-xs mt-6">
  Source books retail for ~$175+. Strategy consulting to apply them: $2,000-$10,000+.
</p>
```

**Step 2: Build and verify**

Run: `cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: add money-back guarantee badge to pricing section"
```

---

### Task 3: Enhance Testimonials with Result Highlight Cards

**Files:**
- Modify: `src/app/[locale]/page.tsx` (testimonials section around line ~468)

**Step 1: Add result highlight to each testimonial card**

Replace the testimonial card's result display (the bottom `<div className="border-t...">` block, lines ~488-493) to make results more prominent:

Change this pattern inside the testimonials `.map()`:
```tsx
<div className="border-t border-white/5 pt-4">
  <div className="font-semibold text-text-primary text-sm">{t.name}</div>
  <div className="text-text-muted text-xs">{t.role}</div>
  <div className="text-gold text-xs font-semibold mt-1">{t.result}</div>
</div>
```

To:
```tsx
<div className="border-t border-white/5 pt-4">
  <div className="bg-gold/10 border border-gold/20 rounded-lg px-3 py-2 mb-3">
    <div className="text-gold font-bold text-sm">{t.result}</div>
  </div>
  <div className="font-semibold text-text-primary text-sm">{t.name}</div>
  <div className="text-text-muted text-xs">{t.role}</div>
</div>
```

**Step 2: Build and verify**

Run: `cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: enhance testimonial cards with prominent result badges"
```

---

### Task 4: Add "As Seen In" Trust Strip Below Social Proof Numbers

**Files:**
- Modify: `src/app/[locale]/page.tsx` (after social proof numbers section, around line ~284)

**Step 1: Add trust signals strip**

Insert after the Social Proof Numbers section closing `</section>` (line ~284):

```tsx
{/* Trust Signals */}
<section className="py-6 border-b border-white/5">
  <div className="max-w-5xl mx-auto px-4">
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-text-muted text-xs">
      <span className="uppercase tracking-wider font-medium">Works with</span>
      <span className="flex items-center gap-2 text-text-secondary font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full" />
        Claude (Anthropic)
      </span>
      <span className="flex items-center gap-2 text-text-secondary font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full" />
        ChatGPT (OpenAI)
      </span>
      <span className="flex items-center gap-2 text-text-secondary font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full" />
        Gemini (Google)
      </span>
      <span className="flex items-center gap-2 text-text-secondary font-medium">
        <span className="w-2 h-2 bg-green-400 rounded-full" />
        Any AI with system prompts
      </span>
    </div>
  </div>
</section>
```

**Step 2: Build and verify**

Run: `cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: add AI platform trust strip below social proof"
```

---

### Task 5: Enhance StickyMobileCTA for Both Mobile and Desktop

**Files:**
- Modify: `src/components/StickyMobileCTA.tsx`

**Step 1: Add urgency text and desktop visibility**

The current StickyMobileCTA already works on all viewports (no `md:hidden`). Enhance it with subtle urgency:

Replace the inner content div (lines 29-33):
```tsx
<div>
  <div className="text-sm font-bold text-text-primary">
    Complete Bundle
    <span className="text-gold ml-2">${bundlePrice}</span>
  </div>
  <div className="text-xs text-text-muted">All 6 books · 7-day guarantee</div>
</div>
```

With:
```tsx
<div>
  <div className="text-sm font-bold text-text-primary">
    Complete Bundle
    <span className="text-gold ml-2">${bundlePrice}</span>
    <span className="text-xs text-text-secondary line-through ml-1.5">$102</span>
  </div>
  <div className="text-xs text-text-muted">All 6 books · Instant download · 7-day guarantee</div>
</div>
```

**Step 2: Build and verify**

Run: `cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/StickyMobileCTA.tsx
git commit -m "feat: add strikethrough price to sticky CTA for urgency"
```

---

### Task 6: Final Build + Push + PR

**Step 1: Full build verification**

Run: `cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global && npm run build`
Expected: Build succeeds with no errors or warnings

**Step 2: Push to origin**

```bash
cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global
git push origin main
```

**Step 3: Create PR main -> production**

```bash
cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global
gh pr create --base production --head main --title "feat: landing page CRO improvements" --body "$(cat <<'EOF'
## Summary
- Add "Who Is This For" target audience section (4 personas)
- Add money-back guarantee trust badge in pricing section
- Enhance testimonial cards with prominent result badges
- Add AI platform compatibility trust strip
- Enhance sticky CTA with strikethrough pricing

## Test plan
- [ ] Verify all sections render correctly on desktop and mobile
- [ ] Verify build succeeds with no errors
- [ ] Check scroll behavior of sticky CTA
- [ ] Verify i18n routing still works (en/ko/ja)

Generated with Claude Code
EOF
)"
```

**Step 4: Report PR URL back to team lead**

# Landing Page Optimization Notes for Product Hunt Traffic

## Current Site Analysis (ai-native-playbook.com)

### Structure
The landing page follows a strong long-form sales page structure:
1. **Hero** -- Clear tagline, bundle CTA ($47), individual books link ($17)
2. **Social Proof Numbers** -- 4 metrics (500+ users, 5x revenue, 87% CPA reduction, 24h to first session)
3. **Problem/Solution** -- "Without Framework" vs "With AI Native Playbook" comparison
4. **6 Books Grid** -- Cards with icons, framework names, short descriptions, case study quotes
5. **How It Works** -- 4-step process (Download, Load prompt, Describe business, AI executes)
6. **Documented Results** -- 6 case study cards with specific numbers
7. **Bundle CTA** -- Price anchoring ($175+ source books vs $47 bundle), guarantees
8. **FAQ** -- 6 questions covering common objections

### Multi-language Support
- English (en), Korean (ko), Japanese (ja) via next-intl
- Locale-based routing: /[locale]/...
- Good for global Product Hunt audience

### SEO/Schema
- FAQPage JSON-LD
- ItemList JSON-LD (6 books)
- WebSite JSON-LD
- OG/Twitter meta tags present

---

## Optimization Recommendations for Product Hunt Traffic

### High Priority (Do Before Launch)

1. **Add ?ref=producthunt UTM tracking**
   - Product Hunt link should point to: `ai-native-playbook.com?ref=producthunt`
   - Track conversion separately from organic traffic
   - Add UTM parameters: `?utm_source=producthunt&utm_medium=referral&utm_campaign=launch`

2. **Product Hunt badge on landing page**
   - Add "Featured on Product Hunt" badge/banner during launch week
   - Position: Top of page or floating corner badge
   - Drives social proof for PH visitors + encourages upvotes from organic visitors

3. **Lemon Squeezy links must be LIVE**
   - Currently all Buy buttons link to "#" (env vars not set)
   - This is the #1 blocker -- CEO must register 7 products on Lemon Squeezy
   - Without live payment links, PH traffic converts to $0

4. **Add a Product Hunt-specific CTA section**
   - "Saw us on Product Hunt? Here's a special launch week offer"
   - Consider 20% launch discount code for PH visitors
   - Time-limited (72 hours from launch)

### Medium Priority (Nice to Have)

5. **Speed optimization**
   - Verify Lighthouse score (target: 90+ Performance)
   - Hero section should load instantly -- no layout shift
   - Lazy load below-fold sections

6. **Social proof enhancement**
   - Add logos/avatars if any recognizable brands or people have used the product
   - "As seen on" or "Used by entrepreneurs from" section
   - Even 2-3 testimonial quotes with names would help

7. **Exit intent popup**
   - For PH visitors who are about to leave
   - Offer: Free sample chapter or one framework preview
   - Captures email for follow-up

8. **Email capture for non-buyers**
   - Not everyone will buy on first visit
   - Add newsletter signup or free sample download
   - Currently no email capture mechanism on landing page

### Low Priority (Post-Launch)

9. **Video/GIF demo**
   - Show the actual AI interaction: prompt -> business description -> tailored strategy
   - Most compelling proof that the product works
   - Embed on landing page or link to YouTube

10. **Comparison table**
    - "AI Architect vs. Hiring a Consultant vs. DIY"
    - Price anchoring against $2,000-$10,000 consulting

11. **Blog content for PH long-tail traffic**
    - Blog pages exist at /[locale]/blog
    - Publish 2-3 articles before launch targeting:
      - "How to use AI for business strategy"
      - "Best AI tools for entrepreneurs 2026"
      - "Russell Brunson frameworks with AI"

---

## Key Metrics to Track Post-Launch

| Metric | Target |
|--------|--------|
| Product Hunt upvotes | 200+ (for top 5 of the day) |
| Landing page visits from PH | 1,000+ on launch day |
| Bundle conversion rate | 3-5% |
| Individual book conversion | 1-2% |
| Email signups (if added) | 10% of visitors |
| Revenue on launch day | $500-$2,000 |

## Critical Blocker Summary
**Payment links are not functional.** All Lemon Squeezy product URLs are set to "#" because env vars are not configured. CEO must complete product registration on Lemon Squeezy before any launch activity.

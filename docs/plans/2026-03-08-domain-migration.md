# Domain Migration: ai-driven-architect.com → ai-native-playbook.com

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete domain migration by updating Vercel env vars, adding 301 redirects, and deploying via git push.

**Architecture:** Vercel env var update via CLI + vercel.json redirect rules for old domain → new domain. All paths preserved with 301 permanent redirect.

**Tech Stack:** Vercel CLI, Next.js, vercel.json redirects

---

### Task 1: Update Vercel Environment Variables

**Step 1: Remove old NEXT_PUBLIC_SITE_URL from all environments**

```bash
cd "/Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global"
vercel env rm NEXT_PUBLIC_SITE_URL production -y
vercel env rm NEXT_PUBLIC_SITE_URL preview -y
vercel env rm NEXT_PUBLIC_SITE_URL development -y
```

Note: Some may not exist — that's OK, ignore errors.

**Step 2: Add new NEXT_PUBLIC_SITE_URL to all environments**

```bash
echo "https://ai-native-playbook.com" | vercel env add NEXT_PUBLIC_SITE_URL production
echo "https://ai-native-playbook.com" | vercel env add NEXT_PUBLIC_SITE_URL preview
echo "https://ai-native-playbook.com" | vercel env add NEXT_PUBLIC_SITE_URL development
```

**Step 3: Verify**

```bash
vercel env ls
```

Expected: NEXT_PUBLIC_SITE_URL = https://ai-native-playbook.com for production, preview, development.

---

### Task 2: Add 301 Redirects in vercel.json

**File:** `vercel.json`

Add redirects array for ai-driven-architect.com → ai-native-playbook.com.
Vercel supports `has` condition with host header matching for domain-based redirects.

```json
{
  "redirects": [
    {
      "source": "/:path(.*)",
      "has": [
        {
          "type": "host",
          "value": "ai-driven-architect.com"
        }
      ],
      "destination": "https://ai-native-playbook.com/:path",
      "permanent": true
    },
    {
      "source": "/:path(.*)",
      "has": [
        {
          "type": "host",
          "value": "www.ai-driven-architect.com"
        }
      ],
      "destination": "https://ai-native-playbook.com/:path",
      "permanent": true
    }
  ]
}
```

**Step 1:** Edit vercel.json to add redirects array (merge with existing config).

**Step 2:** Verify JSON is valid: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"`

---

### Task 3: Build Verification

**Step 1: Install dependencies**

```bash
cd "/Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global"
npm install
```

**Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

---

### Task 4: Git Commit + Push + Staging PR

**Step 1: Commit changes**

```bash
git add vercel.json
git commit -m "feat: add 301 redirects ai-driven-architect.com → ai-native-playbook.com"
```

**Step 2: Push to main**

```bash
git pull --rebase origin main
git push origin main
```

**Step 3: Create main → staging PR**

```bash
gh pr create --base staging --head main --title "Domain migration: 301 redirects + env var update" --body "## Summary
- Add 301 permanent redirects from ai-driven-architect.com to ai-native-playbook.com (vercel.json)
- Vercel env NEXT_PUBLIC_SITE_URL updated to https://ai-native-playbook.com (all environments)
- All source code references already updated in previous session (c794cd7)

## Test plan
- [ ] Verify build succeeds on staging
- [ ] Verify ai-driven-architect.com/* returns 301 → ai-native-playbook.com/*
- [ ] Verify ai-native-playbook.com loads correctly
- [ ] Verify SSL certificate active on new domain"
```

---

### Task 5: Update Documentation

**Files:**
- `.claude/knowledge/context.md`
- `CLAUDE.md`

Update domain references to reflect migration completion.

---

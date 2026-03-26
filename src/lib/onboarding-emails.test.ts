import { describe, it, expect } from 'vitest';
import {
  getOnboardingWelcomeHtml,
  getOnboardingTipsHtml,
  getOnboardingCaseStudyHtml,
  getOnboardingBundlePreviewHtml,
  getOnboardingCtaHtml,
} from './onboarding-emails';

describe('onboarding email templates', () => {
  it('D+0 Welcome contains greeting and subscriber benefits', () => {
    const html = getOnboardingWelcomeHtml({ firstName: 'Alex' });
    expect(html).toContain('Hi Alex,');
    expect(html).toContain('AI Native Playbook');
    expect(html).toContain('Welcome');
  });

  it('D+0 Welcome works without firstName', () => {
    const html = getOnboardingWelcomeHtml({});
    expect(html).toContain('Hi there,');
    expect(html).not.toContain('undefined');
  });

  it('D+1 Tips contains actionable advice', () => {
    const html = getOnboardingTipsHtml({ firstName: 'Alex' });
    expect(html).toContain('Day 1');
    expect(html).toContain('Hi Alex,');
    expect(html).toContain('framework');
  });

  it('D+3 Case Study contains stats and story', () => {
    const html = getOnboardingCaseStudyHtml({ firstName: 'Alex' });
    expect(html).toContain('Day 3');
    expect(html).toContain('3.2x increase');
    expect(html).toContain('/en/pricing');
  });

  it('D+5 Bundle Preview contains pricing and product list', () => {
    const html = getOnboardingBundlePreviewHtml({ firstName: 'Alex' });
    expect(html).toContain('Day 5');
    expect(html).toContain('Hi Alex,');
    expect(html).toContain('Bundle');
    expect(html).toContain('54%');
    expect(html).toContain('/en/bundle');
  });

  it('D+7 CTA contains bundle offer', () => {
    const html = getOnboardingCtaHtml({ firstName: 'Alex' });
    expect(html).toContain('Day 7');
    expect(html).toContain('Bundle');
  });

  it('all templates include unsubscribe link', () => {
    const templates = [
      getOnboardingWelcomeHtml({}),
      getOnboardingTipsHtml({}),
      getOnboardingCaseStudyHtml({}),
      getOnboardingBundlePreviewHtml({}),
      getOnboardingCtaHtml({}),
    ];
    for (const html of templates) {
      expect(html).toContain('unsubscribe');
    }
  });

  it('all templates use Navy brand color #0B1426', () => {
    const templates = [
      getOnboardingWelcomeHtml({}),
      getOnboardingTipsHtml({}),
      getOnboardingCaseStudyHtml({}),
      getOnboardingBundlePreviewHtml({}),
      getOnboardingCtaHtml({}),
    ];
    for (const html of templates) {
      expect(html).toContain('#0B1426');
    }
  });
});

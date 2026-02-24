import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-bold text-lg mb-3">
              <span className="gradient-gold">AI Architect</span>
              <span className="text-text-secondary text-sm font-normal ml-1.5">Series</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Six world-class business frameworks. Fully automated with AI. One price.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-3 text-sm">Books</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/products/ai-marketing-architect" className="hover:text-gold transition-colors">AI Marketing Architect</Link></li>
              <li><Link href="/products/ai-brand-architect" className="hover:text-gold transition-colors">AI Brand Architect</Link></li>
              <li><Link href="/products/ai-traffic-architect" className="hover:text-gold transition-colors">AI Traffic Architect</Link></li>
              <li><Link href="/products/ai-story-architect" className="hover:text-gold transition-colors">AI Story Architect</Link></li>
              <li><Link href="/products/ai-startup-architect" className="hover:text-gold transition-colors">AI Startup Architect</Link></li>
              <li><Link href="/products/ai-content-architect" className="hover:text-gold transition-colors">AI Content Architect</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-3 text-sm">Info</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/bundle" className="hover:text-gold transition-colors">Complete Bundle — $47</Link></li>
              <li><Link href="/products" className="hover:text-gold transition-colors">Individual Books — $17 each</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} AI Architect Series. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              7-day money-back guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Instant PDF download
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

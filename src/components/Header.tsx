import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          <span className="gradient-gold">AI Architect</span>
          <span className="text-text-secondary text-sm font-normal ml-1.5">Series</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          <Link href="/products" className="hover:text-text-primary transition-colors">
            All Books
          </Link>
          <Link href="/bundle" className="hover:text-text-primary transition-colors">
            Bundle
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors">
            About
          </Link>
        </nav>

        <Link
          href="/bundle"
          className="bg-gold text-navy-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-gold-light transition-colors"
        >
          Get Bundle — $47
        </Link>
      </div>
    </header>
  );
}

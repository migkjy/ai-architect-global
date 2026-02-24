"use client";

type BuyButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
};

export default function BuyButton({
  href,
  children,
  className = "",
  variant = "primary",
}: BuyButtonProps) {
  const base =
    variant === "primary"
      ? "bg-gold text-navy-dark hover:bg-gold-light shadow-lg shadow-gold/20"
      : "bg-surface border border-gold/30 text-gold hover:border-gold/60";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${base} ${className}`}
    >
      {children}
    </a>
  );
}

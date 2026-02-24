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

  const isDisabled = href === "#" || !href;

  return (
    <a
      href={isDisabled ? undefined : href}
      target={isDisabled ? undefined : "_blank"}
      rel={isDisabled ? undefined : "noopener noreferrer"}
      aria-disabled={isDisabled}
      className={`inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${base} ${className} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </a>
  );
}

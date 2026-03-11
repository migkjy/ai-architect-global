"use client";

type CtaButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  label?: string;
  "data-testid"?: string;
};

export default function CtaButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  label,
  "data-testid": testId,
}: CtaButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 cursor-pointer text-center";

  const variantClasses = {
    primary:
      "bg-gold text-navy-dark hover:bg-gold-light shadow-lg shadow-gold/20",
    secondary:
      "bg-surface border-2 border-gold/30 text-gold hover:border-gold/60 hover:bg-gold/5",
    outline:
      "bg-transparent border border-white/20 text-text-primary hover:border-gold/40 hover:text-gold",
  };

  function handleClick() {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: label ?? String(children),
        cta_variant: variant,
      });
    }
    onClick?.();
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={classes}
        data-testid={testId}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={classes} data-testid={testId}>
      {children}
    </button>
  );
}

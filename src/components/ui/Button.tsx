import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "champagne";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-charcoal text-ivory hover:bg-charcoal-soft focus-visible:ring-champagne",
  secondary:
    "border border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory focus-visible:ring-champagne",
  ghost:
    "bg-transparent text-charcoal hover:text-champagne-deep focus-visible:ring-champagne",
  champagne:
    "bg-champagne text-charcoal hover:bg-champagne-soft focus-visible:ring-charcoal",
};

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & { href: string; target?: string; rel?: string };

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

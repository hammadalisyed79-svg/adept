type Variant = "growth" | "erp" | "website" | "marketing" | "ai";

const labels: Record<Variant, string> = {
  growth: "Technology & Growth",
  erp: "Operational systems",
  website: "Digital presence",
  marketing: "Brand & channels",
  ai: "AI support & chatbots",
};

/**
 * Presentation-ready CSS compositions for Technology & Growth.
 * Designed to fully fit inside short card frames (homepage) and taller heroes.
 * ADEPT ivory / charcoal / champagne only; no client logos or metrics.
 */
export function TechnologyVisual({
  variant,
  className = "",
  aspectClassName = "aspect-[4/3]",
  /** When true, hide from assistive tech (parent link/card already named). */
  decorative = false,
}: {
  variant: Variant;
  className?: string;
  aspectClassName?: string;
  decorative?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-charcoal/10 bg-gradient-to-br from-ivory via-ivory-soft to-[#E2DACF] ${aspectClassName} ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : labels[variant]}
      aria-hidden={decorative || undefined}
      data-tech-visual={variant}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-champagne/30 blur-2xl" />
        <div className="absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-charcoal/10 blur-2xl" />
      </div>
      {/* Contain compositions — never clip chrome or devices */}
      <div className="relative box-border flex h-full w-full items-center justify-center p-3 sm:p-4 md:p-5">
        <div className="flex max-h-full w-full max-w-[18.5rem] items-center justify-center">
          {variant === "growth" && <GrowthComposition />}
          {variant === "erp" && <ErpComposition />}
          {variant === "website" && <WebsiteComposition />}
          {variant === "marketing" && <MarketingComposition />}
          {variant === "ai" && <AiComposition />}
        </div>
      </div>
    </div>
  );
}

function GrowthComposition() {
  return (
    <div className="grid w-full grid-cols-3 gap-1.5 sm:gap-2">
      <div className="space-y-1.5 rounded-sm border border-charcoal/10 bg-white/90 p-2 shadow-sm">
        <div className="h-1 w-6 rounded-full bg-champagne" />
        <div className="aspect-[4/3] rounded-sm bg-charcoal/10" />
        <div className="h-1 w-full rounded-full bg-charcoal/10" />
        <div className="h-1 w-2/3 rounded-full bg-charcoal/10" />
      </div>
      <div className="space-y-1.5 rounded-sm border border-charcoal/10 bg-white p-2 shadow-sm">
        <div className="flex gap-1">
          <span className="h-1 w-1 rounded-full bg-champagne" />
          <span className="h-1 w-1 rounded-full bg-charcoal/20" />
          <span className="h-1 w-1 rounded-full bg-charcoal/20" />
        </div>
        <div className="aspect-[4/3] rounded-sm bg-gradient-to-b from-ivory to-champagne/25" />
        <div className="h-4 rounded-sm bg-charcoal" />
      </div>
      <div className="space-y-1.5 rounded-sm border border-charcoal/10 bg-charcoal p-2 shadow-sm">
        <div className="h-1 w-8 rounded-full bg-champagne/70" />
        <div className="mt-1 flex aspect-[4/3] items-end gap-1">
          <div className="h-[45%] w-full rounded-sm bg-ivory/20" />
          <div className="h-[75%] w-full rounded-sm bg-champagne/50" />
          <div className="h-[35%] w-full rounded-sm bg-ivory/15" />
        </div>
      </div>
    </div>
  );
}

/** Compact ERP console — fixed aspect so header/nav never clip. */
function ErpComposition() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-sm border border-charcoal/12 bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-charcoal/8 bg-charcoal px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
          <span className="h-1 w-12 rounded-full bg-ivory/35" />
        </div>
        <div className="flex gap-1">
          <span className="h-1 w-6 rounded-full bg-ivory/20" />
          <span className="h-1 w-5 rounded-full bg-champagne/60" />
        </div>
      </div>
      <div className="flex">
        <div className="flex w-[22%] flex-col gap-1.5 border-r border-charcoal/8 bg-ivory px-1.5 py-2">
          <div className="h-1 w-full rounded-full bg-champagne" />
          <div className="h-1 w-4/5 rounded-full bg-charcoal/15" />
          <div className="h-1 w-3/5 rounded-full bg-charcoal/12" />
          <div className="mt-2 h-1 w-full rounded-full bg-charcoal/10" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-sm border border-charcoal/8 bg-ivory p-1.5"
              >
                <div
                  className={`h-1 w-4 rounded-full ${i === 0 ? "bg-champagne" : "bg-charcoal/20"}`}
                />
                <div className="mt-1.5 h-3 rounded-sm bg-charcoal/10" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1 rounded-sm border border-charcoal/8 bg-ivory-soft/80 p-1.5">
            {[70, 52, 85].map((w, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="h-1 w-1 shrink-0 rounded-full bg-champagne/70" />
                <div
                  className="h-1 rounded-full bg-charcoal/12"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Desktop + phone — both fully inside the frame. */
function WebsiteComposition() {
  return (
    <div className="relative flex w-full items-end justify-center gap-2">
      <div className="flex w-[70%] flex-col overflow-hidden rounded-sm border border-charcoal/12 bg-white shadow-sm">
        <div className="flex shrink-0 items-center gap-1 border-b border-charcoal/8 bg-charcoal px-2 py-1.5">
          <span className="h-1 w-1 rounded-full bg-champagne" />
          <span className="h-1 w-1 rounded-full bg-ivory/35" />
          <span className="h-1 w-1 rounded-full bg-ivory/35" />
          <div className="ml-1.5 h-1 flex-1 rounded-full bg-ivory/15" />
        </div>
        <div className="grid gap-1.5 p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="h-1.5 w-10 rounded-full bg-charcoal/25" />
            <div className="h-4 w-12 rounded-sm bg-champagne" />
          </div>
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-1.5">
            <div className="space-y-1 py-0.5">
              <div className="h-2 w-4/5 rounded-full bg-charcoal/20" />
              <div className="h-1 w-full rounded-full bg-charcoal/10" />
              <div className="h-1 w-5/6 rounded-full bg-charcoal/10" />
              <div className="mt-1.5 h-4 w-14 rounded-sm bg-charcoal" />
            </div>
            <div className="min-h-[2.75rem] rounded-sm bg-gradient-to-br from-ivory via-champagne/20 to-champagne/40" />
          </div>
        </div>
      </div>
      <div className="mb-0.5 flex w-[24%] flex-col overflow-hidden rounded-[0.55rem] border-[1.5px] border-charcoal/20 bg-white shadow-md">
        <div className="h-2 shrink-0 bg-charcoal" />
        <div className="flex flex-col gap-1 p-1">
          <div className="aspect-[4/3] rounded-sm bg-gradient-to-b from-ivory to-champagne/30" />
          <div className="h-0.5 w-full rounded-full bg-charcoal/12" />
          <div className="h-0.5 w-4/5 rounded-full bg-charcoal/10" />
          <div className="mt-0.5 h-3 rounded-sm bg-champagne/80" />
        </div>
      </div>
    </div>
  );
}

/** Brand board — compact hero + channel tiles. */
function MarketingComposition() {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="relative overflow-hidden rounded-sm border border-charcoal/12 bg-charcoal shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal via-charcoal to-champagne/25" />
        <div className="relative flex flex-col justify-end gap-1.5 p-2.5 pt-8">
          <div className="h-1 w-9 rounded-full bg-champagne" />
          <div className="h-1.5 w-3/5 rounded-full bg-ivory/50" />
          <div className="h-1 w-2/5 rounded-full bg-ivory/25" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="flex flex-col items-center justify-between rounded-sm border border-charcoal/10 bg-white p-1.5 shadow-sm">
          <div className="mt-0.5 h-6 w-6 rounded-full border-[2.5px] border-champagne/55 border-r-charcoal/25" />
          <div className="mt-1 h-0.5 w-full rounded-full bg-charcoal/10" />
        </div>
        <div className="flex flex-col gap-1 rounded-sm border border-charcoal/10 bg-white p-1.5 shadow-sm">
          <div className="h-0.5 w-6 rounded-full bg-champagne/80" />
          <div className="h-4 rounded-sm bg-ivory" />
          <div className="h-0.5 w-full rounded-full bg-charcoal/10" />
        </div>
        <div className="flex flex-col gap-1 rounded-sm border border-charcoal/10 bg-white p-1.5 shadow-sm">
          <div className="flex gap-0.5">
            <div className="h-4 flex-1 rounded-sm bg-champagne/40" />
            <div className="h-4 flex-1 rounded-sm bg-charcoal/10" />
          </div>
          <div className="h-0.5 w-3/4 rounded-full bg-charcoal/10" />
        </div>
      </div>
    </div>
  );
}

/** Chat transcript — header, bubbles, and composer all inside frame. */
function AiComposition() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-sm border border-charcoal/12 bg-white shadow-sm">
      <div className="flex shrink-0 items-center gap-2 border-b border-charcoal/8 bg-ivory px-2.5 py-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-charcoal text-[8px] font-medium tracking-wide text-champagne"
          aria-hidden
        >
          AI
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="h-1 w-16 rounded-full bg-charcoal/20" />
          <div className="h-0.5 w-10 rounded-full bg-champagne/70" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 px-2.5 py-2">
        <div className="max-w-[85%] self-start rounded-sm rounded-tl-none bg-ivory px-2 py-1.5">
          <div className="h-1 w-24 rounded-full bg-charcoal/15" />
          <div className="mt-1 h-1 w-16 rounded-full bg-charcoal/10" />
        </div>
        <div className="max-w-[72%] self-end rounded-sm rounded-tr-none bg-champagne/45 px-2 py-1.5">
          <div className="h-1 w-20 rounded-full bg-charcoal/25" />
        </div>
        <div className="max-w-[80%] self-start rounded-sm rounded-tl-none bg-ivory px-2 py-1.5">
          <div className="h-1 w-28 rounded-full bg-charcoal/15" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 border-t border-charcoal/8 bg-charcoal px-2 py-1.5">
        <div className="h-1 flex-1 rounded-full bg-ivory/25" />
        <div className="h-5 w-5 shrink-0 rounded-sm bg-champagne" />
      </div>
    </div>
  );
}

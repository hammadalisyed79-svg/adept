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
 * Fully contained within the frame — no clipped devices or labels.
 * ADEPT ivory / charcoal / champagne only; no client logos or metrics.
 */
export function TechnologyVisual({
  variant,
  className = "",
  aspectClassName = "aspect-[4/3]",
}: {
  variant: Variant;
  className?: string;
  aspectClassName?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-charcoal/10 bg-gradient-to-br from-ivory via-ivory-soft to-[#E2DACF] ${aspectClassName} ${className}`}
      role="img"
      aria-label={labels[variant]}
      data-tech-visual={variant}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-champagne/30 blur-2xl" />
        <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-charcoal/10 blur-2xl" />
      </div>
      <div className="relative flex h-full items-center justify-center p-5 md:p-7">
        {variant === "growth" && <GrowthComposition />}
        {variant === "erp" && <ErpComposition />}
        {variant === "website" && <WebsiteComposition />}
        {variant === "marketing" && <MarketingComposition />}
        {variant === "ai" && <AiComposition />}
      </div>
    </div>
  );
}

function GrowthComposition() {
  return (
    <div className="grid w-full max-w-sm grid-cols-3 gap-2.5">
      <div className="space-y-2 rounded-sm border border-charcoal/10 bg-white/85 p-2.5 shadow-sm">
        <div className="h-1.5 w-8 rounded-full bg-champagne" />
        <div className="h-12 rounded-sm bg-charcoal/10" />
        <div className="h-1.5 w-full rounded-full bg-charcoal/10" />
        <div className="h-1.5 w-3/4 rounded-full bg-charcoal/10" />
      </div>
      <div className="space-y-2 rounded-sm border border-charcoal/10 bg-white p-2.5 shadow-sm">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
          <span className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
        </div>
        <div className="h-14 rounded-sm bg-gradient-to-b from-ivory to-champagne/25" />
        <div className="h-5 rounded-sm bg-charcoal" />
      </div>
      <div className="space-y-2 rounded-sm border border-charcoal/10 bg-charcoal p-2.5 shadow-sm">
        <div className="h-1.5 w-10 rounded-full bg-champagne/70" />
        <div className="mt-2 flex h-14 items-end gap-1">
          <div className="h-7 w-full rounded-sm bg-ivory/20" />
          <div className="h-11 w-full rounded-sm bg-champagne/50" />
          <div className="h-5 w-full rounded-sm bg-ivory/15" />
        </div>
      </div>
    </div>
  );
}

/** Clear business-operations interface: nav rail + KPI tiles + activity rows. */
function ErpComposition() {
  return (
    <div className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-sm border border-charcoal/12 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-charcoal/8 bg-charcoal px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-champagne" />
          <span className="h-1.5 w-16 rounded-full bg-ivory/35" />
        </div>
        <div className="flex gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-ivory/20" />
          <span className="h-1.5 w-6 rounded-full bg-champagne/60" />
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex w-[22%] flex-col gap-2 border-r border-charcoal/8 bg-ivory px-2 py-3">
          <div className="h-1.5 w-full rounded-full bg-champagne" />
          <div className="h-1.5 w-4/5 rounded-full bg-charcoal/15" />
          <div className="h-1.5 w-3/5 rounded-full bg-charcoal/12" />
          <div className="mt-auto h-1.5 w-full rounded-full bg-charcoal/10" />
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-3">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-sm border border-charcoal/8 bg-ivory p-2"
              >
                <div
                  className={`h-1 w-6 rounded-full ${i === 0 ? "bg-champagne" : "bg-charcoal/20"}`}
                />
                <div className="mt-2 h-5 rounded-sm bg-charcoal/10" />
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col justify-end gap-1.5 rounded-sm border border-charcoal/8 bg-ivory-soft/80 p-2">
            {[72, 55, 88, 40].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-champagne/70" />
                <div
                  className="h-1.5 rounded-full bg-charcoal/12"
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

/** Premium desktop browser + fully contained mobile preview. */
function WebsiteComposition() {
  return (
    <div className="relative flex h-full w-full max-w-md items-end justify-center gap-3 pb-1">
      <div className="flex h-[92%] w-[68%] flex-col overflow-hidden rounded-sm border border-charcoal/12 bg-white shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-charcoal/8 bg-charcoal px-2.5 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
          <span className="h-1.5 w-1.5 rounded-full bg-ivory/35" />
          <span className="h-1.5 w-1.5 rounded-full bg-ivory/35" />
          <div className="ml-2 h-1.5 flex-1 rounded-full bg-ivory/15" />
        </div>
        <div className="grid flex-1 grid-rows-[auto_1fr] gap-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="h-2 w-14 rounded-full bg-charcoal/25" />
            <div className="h-5 w-16 rounded-sm bg-champagne" />
          </div>
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2">
            <div className="flex flex-col justify-center space-y-1.5">
              <div className="h-2.5 w-4/5 rounded-full bg-charcoal/20" />
              <div className="h-1.5 w-full rounded-full bg-charcoal/10" />
              <div className="h-1.5 w-5/6 rounded-full bg-charcoal/10" />
              <div className="mt-2 h-6 w-20 rounded-sm bg-charcoal" />
            </div>
            <div className="rounded-sm bg-gradient-to-br from-ivory via-champagne/20 to-champagne/40" />
          </div>
        </div>
      </div>
      <div className="flex h-[78%] w-[26%] flex-col overflow-hidden rounded-[0.65rem] border-[2px] border-charcoal/20 bg-white shadow-md">
        <div className="h-2.5 shrink-0 bg-charcoal" />
        <div className="flex flex-1 flex-col gap-1.5 p-1.5">
          <div className="h-8 rounded-sm bg-gradient-to-b from-ivory to-champagne/30" />
          <div className="h-1 w-full rounded-full bg-charcoal/12" />
          <div className="h-1 w-4/5 rounded-full bg-charcoal/10" />
          <div className="mt-auto h-4 rounded-sm bg-champagne/80" />
        </div>
      </div>
    </div>
  );
}

/** Coherent brand campaign board: hero panel + channel tiles. */
function MarketingComposition() {
  return (
    <div className="flex h-full w-full max-w-md flex-col gap-2.5">
      <div className="relative flex flex-[1.35] overflow-hidden rounded-sm border border-charcoal/12 bg-charcoal shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal via-charcoal to-champagne/25" />
        <div className="relative flex w-full flex-col justify-end gap-2 p-3">
          <div className="h-1.5 w-12 rounded-full bg-champagne" />
          <div className="h-2 w-3/5 rounded-full bg-ivory/50" />
          <div className="h-1.5 w-2/5 rounded-full bg-ivory/25" />
        </div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        <div className="flex flex-col justify-between rounded-sm border border-charcoal/10 bg-white p-2 shadow-sm">
          <div className="mx-auto mt-1 h-8 w-8 rounded-full border-[3px] border-champagne/55 border-r-charcoal/25" />
          <div className="mt-2 h-1 w-full rounded-full bg-charcoal/10" />
        </div>
        <div className="flex flex-col gap-1.5 rounded-sm border border-charcoal/10 bg-white p-2 shadow-sm">
          <div className="h-1 w-8 rounded-full bg-champagne/80" />
          <div className="h-6 rounded-sm bg-ivory" />
          <div className="h-1 w-full rounded-full bg-charcoal/10" />
        </div>
        <div className="flex flex-col gap-1.5 rounded-sm border border-charcoal/10 bg-white p-2 shadow-sm">
          <div className="flex gap-1">
            <div className="h-5 flex-1 rounded-sm bg-champagne/40" />
            <div className="h-5 flex-1 rounded-sm bg-charcoal/10" />
          </div>
          <div className="h-1 w-3/4 rounded-full bg-charcoal/10" />
        </div>
      </div>
    </div>
  );
}

/** Clear customer-support conversation — fully inside the frame. */
function AiComposition() {
  return (
    <div className="flex h-full w-full max-w-sm flex-col overflow-hidden rounded-sm border border-charcoal/12 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-charcoal/8 bg-ivory px-3 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal text-[9px] font-medium tracking-wide text-champagne">
          AI
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="h-1.5 w-20 rounded-full bg-charcoal/20" />
          <div className="h-1 w-12 rounded-full bg-champagne/70" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 p-3">
        <div className="max-w-[82%] self-start rounded-sm rounded-tl-none bg-ivory px-2.5 py-2">
          <div className="h-1.5 w-28 rounded-full bg-charcoal/15" />
          <div className="mt-1.5 h-1.5 w-20 rounded-full bg-charcoal/10" />
        </div>
        <div className="max-w-[70%] self-end rounded-sm rounded-tr-none bg-champagne/45 px-2.5 py-2">
          <div className="h-1.5 w-24 rounded-full bg-charcoal/25" />
        </div>
        <div className="max-w-[78%] self-start rounded-sm rounded-tl-none bg-ivory px-2.5 py-2">
          <div className="h-1.5 w-32 rounded-full bg-charcoal/15" />
          <div className="mt-1.5 h-1.5 w-16 rounded-full bg-charcoal/10" />
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-charcoal/8 bg-charcoal px-2.5 py-2">
        <div className="h-1.5 flex-1 rounded-full bg-ivory/25" />
        <div className="h-6 w-6 shrink-0 rounded-sm bg-champagne" />
      </div>
    </div>
  );
}

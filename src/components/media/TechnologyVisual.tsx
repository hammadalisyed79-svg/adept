type Variant = "growth" | "erp" | "website" | "marketing";

const labels: Record<Variant, string> = {
  growth: "Technology & Growth",
  erp: "Operational systems",
  website: "Digital presence",
  marketing: "Brand & channels",
};

/**
 * Presentation-ready CSS compositions for Technology & Growth.
 * Avoids next/image SVG fill failures; no client data depicted.
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
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-champagne/30 blur-2xl" />
        <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-charcoal/10 blur-2xl" />
      </div>
      <div className="relative flex h-full items-center justify-center p-6 md:p-8">
        {variant === "growth" && <GrowthComposition />}
        {variant === "erp" && <ErpComposition />}
        {variant === "website" && <WebsiteComposition />}
        {variant === "marketing" && <MarketingComposition />}
      </div>
      <p className="absolute bottom-3 left-4 text-[10px] uppercase tracking-wideish text-charcoal/35 md:bottom-4 md:left-5">
        {labels[variant]}
      </p>
    </div>
  );
}

function GrowthComposition() {
  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-3">
      <div className="col-span-1 space-y-2 rounded-sm border border-charcoal/10 bg-white/80 p-3 shadow-sm">
        <div className="h-2 w-10 rounded-full bg-champagne" />
        <div className="h-16 rounded-sm bg-charcoal/10" />
        <div className="h-2 w-full rounded-full bg-charcoal/10" />
        <div className="h-2 w-3/4 rounded-full bg-charcoal/10" />
      </div>
      <div className="col-span-1 space-y-2 rounded-sm border border-charcoal/10 bg-white/90 p-3 shadow-sm">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-champagne" />
          <span className="h-2 w-2 rounded-full bg-charcoal/20" />
          <span className="h-2 w-2 rounded-full bg-charcoal/20" />
        </div>
        <div className="h-20 rounded-sm bg-gradient-to-b from-ivory to-champagne/20" />
        <div className="h-6 rounded-sm bg-charcoal" />
      </div>
      <div className="col-span-1 space-y-2 rounded-sm border border-charcoal/10 bg-charcoal p-3 shadow-sm">
        <div className="h-2 w-12 rounded-full bg-champagne/70" />
        <div className="mt-3 flex h-16 items-end gap-1">
          <div className="h-8 w-full rounded-sm bg-ivory/20" />
          <div className="h-12 w-full rounded-sm bg-champagne/50" />
          <div className="h-6 w-full rounded-sm bg-ivory/15" />
        </div>
      </div>
    </div>
  );
}

function ErpComposition() {
  return (
    <div className="flex w-full max-w-lg overflow-hidden rounded-sm border border-charcoal/10 bg-white shadow-sm">
      <div className="w-1/4 space-y-3 bg-charcoal p-4">
        <div className="h-2 w-12 rounded-full bg-champagne" />
        <div className="h-1.5 w-full rounded-full bg-ivory/20" />
        <div className="h-1.5 w-4/5 rounded-full bg-ivory/15" />
        <div className="h-1.5 w-3/5 rounded-full bg-ivory/15" />
        <div className="mt-4 h-1.5 w-full rounded-full bg-champagne/40" />
        <div className="h-1.5 w-2/3 rounded-full bg-ivory/15" />
      </div>
      <div className="flex-1 space-y-3 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-sm border border-charcoal/8 bg-ivory p-3">
            <div className="h-1.5 w-10 rounded-full bg-champagne" />
            <div className="mt-3 h-8 rounded-sm bg-charcoal/10" />
          </div>
          <div className="rounded-sm border border-charcoal/8 bg-ivory p-3">
            <div className="h-1.5 w-10 rounded-full bg-charcoal/25" />
            <div className="mt-3 h-8 rounded-sm bg-charcoal/10" />
          </div>
        </div>
        <div className="rounded-sm border border-charcoal/8 bg-ivory-soft p-3">
          <div className="mb-3 flex items-end gap-2">
            <div className="h-10 w-6 rounded-sm bg-champagne/45" />
            <div className="h-14 w-6 rounded-sm bg-charcoal/20" />
            <div className="h-8 w-6 rounded-sm bg-champagne/30" />
            <div className="h-16 w-6 rounded-sm bg-charcoal/15" />
            <div className="h-12 w-6 rounded-sm bg-champagne/50" />
          </div>
          <div className="h-1.5 w-full rounded-full bg-charcoal/10" />
        </div>
      </div>
    </div>
  );
}

function WebsiteComposition() {
  return (
    <div className="relative w-full max-w-lg">
      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-charcoal/8 bg-charcoal px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-champagne" />
          <span className="h-2 w-2 rounded-full bg-ivory/30" />
          <span className="h-2 w-2 rounded-full bg-ivory/30" />
          <div className="ml-3 h-2 flex-1 rounded-full bg-ivory/15" />
        </div>
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-3 p-4">
          <div className="space-y-2">
            <div className="h-3 w-2/3 rounded-full bg-charcoal/20" />
            <div className="h-2 w-full rounded-full bg-charcoal/10" />
            <div className="h-2 w-5/6 rounded-full bg-charcoal/10" />
            <div className="mt-3 h-7 w-24 rounded-sm bg-champagne" />
          </div>
          <div className="rounded-sm bg-gradient-to-br from-ivory to-champagne/25" />
        </div>
      </div>
      <div className="absolute -bottom-2 -right-1 w-[28%] overflow-hidden rounded-md border border-charcoal/15 bg-white shadow-md">
        <div className="h-3 bg-charcoal" />
        <div className="space-y-1.5 p-2">
          <div className="h-8 rounded-sm bg-ivory" />
          <div className="h-1.5 w-full rounded-full bg-charcoal/10" />
          <div className="h-1.5 w-3/4 rounded-full bg-charcoal/10" />
        </div>
      </div>
    </div>
  );
}

function MarketingComposition() {
  return (
    <div className="grid w-full max-w-md grid-cols-[0.9fr_1.1fr] gap-3">
      <div className="flex flex-col justify-between rounded-sm border border-charcoal/10 bg-white p-4 shadow-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-champagne/50 border-r-charcoal/20" />
        <div className="mt-4 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-charcoal/10" />
          <div className="h-1.5 w-2/3 rounded-full bg-charcoal/10" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-sm bg-charcoal p-4 shadow-sm">
          <div className="h-2 w-16 rounded-full bg-champagne/70" />
          <div className="mt-3 h-2 w-full rounded-full bg-ivory/20" />
          <div className="mt-2 h-2 w-3/4 rounded-full bg-ivory/15" />
        </div>
        <div className="rounded-sm border border-charcoal/10 bg-white p-4 shadow-sm">
          <div className="h-2 w-14 rounded-full bg-charcoal/25" />
          <div className="mt-3 flex gap-2">
            <div className="h-10 flex-1 rounded-sm bg-champagne/35" />
            <div className="h-10 flex-1 rounded-sm bg-charcoal/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

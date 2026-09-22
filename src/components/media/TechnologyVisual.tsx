type Variant = "growth" | "erp" | "website" | "marketing" | "ai";
type Tone = "light" | "dark";

const labels: Record<Variant, string> = {
  growth: "Technology & Growth interface preview",
  erp: "ERP operations interface preview",
  website: "Website layout interface preview",
  marketing: "Marketing channels interface preview",
  ai: "AI chatbot interface preview",
};

/**
 * Intentional CSS interface previews for Technology & Growth.
 * Used until approved ADEPT photography is available — not empty placeholders.
 * ADEPT ivory / charcoal / champagne only; no client logos or metrics.
 */
export function TechnologyVisual({
  variant,
  className = "",
  aspectClassName = "aspect-[4/3]",
  tone = "light",
  /** When true, hide from assistive tech (parent link/card already named). */
  decorative = false,
  showCaption,
}: {
  variant: Variant;
  className?: string;
  aspectClassName?: string;
  tone?: Tone;
  decorative?: boolean;
  /** Defaults to true for named visuals; hidden on decorative card thumbs. */
  showCaption?: boolean;
}) {
  const shell =
    tone === "dark"
      ? "border-ivory/10 bg-gradient-to-br from-charcoal via-[#1a2a30] to-[#24353c]"
      : "border-charcoal/10 bg-gradient-to-br from-ivory via-ivory-soft to-[#E2DACF]";
  const captionVisible = showCaption ?? !decorative;

  return (
    <div
      className={`relative overflow-hidden border ${shell} ${aspectClassName} ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : labels[variant]}
      aria-hidden={decorative || undefined}
      data-tech-visual={variant}
      data-tech-tone={tone}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {tone === "dark" ? (
          <>
            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-champagne/20 blur-3xl" />
            <div className="absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-ivory/5 blur-2xl" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(180,154,115,0.08)_100%)]" />
          </>
        ) : (
          <>
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-champagne/30 blur-2xl" />
            <div className="absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-charcoal/10 blur-2xl" />
          </>
        )}
      </div>
      <div
        className={`relative box-border flex h-full w-full flex-col items-center justify-center p-3 sm:p-4 md:p-5 ${
          captionVisible ? "gap-2" : ""
        }`}
      >
        <div className="flex max-h-full w-full max-w-[19rem] flex-1 items-center justify-center">
          {variant === "growth" && <GrowthComposition tone={tone} />}
          {variant === "erp" && <ErpComposition tone={tone} />}
          {variant === "website" && <WebsiteComposition tone={tone} />}
          {variant === "marketing" && <MarketingComposition tone={tone} />}
          {variant === "ai" && <AiComposition tone={tone} />}
        </div>
        {captionVisible && (
          <p
            className={`shrink-0 text-[0.6rem] uppercase tracking-wideish ${
              tone === "dark" ? "text-ivory/35" : "text-charcoal/35"
            }`}
          >
            Interface preview
          </p>
        )}
      </div>
    </div>
  );
}

function GrowthComposition({ tone }: { tone: Tone }) {
  const card =
    tone === "dark"
      ? "border-ivory/12 bg-charcoal-soft/80"
      : "border-charcoal/10 bg-white/90";
  const cardSolid =
    tone === "dark" ? "border-ivory/12 bg-[#1e2f35]" : "border-charcoal/10 bg-white";
  const cardDark =
    tone === "dark"
      ? "border-champagne/25 bg-charcoal"
      : "border-charcoal/10 bg-charcoal";
  const line = tone === "dark" ? "bg-ivory/15" : "bg-charcoal/10";
  const lineStrong = tone === "dark" ? "bg-ivory/30" : "bg-charcoal/20";
  const panel =
    tone === "dark"
      ? "bg-gradient-to-b from-charcoal to-champagne/20"
      : "bg-gradient-to-b from-ivory to-champagne/25";

  return (
    <div className="grid w-full grid-cols-3 gap-1.5 sm:gap-2">
      <div className={`space-y-1.5 rounded-sm border p-2 shadow-sm ${card}`}>
        <div className="h-1 w-6 rounded-full bg-champagne" />
        <div className={`aspect-[4/3] rounded-sm ${lineStrong}`} />
        <div className={`h-1 w-full rounded-full ${line}`} />
        <div className={`h-1 w-2/3 rounded-full ${line}`} />
      </div>
      <div className={`space-y-1.5 rounded-sm border p-2 shadow-sm ${cardSolid}`}>
        <div className="flex gap-1">
          <span className="h-1 w-1 rounded-full bg-champagne" />
          <span className={`h-1 w-1 rounded-full ${lineStrong}`} />
          <span className={`h-1 w-1 rounded-full ${lineStrong}`} />
        </div>
        <div className={`aspect-[4/3] rounded-sm ${panel}`} />
        <div className="h-4 rounded-sm bg-champagne" />
      </div>
      <div className={`space-y-1.5 rounded-sm border p-2 shadow-sm ${cardDark}`}>
        <div className="h-1 w-8 rounded-full bg-champagne/70" />
        <div className="mt-1 flex aspect-[4/3] items-end gap-1">
          <div className="h-[45%] w-full rounded-sm bg-ivory/20" />
          <div className="h-[75%] w-full rounded-sm bg-champagne/55" />
          <div className="h-[35%] w-full rounded-sm bg-ivory/15" />
        </div>
      </div>
    </div>
  );
}

function ErpComposition({ tone }: { tone: Tone }) {
  const shell =
    tone === "dark"
      ? "border-ivory/15 bg-[#1e2f35] shadow-md shadow-black/20"
      : "border-charcoal/12 bg-white shadow-sm";
  const header = "border-b border-ivory/10 bg-charcoal";
  const side =
    tone === "dark"
      ? "border-r border-ivory/10 bg-charcoal/60"
      : "border-r border-charcoal/8 bg-ivory";
  const tile =
    tone === "dark"
      ? "border-ivory/10 bg-charcoal/50"
      : "border-charcoal/8 bg-ivory";
  const list =
    tone === "dark"
      ? "border-ivory/10 bg-charcoal/40"
      : "border-charcoal/8 bg-ivory-soft/80";
  const muted = tone === "dark" ? "bg-ivory/20" : "bg-charcoal/15";
  const bar = tone === "dark" ? "bg-ivory/12" : "bg-charcoal/12";

  return (
    <div className={`flex w-full flex-col overflow-hidden rounded-sm border ${shell}`}>
      <div className={`flex shrink-0 items-center justify-between px-2.5 py-1.5 ${header}`}>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
          <span className="h-1 w-14 rounded-full bg-ivory/40" />
        </div>
        <div className="flex gap-1">
          <span className="h-1 w-6 rounded-full bg-ivory/20" />
          <span className="h-1 w-5 rounded-full bg-champagne/70" />
        </div>
      </div>
      <div className="flex min-h-0">
        <div className={`flex w-[22%] flex-col gap-1.5 px-1.5 py-2 ${side}`}>
          <div className="h-1 w-full rounded-full bg-champagne" />
          <div className={`h-1 w-4/5 rounded-full ${muted}`} />
          <div className={`h-1 w-3/5 rounded-full ${muted}`} />
          <div className={`mt-2 h-1 w-full rounded-full ${bar}`} />
          <div className={`h-1 w-4/5 rounded-full ${bar}`} />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rounded-sm border p-1.5 ${tile}`}>
                <div
                  className={`h-1 w-4 rounded-full ${i === 0 ? "bg-champagne" : muted}`}
                />
                <div className={`mt-1.5 h-3 rounded-sm ${bar}`} />
              </div>
            ))}
          </div>
          <div className={`flex flex-col gap-1 rounded-sm border p-1.5 ${list}`}>
            {[70, 52, 85].map((w, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="h-1 w-1 shrink-0 rounded-full bg-champagne/70" />
                <div className={`h-1 rounded-full ${bar}`} style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WebsiteComposition({ tone }: { tone: Tone }) {
  const desktop =
    tone === "dark"
      ? "border-ivory/15 bg-[#1e2f35] shadow-md shadow-black/20"
      : "border-charcoal/12 bg-white shadow-sm";
  const phone =
    tone === "dark"
      ? "border-ivory/20 bg-[#1e2f35] shadow-md shadow-black/25"
      : "border-charcoal/20 bg-white shadow-md";
  const mark = tone === "dark" ? "bg-ivory/35" : "bg-charcoal/25";
  const line = tone === "dark" ? "bg-ivory/15" : "bg-charcoal/10";
  const hero =
    tone === "dark"
      ? "bg-gradient-to-br from-charcoal via-champagne/15 to-champagne/35"
      : "bg-gradient-to-br from-ivory via-champagne/20 to-champagne/40";
  const phoneHero =
    tone === "dark"
      ? "bg-gradient-to-b from-charcoal to-champagne/30"
      : "bg-gradient-to-b from-ivory to-champagne/30";

  return (
    <div className="relative flex w-full items-end justify-center gap-2">
      <div className={`flex w-[70%] flex-col overflow-hidden rounded-sm border ${desktop}`}>
        <div className="flex shrink-0 items-center gap-1 border-b border-ivory/10 bg-charcoal px-2 py-1.5">
          <span className="h-1 w-1 rounded-full bg-champagne" />
          <span className="h-1 w-1 rounded-full bg-ivory/35" />
          <span className="h-1 w-1 rounded-full bg-ivory/35" />
          <div className="ml-1.5 h-1 flex-1 rounded-full bg-ivory/15" />
        </div>
        <div className="grid gap-1.5 p-2">
          <div className="flex items-center justify-between gap-2">
            <div className={`h-1.5 w-10 rounded-full ${mark}`} />
            <div className="h-4 w-12 rounded-sm bg-champagne" />
          </div>
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-1.5">
            <div className="space-y-1 py-0.5">
              <div className={`h-2 w-4/5 rounded-full ${mark}`} />
              <div className={`h-1 w-full rounded-full ${line}`} />
              <div className={`h-1 w-5/6 rounded-full ${line}`} />
              <div className="mt-1.5 h-4 w-14 rounded-sm bg-champagne/90" />
            </div>
            <div className={`min-h-[2.75rem] rounded-sm ${hero}`} />
          </div>
        </div>
      </div>
      <div
        className={`mb-0.5 flex w-[24%] flex-col overflow-hidden rounded-[0.55rem] border-[1.5px] ${phone}`}
      >
        <div className="h-2 shrink-0 bg-charcoal" />
        <div className="flex flex-col gap-1 p-1">
          <div className={`aspect-[4/3] rounded-sm ${phoneHero}`} />
          <div className={`h-0.5 w-full rounded-full ${line}`} />
          <div className={`h-0.5 w-4/5 rounded-full ${line}`} />
          <div className="mt-0.5 h-3 rounded-sm bg-champagne/85" />
        </div>
      </div>
    </div>
  );
}

function MarketingComposition({ tone }: { tone: Tone }) {
  const tile =
    tone === "dark"
      ? "border-ivory/12 bg-[#1e2f35] shadow-sm shadow-black/15"
      : "border-charcoal/10 bg-white shadow-sm";
  const line = tone === "dark" ? "bg-ivory/12" : "bg-charcoal/10";
  const soft = tone === "dark" ? "bg-ivory/8" : "bg-ivory";

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="relative overflow-hidden rounded-sm border border-champagne/20 bg-charcoal shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal via-[#1a2a30] to-champagne/30" />
        <div className="relative flex flex-col justify-end gap-1.5 p-2.5 pt-8">
          <div className="h-1 w-9 rounded-full bg-champagne" />
          <div className="h-1.5 w-3/5 rounded-full bg-ivory/55" />
          <div className="h-1 w-2/5 rounded-full bg-ivory/30" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div className={`flex flex-col items-center justify-between rounded-sm border p-1.5 ${tile}`}>
          <div className="mt-0.5 h-6 w-6 rounded-full border-[2.5px] border-champagne/60 border-r-ivory/25" />
          <div className={`mt-1 h-0.5 w-full rounded-full ${line}`} />
        </div>
        <div className={`flex flex-col gap-1 rounded-sm border p-1.5 ${tile}`}>
          <div className="h-0.5 w-6 rounded-full bg-champagne/80" />
          <div className={`h-4 rounded-sm ${soft}`} />
          <div className={`h-0.5 w-full rounded-full ${line}`} />
        </div>
        <div className={`flex flex-col gap-1 rounded-sm border p-1.5 ${tile}`}>
          <div className="flex gap-0.5">
            <div className="h-4 flex-1 rounded-sm bg-champagne/45" />
            <div className={`h-4 flex-1 rounded-sm ${line}`} />
          </div>
          <div className={`h-0.5 w-3/4 rounded-full ${line}`} />
        </div>
      </div>
    </div>
  );
}

function AiComposition({ tone }: { tone: Tone }) {
  const shell =
    tone === "dark"
      ? "border-ivory/15 bg-[#1e2f35] shadow-md shadow-black/20"
      : "border-charcoal/12 bg-white shadow-sm";
  const header =
    tone === "dark"
      ? "border-b border-ivory/10 bg-charcoal/70"
      : "border-b border-charcoal/8 bg-ivory";
  const bot =
    tone === "dark" ? "bg-charcoal/55" : "bg-ivory";
  const botLine = tone === "dark" ? "bg-ivory/25" : "bg-charcoal/15";
  const botLineSoft = tone === "dark" ? "bg-ivory/15" : "bg-charcoal/10";

  return (
    <div className={`flex w-full flex-col overflow-hidden rounded-sm border ${shell}`}>
      <div className={`flex shrink-0 items-center gap-2 px-2.5 py-2 ${header}`}>
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-champagne text-[8px] font-medium tracking-wide text-charcoal"
          aria-hidden
        >
          AI
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div
            className={`h-1 w-16 rounded-full ${tone === "dark" ? "bg-ivory/40" : "bg-charcoal/20"}`}
          />
          <div className="h-0.5 w-10 rounded-full bg-champagne/80" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 px-2.5 py-2">
        <div className={`max-w-[85%] self-start rounded-sm rounded-tl-none px-2 py-1.5 ${bot}`}>
          <div className={`h-1 w-24 rounded-full ${botLine}`} />
          <div className={`mt-1 h-1 w-16 rounded-full ${botLineSoft}`} />
        </div>
        <div className="max-w-[72%] self-end rounded-sm rounded-tr-none bg-champagne/50 px-2 py-1.5">
          <div className="h-1 w-20 rounded-full bg-charcoal/30" />
        </div>
        <div className={`max-w-[80%] self-start rounded-sm rounded-tl-none px-2 py-1.5 ${bot}`}>
          <div className={`h-1 w-28 rounded-full ${botLine}`} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 border-t border-ivory/10 bg-charcoal px-2 py-1.5">
        <div className="h-1 flex-1 rounded-full bg-ivory/25" />
        <div className="h-5 w-5 shrink-0 rounded-sm bg-champagne" />
      </div>
    </div>
  );
}

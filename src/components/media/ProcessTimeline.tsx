import { processSteps } from "@/content/process";

type Props = {
  /** Limit steps shown (homepage preview) */
  limit?: number;
  className?: string;
};

export function ProcessTimeline({ limit, className = "" }: Props) {
  const steps = limit ? processSteps.slice(0, limit) : processSteps;

  return (
    <div className={className}>
      {/* Wide desktop horizontal — xl+ only (8 columns are too narrow at 1024) */}
      <ol className="hidden xl:grid xl:grid-cols-8 xl:gap-3">
        {steps.map((step, i) => (
          <li key={step.number} className="relative flex flex-col">
            {i < steps.length - 1 && (
              <span
                className="absolute left-[calc(50%+1.25rem)] top-4 right-0 h-px bg-charcoal/15"
                aria-hidden
              />
            )}
            <span className="relative z-10 flex h-8 w-8 items-center justify-center border border-champagne/50 bg-white font-display text-xs text-champagne-deep">
              {step.number}
            </span>
            <h3 className="mt-4 font-display text-base leading-snug text-charcoal">{step.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-charcoal-muted">{step.description}</p>
          </li>
        ))}
      </ol>

      {/* Laptop / tablet / mobile vertical */}
      <ol className="relative space-y-0 border-l border-charcoal/15 pl-6 xl:hidden">
        {steps.map((step) => (
          <li key={step.number} className="relative pb-8 last:pb-0">
            <span
              className="absolute -left-[1.9rem] top-0 flex h-7 w-7 items-center justify-center border border-champagne/50 bg-white font-display text-[0.65rem] text-champagne-deep"
              aria-hidden
            >
              {step.number}
            </span>
            <h3 className="font-display text-xl text-charcoal">{step.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-charcoal-muted">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

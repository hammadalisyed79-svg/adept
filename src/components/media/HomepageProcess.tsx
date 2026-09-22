import { Button } from "@/components/ui/Button";
import { homepageProcessPhases } from "@/content/process";

type Props = {
  className?: string;
};

/** Strong 4-phase homepage process — full 8 steps live on /process */
export function HomepageProcess({ className = "" }: Props) {
  return (
    <div className={className}>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {homepageProcessPhases.map((phase) => (
          <li
            key={phase.number}
            className="flex h-full flex-col border border-charcoal/10 bg-white p-5 md:p-6"
          >
            <span className="font-display text-3xl leading-none text-champagne-deep md:text-4xl">
              {phase.number}
            </span>
            <h3 className="mt-4 font-display text-xl leading-snug text-charcoal md:text-2xl">
              {phase.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">{phase.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <Button href="/process" variant="secondary">
          See the full eight-step process
        </Button>
      </div>
    </div>
  );
}

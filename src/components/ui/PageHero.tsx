import type { ReactNode } from "react";
import { MediaImage } from "@/components/media/MediaImage";
import type { MediaKey } from "@/content/media";
import { Container } from "@/components/ui/Section";

export function PageHero({
  eyebrow,
  title,
  description,
  mediaKey,
  visual,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  mediaKey?: MediaKey;
  /** Optional custom visual (e.g. CSS composition) instead of mediaKey */
  visual?: ReactNode;
  children?: ReactNode;
}) {
  const showMedia = Boolean(visual || mediaKey);

  return (
    <div className="border-b border-charcoal/10 bg-ivory">
      <Container
        className={`py-14 md:py-20 ${showMedia ? "grid gap-10 lg:grid-cols-2 lg:items-end" : ""}`}
      >
        <div>
          {eyebrow && (
            <p className="mb-3 text-xs font-medium uppercase tracking-wideish text-champagne-deep">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-3xl font-display text-4xl leading-tight text-charcoal md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-charcoal-muted">
              {description}
            </p>
          )}
          {children}
        </div>
        {visual}
        {!visual && mediaKey && (
          <MediaImage
            mediaKey={mediaKey}
            priority
            hoverScale={false}
            aspectClassName="aspect-[4/3] lg:aspect-[5/4]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="border border-charcoal/10"
          />
        )}
      </Container>
    </div>
  );
}

import Link from "next/link";
import { MediaImage } from "@/components/media/MediaImage";
import type { MediaKey } from "@/content/media";

type Props = {
  href: string;
  mediaKey: MediaKey;
  label?: string;
  title: string;
  description: string;
  index?: string;
  className?: string;
  aspectClassName?: string;
};

export function EditorialImageCard({
  href,
  mediaKey,
  label,
  title,
  description,
  index,
  className = "",
  aspectClassName = "aspect-[4/3]",
}: Props) {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col border border-charcoal/10 bg-white transition duration-soft hover:border-champagne/50 ${className}`}
    >
      <MediaImage
        mediaKey={mediaKey}
        decorative
        aspectClassName={aspectClassName}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="flex flex-1 flex-col p-5 md:p-7">
        {(index || label) && (
          <div className="mb-2 flex items-center gap-3 text-xs uppercase tracking-wideish md:mb-3">
            {index && <span className="text-champagne-deep">{index}</span>}
            {label && <span className="text-charcoal-muted">{label}</span>}
          </div>
        )}
        <h3 className="font-display text-xl text-charcoal group-hover:text-champagne-deep md:text-2xl">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted md:mt-3">
          {description}
        </p>
        <span className="mt-auto pt-5 text-sm font-medium text-charcoal underline-offset-4 group-hover:underline md:pt-6">
          Learn more →
        </span>
      </div>
    </Link>
  );
}

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
      className={`group flex flex-col border border-charcoal/10 bg-white transition duration-soft hover:border-champagne/50 ${className}`}
    >
      <MediaImage
        mediaKey={mediaKey}
        aspectClassName={aspectClassName}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        {(index || label) && (
          <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-wideish">
            {index && <span className="text-champagne-deep">{index}</span>}
            {label && <span className="text-charcoal-muted">{label}</span>}
          </div>
        )}
        <h3 className="font-display text-2xl text-charcoal group-hover:text-champagne-deep">
          {title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-charcoal-muted">
          {description}
        </p>
        <span className="mt-6 text-sm font-medium text-charcoal underline-offset-4 group-hover:underline">
          Learn more →
        </span>
      </div>
    </Link>
  );
}

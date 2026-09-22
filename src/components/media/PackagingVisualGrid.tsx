import Link from "next/link";
import { MediaImage } from "@/components/media/MediaImage";
import { packagingMediaBySlug, type MediaKey } from "@/content/media";
import { packagingCategories } from "@/content/packaging";

type Props = {
  className?: string;
};

export function PackagingVisualGrid({ className = "" }: Props) {
  return (
    <div className={`grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 ${className}`}>
      {packagingCategories.map((cat) => {
        const mediaKey = (packagingMediaBySlug[cat.slug] ?? "packagingComponents") as MediaKey;
        return (
          <Link
            key={cat.slug}
            href={cat.href}
            className="group relative block overflow-hidden border border-charcoal/10 bg-charcoal transition duration-soft hover:border-champagne/60"
          >
            <MediaImage
              mediaKey={mediaKey}
              decorative
              aspectClassName="aspect-square lg:aspect-[3/4]"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
              imgClassName="object-cover object-center opacity-95 transition duration-soft group-hover:opacity-100"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-transparent px-3 pb-3 pt-8 md:px-4 md:pb-4 md:pt-10">
              <p className="font-display text-sm leading-snug text-ivory md:text-lg lg:text-xl">
                {cat.title}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { MediaImage } from "@/components/media/MediaImage";
import { packagingMediaBySlug, type MediaKey } from "@/content/media";
import { packagingCategories } from "@/content/packaging";

type Props = {
  className?: string;
};

export function PackagingVisualGrid({ className = "" }: Props) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
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
              aspectClassName="aspect-[3/4]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              imgClassName="object-cover opacity-90 transition duration-soft group-hover:opacity-100"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent px-4 pb-4 pt-16">
              <p className="font-display text-lg text-ivory md:text-xl">{cat.title}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

import Image from "next/image";
import { getMedia, type MediaKey } from "@/content/media";

type Props = {
  mediaKey: MediaKey;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  aspectClassName?: string;
  /** Disable hover scale (e.g. static heroes) */
  hoverScale?: boolean;
};

export function MediaImage({
  mediaKey,
  className = "",
  imgClassName = "object-cover",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  fill = true,
  aspectClassName = "aspect-[4/3]",
  hoverScale = true,
}: Props) {
  const asset = getMedia(mediaKey);
  const unoptimized = asset.src.endsWith(".svg");
  const scaleClass = hoverScale
    ? "motion-reduce:transform-none motion-safe:group-hover:scale-[1.03]"
    : "";

  if (fill) {
    return (
      <div className={`relative overflow-hidden bg-ivory ${aspectClassName} ${className}`}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          priority={priority}
          sizes={sizes}
          unoptimized={unoptimized}
          className={`transition-transform duration-soft ${scaleClass} ${imgClassName}`}
        />
      </div>
    );
  }

  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={1600}
      height={1200}
      priority={priority}
      sizes={sizes}
      unoptimized={unoptimized}
      className={`${imgClassName} ${className}`}
    />
  );
}

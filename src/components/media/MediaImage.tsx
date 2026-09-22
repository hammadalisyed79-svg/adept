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
  hoverScale?: boolean;
  /** When true (or asset.decorative), hide from assistive tech — parent provides the name. */
  decorative?: boolean;
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
  decorative = false,
}: Props) {
  const asset = getMedia(mediaKey);
  const isSvg = asset.src.endsWith(".svg");
  const isDecorative = decorative || Boolean(asset.decorative);
  const alt = isDecorative ? "" : asset.alt;
  const scaleClass = hoverScale
    ? "motion-reduce:transform-none motion-safe:group-hover:scale-[1.03]"
    : "";

  if (fill) {
    return (
      <div
        className={`relative overflow-hidden bg-ivory ${aspectClassName} ${className}`}
        aria-hidden={isDecorative || undefined}
      >
        <Image
          src={asset.src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          unoptimized={isSvg}
          quality={85}
          className={`h-full w-full object-cover object-center [filter:saturate(0.96)_brightness(0.99)] ${imgClassName} transition-transform duration-soft ${scaleClass}`}
        />
      </div>
    );
  }

  return (
    <Image
      src={asset.src}
      alt={alt}
      width={1600}
      height={1200}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      unoptimized={isSvg}
      quality={85}
      className={`${imgClassName} ${className}`}
      aria-hidden={isDecorative || undefined}
    />
  );
}

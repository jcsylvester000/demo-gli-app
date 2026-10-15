import Image from "next/image";
import type { WorkImage } from "@/content/work-images";
import { stockCredit, stockUrl, type StockPhoto } from "@/content/stock";
import { CropMarks, RegMark } from "@/components/brand/print-marks";
import { cn } from "@/lib/utils";

/** A portfolio image "trimmed like a press sheet": white proof border + crop marks. Artwork boards use object-contain on Mist. */
export function ProofImage({
  image,
  sizes,
  priority = false,
  className,
  aspect = "aspect-[4/3]",
  marks = true,
}: {
  image: WorkImage;
  sizes: string;
  priority?: boolean;
  className?: string;
  aspect?: string;
  marks?: boolean;
}) {
  return (
    <figure className={cn("relative bg-white p-1.5 shadow-[0_10px_30px_-12px_rgb(0_48_107/0.45)]", className)}>
      {marks ? <CropMarks tone="white" /> : null}
      <div className={cn("relative overflow-hidden", aspect, image.fit === "contain" ? "bg-gli-mist" : "bg-gli-tint")}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          quality={90}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          className={image.fit === "contain" ? "object-contain p-2" : "object-cover"}
        />
      </div>
    </figure>
  );
}

/**
 * Stand-in when no permitted GLI image exists yet. With `photo`, an illustrative Unsplash photo sits behind the label
 * (tagged "Illustrative" + credit, so it never reads as GLI's own work); without it, the typographic proof.
 */
export function TypeThumb({
  label,
  sub,
  className,
  aspect = "aspect-[4/3]",
  photo,
  sizes = "(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw",
  priority = false,
}: {
  label: string;
  sub?: string;
  className?: string;
  aspect?: string;
  photo?: StockPhoto;
  sizes?: string;
  priority?: boolean;
}) {
  if (photo) {
    return (
      <div className={cn("on-dark relative flex flex-col justify-end overflow-hidden bg-gli-navy p-2 text-white", aspect, className)}>
        <Image
          src={stockUrl(photo)}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover"
        />
        <span className="eyebrow absolute left-2 top-2 rounded-sm bg-gli-navy/80 px-1.5 py-0.5 text-[0.625rem] text-white">Illustrative</span>
        {/* The card heading sits right below, so the tile carries only the photo, the tag and the credit. */}
        <p className="relative self-start rounded-sm bg-gli-navy/70 px-1.5 py-0.5 text-[0.625rem] leading-4 text-white/90">Photo: {photo.by} / Unsplash</p>
      </div>
    );
  }
  return (
    <div className={cn("on-dark ripple-field relative flex flex-col justify-end overflow-hidden bg-gli-navy p-4 text-white", aspect, className)}>
      <RegMark className="absolute right-4 top-4 size-5 text-gli-sky" />
      <p className="eyebrow text-[0.6875rem] text-gli-sky">{sub ?? "GLI production"}</p>
      <p className="mt-1 font-heading text-lg font-semibold leading-tight">{label}</p>
    </div>
  );
}

/** Hero/body figure for an illustrative stock photo: proof border, crop marks, linked credit (Unsplash guidelines). */
export function StockFigure({
  photo,
  sizes,
  priority = false,
  className,
  aspect = "aspect-[4/3]",
  caption,
}: {
  photo: StockPhoto;
  sizes: string;
  priority?: boolean;
  className?: string;
  aspect?: string;
  caption?: string;
}) {
  return (
    <figure className={cn("relative bg-white p-1.5 shadow-[0_10px_30px_-12px_rgb(0_48_107/0.45)]", className)}>
      <CropMarks tone="white" />
      <div className={cn("relative overflow-hidden bg-gli-tint", aspect)}>
        <Image src={stockUrl(photo)} alt={photo.alt} fill sizes={sizes} priority={priority} fetchPriority={priority ? "high" : undefined} className="object-cover" />
        <span className="eyebrow absolute left-2 top-2 rounded-sm bg-gli-navy/80 px-1.5 py-0.5 text-[0.625rem] text-white">Illustrative</span>
      </div>
      <figcaption className="px-1 pb-0.5 pt-1.5 text-[0.75rem] leading-4 text-gli-slate">
        {caption ? <span>{caption} · </span> : null}
        Photo:{" "}
        <a href={stockCredit(photo)} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
          {photo.by} / Unsplash
        </a>
      </figcaption>
    </figure>
  );
}

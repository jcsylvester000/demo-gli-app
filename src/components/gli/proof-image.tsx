import Image from "next/image";
import type { WorkImage } from "@/content/work-images";
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
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          className={image.fit === "contain" ? "object-contain p-2" : "object-cover"}
        />
      </div>
    </figure>
  );
}

/** Typographic stand-in when no permitted image exists yet (never a stock photo). */
export function TypeThumb({ label, sub, className, aspect = "aspect-[4/3]" }: { label: string; sub?: string; className?: string; aspect?: string }) {
  return (
    <div className={cn("on-dark ripple-field relative flex flex-col justify-end overflow-hidden bg-gli-navy p-4 text-white", aspect, className)}>
      <RegMark className="absolute right-4 top-4 size-5 text-gli-sky" />
      <p className="eyebrow text-[0.6875rem] text-gli-sky">{sub ?? "GLI production"}</p>
      <p className="mt-1 font-heading text-lg font-semibold leading-tight">{label}</p>
    </div>
  );
}

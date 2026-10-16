import { ArrowRight } from "lucide-react";
import type { WorkImage } from "@/content/work-images";
import { ProofImage } from "./proof-image";

/**
 * Render → reality pair (replaces the S2 drag slider where the two shots are not the same framing, so they are shown
 * side by side instead of overlaid). Both must be real GLI work: the approved 3D render and the installed result.
 */
export function RenderToReality({ render, built, labels }: { render: WorkImage; built: WorkImage; labels: readonly [string, string] }) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)] md:gap-8">
      <figure>
        <ProofImage image={render} sizes="(min-width: 1024px) 380px, 90vw" aspect="aspect-[4/5]" className="-rotate-1" />
        <figcaption className="mt-3 font-heading font-semibold text-gli-navy">{labels[0]}</figcaption>
      </figure>
      <ArrowRight aria-hidden="true" className="mx-auto size-8 rotate-90 text-gli-signal md:rotate-0" />
      <figure>
        <ProofImage image={built} sizes="(min-width: 1024px) 560px, 90vw" aspect="aspect-[4/3]" className="rotate-1" />
        <figcaption className="mt-3 font-heading font-semibold text-gli-navy">{labels[1]}</figcaption>
      </figure>
    </div>
  );
}

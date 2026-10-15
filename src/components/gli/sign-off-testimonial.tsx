import type { Testimonial } from "@/lib/gate";

/**
 * S11 Client Sign-Off Testimonial (Testimonials Five, Tailark, MIT; rebuilt). Quote above a signature line with a
 * "Signed off" stamp. Only real, attributed, client-approved quotes are passed in; with none, nothing renders.
 */
export function SignOffTestimonial({ item, company }: { item: Testimonial; company?: string }) {
  return (
    <figure className="relative mx-auto max-w-3xl rounded-[var(--radius)] border border-gli-line bg-gli-tint p-8 md:p-10">
      <span aria-hidden="true" className="font-heading text-6xl leading-none text-gli-blue">
        &ldquo;
      </span>
      <blockquote className="mt-2 text-xl leading-relaxed text-gli-ink md:text-2xl">{item.quote}</blockquote>
      <figcaption className="mt-8 border-t border-gli-navy pt-3 text-[0.9375rem]">
        <span className="font-semibold text-gli-navy">{item.person}</span>
        {item.title ? <span className="text-gli-slate">, {item.title}</span> : null}
        {company ? <span className="text-gli-slate"> · {company}</span> : null}
      </figcaption>
      <span aria-hidden="true" className="eyebrow absolute bottom-8 right-8 -rotate-12 rounded-sm border-2 border-gli-blue px-3 py-1 text-gli-blue md:bottom-10 md:right-10">
        Signed off
      </span>
    </figure>
  );
}

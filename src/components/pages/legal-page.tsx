import { Breadcrumbs } from "@/components/layout/breadcrumbs";

/** Simple text page (Privacy, Terms). */
export function LegalPage({
  title,
  path,
  sections,
  note,
  children,
}: {
  title: string;
  path: string;
  sections: { h: string; p: string }[];
  note?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={[{ name: title, href: path }]} />
      <article className="container-site py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        <div className="hairline mt-4 w-16 text-gli-blue" />
        {note ? (
          <p className="mt-6 max-w-3xl rounded-[var(--radius)] border border-gli-yellow bg-[color-mix(in_oklab,var(--color-gli-yellow),white_85%)] p-4 text-[0.9375rem]">
            {note}
          </p>
        ) : null}
        <div className="mt-8 max-w-3xl space-y-8 text-lg">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-2xl">{s.h}</h2>
              <p className="mt-3">{s.p}</p>
            </section>
          ))}
          {children}
        </div>
      </article>
    </>
  );
}

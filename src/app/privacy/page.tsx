import Link from "next/link";
import { PRIVACY } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/pages/legal-page";

export const metadata = pageMetadata({ title: PRIVACY.seoTitle, description: PRIVACY.meta, path: "/privacy" });

export default function Privacy() {
  return (
    <LegalPage title={PRIVACY.h1} path="/privacy" sections={PRIVACY.sections} note={PRIVACY.draftNote}>
      <p className="text-base text-gli-slate">
        Questions about your data? Use our{" "}
        <Link href="/contact" className="font-semibold text-gli-blue underline underline-offset-4">
          Contact page
        </Link>
        .
      </p>
    </LegalPage>
  );
}

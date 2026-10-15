import { TERMS } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/pages/legal-page";

export const metadata = pageMetadata({ title: TERMS.seoTitle, description: TERMS.meta, path: "/terms" });

export default function Terms() {
  return <LegalPage title={TERMS.h1} path="/terms" sections={TERMS.sections} note={TERMS.draftNote} />;
}

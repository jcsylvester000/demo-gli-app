import { WORK_HUB } from "@/content/work-hub";
import { pageMetadata } from "@/lib/seo";
import { WorkListing } from "@/components/pages/work-listing";

export const revalidate = 300;
export const metadata = pageMetadata({ title: WORK_HUB.seoTitle, description: WORK_HUB.meta, path: "/work" });

export default function WorkHub() {
  return <WorkListing page={1} />;
}

import { HOW_WE_WORK } from "@/content/about";
import { HOME } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { MarkList } from "@/components/pages/list-with-marks";
import { ProcessTimeline } from "@/components/gli/process-timeline";

export const metadata = pageMetadata({ title: HOW_WE_WORK.seoTitle, description: HOW_WE_WORK.meta, path: "/about/how-we-work" });

export default function HowWeWork() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "About", href: "/about" },
          { name: "How We Work", href: "/about/how-we-work" },
        ]}
      />
      <PageHero
        eyebrow="Our process"
        title={HOW_WE_WORK.h1}
        intro={HOW_WE_WORK.intro}
        primary={{ label: "Start a job ticket", href: "/quote" }}
        proof="One producer, one point of contact, from brief to wrap-up"
      />
      <section aria-labelledby="steps-title" className="bg-white">
        <div className="container-site py-14 md:py-20">
          <SectionHeading id="steps-title" eyebrow="Six steps" title="From brief to wrap-up" />
          <div className="mt-12">
            <ProcessTimeline steps={HOME.process.steps} />
          </div>
        </div>
      </section>
      <section aria-labelledby="need-title" className="bg-gli-mist">
        <div className="container-site grid gap-10 py-14 md:py-20 lg:grid-cols-2">
          <SectionHeading
            id="need-title"
            eyebrow="Before we start"
            title="What we need from you"
            intro="Send what you have; we'll tell you if anything is missing."
          />
          <div className="text-lg">
            <MarkList items={HOW_WE_WORK.needFromYou} />
          </div>
        </div>
      </section>
    </>
  );
}

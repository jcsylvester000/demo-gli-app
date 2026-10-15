import type { Metadata, Viewport } from "next";
import "./globals.css";
import { barlow, sourceSans } from "@/lib/fonts";
import { indexingAllowed, siteUrl } from "@/lib/utils";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CtaBand } from "@/components/layout/cta-band";
import { ChatButton } from "@/components/layout/chat-button";
import { HideOn } from "@/components/layout/hide-on";
import { chatChannels, hoursText } from "@/components/layout/channels";
import { getContact } from "@/lib/server/site-settings";
import { ConsentManager } from "@/components/consent/consent-manager";
import { AttributionCapture } from "@/components/forms/attribution-capture";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "GLI | Print, Displays, Booths & Events Manila, Since 1996",
    template: "%s | GLI",
  },
  description:
    "Graphics Library, Inc. takes pharma materials, print, retail displays, convention booths and events from first sketch to show floor. One team since 1996.",
  applicationName: "Graphics Library, Inc.",
  robots: indexingAllowed() ? { index: true, follow: true } : { index: false, follow: false },
  icons: { icon: "/brand/gli-mark.svg" },
  openGraph: { type: "website", locale: "en_PH", siteName: "Graphics Library, Inc." },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#00306B", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const contact = await getContact();
  return (
    <html lang="en-PH" className={`${barlow.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-gli-blue"
        >
          Skip to content
        </a>
        <HideOn paths={["/admin"]}>
          <UtilityBar />
          <Header />
        </HideOn>
        <main id="main" className="flex-1">
          {children}
        </main>
        <HideOn paths={["/quote", "/admin"]}>
          <CtaBand />
        </HideOn>
        <HideOn paths={["/admin"]}>
          <Footer />
        </HideOn>
        <HideOn paths={["/quote", "/admin"]}>
          <ChatButton channels={chatChannels(contact)} hours={hoursText(contact)} />
        </HideOn>
        <AttributionCapture />
        <HideOn paths={["/admin"]}>
          <ConsentManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || undefined} />
        </HideOn>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PaymentCalculator from "@/components/shared/calculator/Calculator";
import Cover from "./_components/Cover";
import MainFAQ from "./_components/MainFAQ";
import ProjectsSection from "./_components/ProjectsSection";
import WhyChooseUs from "./_components/WhyUsSection";
import VisualBridge from "@/components/shared/visualBridge/VisualBridge";
import Gallery from "./_components/Gallery";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("main");

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      t("keywords.0"),
      t("keywords.1"),
      t("keywords.2"),
      t("keywords.3"),
      t("keywords.4"),
      t("keywords.5"),
      t("keywords.6"),
    ],
    creator: "AISI Group - აისი ჯგუფი",
    publisher: "Digital Port",
    metadataBase: new URL("https://aisigroup.ge/"),
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      url: "https://aisigroup.ge",
      siteName: "AISI Group - აისი ჯგუფი",
      images: [
        {
          url: "/images/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: t("openGraphImageAlt"),
        },
      ],
      type: "website",
    },
  };
}

export default function Page() {
  return (
    <>
      <Cover />
      <VisualBridge />
      <ProjectsSection />
      <PaymentCalculator />
      <Gallery />
      <WhyChooseUs />
      <MainFAQ />
    </>
  );
}

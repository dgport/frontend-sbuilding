import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    metadataBase: new URL("https://sbuilding.ge"),
    title: {
      default: `${t("sBuilding")} - ${t("constructionExcellence")}`,
      template: `%s | ${t("sBuilding")}`,
    },
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
    authors: [{ name: t("sBuilding") }],
    creator: t("sBuilding"),
    publisher: t("sBuilding"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      type: "website",
      locale: "ka_GE",
      alternateLocale: ["en_US"],
      url: "https://sbuilding.ge",
      title: `${t("sBuilding")} - ${t("constructionExcellence")}`,
      description: t("metaDescription"),
      siteName: t("sBuilding"),
      images: [
        {
          url: "https://sbuilding.ge/images/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${t("sBuilding")} - ${t("constructionExcellence")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("sBuilding")} - ${t("constructionExcellence")}`,
      description: t("metaDescription"),
      images: ["https://sbuilding.ge/images/opengraph-image.png"],
    },
    alternates: {
      canonical: "https://sbuilding.ge",
      languages: {
        "ka-GE": "https://sbuilding.ge/ka",
        "en-US": "https://sbuilding.ge/en",
      },
    },
    category: "Real Estate",
  };
}

import WhyUsSection from "./_components/WhyUsSection";
import HeroSection from "./_components/CoverSection";
import PaymentCalculator from "@/components/shared/calculator/Calculator";
import ProjectsSection from "./_components/ProjectsSection";
import FeaturesSection from "./_components/FeaturesSection";

export default function page() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <PaymentCalculator />
      <FeaturesSection />
      <WhyUsSection />
    </>
  );
}

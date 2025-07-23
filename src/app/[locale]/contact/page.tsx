import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactCard from "./_components/ContactCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    title: t("contactUs"),
    description: t("contactDescription"),
    keywords: t("contactKeywords"),
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
      url: "https://sbuilding.ge/contact",
      title: t("contactUs"),
      description: t("contactDescription"),
      siteName: t("sBuilding"),
      images: [
        {
          url: "https://sbuilding.ge/images/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: t("contactFormImage"),
        },
      ],
    },
  };
}
export default async function page() {
  return (
    <>
      <ContactCard />
    </>
  );
}

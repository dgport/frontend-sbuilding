import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactCard from "./_components/ContactCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");

  return {
    title: t("contactUs"),
    description: t("contactDesc"),
    keywords: t("keyWords"),
    authors: [{ name: t("aisiGroup") }],
    creator: t("aisiGroup"),
    publisher: t("aisiGroup"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "ka_GE",
      alternateLocale: ["en_US"],
      url: "https://aisigroup.ge/contact",
      title: t("contactUs"),
      description: t("contactDesc"),
      siteName: t("aisiGroup"),
      images: [
        {
          url: "https://aisigroup.ge/images/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: t("contactImageAlt"),
        },
      ],
    },
    other: {
      "apple-mobile-web-app-title": t("aisiGroup"),
      "application-name": t("aisiGroup"),
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

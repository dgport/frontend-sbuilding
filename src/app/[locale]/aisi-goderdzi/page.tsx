import { Metadata } from "next";
import Cover from "./_components/Cover";
import GoderdziGallery from "./_components/GoderdziGallery";
import SelectFloor from "./_components/SelectFloor";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("goderdzi");

  return {
    title: t("aisiGoderdzi"),
    description: t("aisiDesc"),
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
      url: "https://aisigroup.ge/aisi-goderdzi",
      title: t("aisiGoderdzi"),
      description: t("aisiDesc"),
      siteName: t("aisiGroup"),
      images: [
        {
          url: "https://aisigroup.ge/images/goderdzi/GoderdziGreen.jpg",
          width: 1200,
          height: 630,
          alt: "AISI Goderdzi Ski Resort - Mountain Apartments",
        },
      ],
    },
    other: {
      "apple-mobile-web-app-title": t("aisiGroup"),
      "application-name": t("aisiGroup"),
    },
  };
}

export default function Page() {
  return (
    <>
      <Cover />
      <SelectFloor />
      <GoderdziGallery />
    </>
  );
}

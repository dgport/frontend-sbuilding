import { Metadata } from "next";
import BatumiGallery from "./_components/BatumiGallery";
import Cover from "./_components/Cover";
import SelectFloor from "./_components/SelectFloor";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("batumi");

  return {
    title: t("aisiBatumi"),
    description: t("batumiDesc"),
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
      url: "https://aisigroup.ge/aisi-batumi",
      title: t("aisiBatumi"),
      description: t("batumiDesc"),
      siteName: t("aisiGroup"),
      images: [
        {
          url: "https://aisigroup.ge/images/batumi/Cover2.png",
          width: 1200,
          height: 630,
          alt: "AISI Batumi Residential Complex - Luxury Apartments",
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
      <BatumiGallery />
    </>
  );
}

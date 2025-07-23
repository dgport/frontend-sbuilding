import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header/Header";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import QueryProvider from "@/reactQuery/queryProvider";
import { AuthProvider } from "@/auth/AuthProvider";
import WhatsAppChat from "@/components/shared/socials/Whatsapp";
import MessengerChat from "@/components/shared/socials/Messanger";
import Footer from "@/components/footer/Footer";

const geo2 = localFont({
  src: "../../fonts/geo2.ttf",
  variable: "--font-geo2",
  display: "swap",
  weight: "400",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
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
      locale: locale === "ka" ? "ka_GE" : "en_US",
      alternateLocale: locale === "ka" ? ["en_US"] : ["ka_GE"],
      url: `https://sbuilding.ge${locale === "en" ? "" : `/${locale}`}`,
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
      canonical: `https://sbuilding.ge${locale === "en" ? "" : `/${locale}`}`,
      languages: {
        "ka-GE": "https://sbuilding.ge/ka",
        "en-US": "https://sbuilding.ge/en",
      },
    },
    category: "Real Estate",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={` ${geo2.variable}`} suppressHydrationWarning={true}>
        <AuthProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <Header />
              {children}
              <Footer />

              <WhatsAppChat
                phoneNumber="+995557471414"
                defaultMessage="Hello from SBuilding website"
              />
              <MessengerChat
                pageId={process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID || ""}
                defaultMessage="Hello from SBuilding website"
              />
            </NextIntlClientProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

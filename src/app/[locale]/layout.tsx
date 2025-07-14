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
 

const geo1 = localFont({
  src: "../../fonts/geo1.otf",
  variable: "--font-geo1",
  display: "swap",
  weight: "400",
});

const geo2 = localFont({
  src: "../../fonts/geo2.ttf",
  variable: "--font-geo2",
  display: "swap",
  weight: "400",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations("main");

  return {
    metadataBase: new URL("https://aisigroup.ge"),
    title: {
      default: `${t("aisiGroup")} - ${t("premiumDev")}`,
      template: `%s | ${t("aisiGroup")}`,
    },
    description: t("transformingFrom"),
    keywords: t("metaKeywords"),
    authors: [{ name: t("aisiGroup") }],
    creator: t("aisiGroup"),
    publisher: t("aisiGroup"),
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ka" ? "ka_GE" : "en_US",
      alternateLocale: locale === "ka" ? ["en_US"] : ["ka_GE"],
      url: `https://aisigroup.ge${locale === "en" ? "" : `/${locale}`}`,
      title: `${t("aisiGroup")} - ${t("premiumDev")}`,
      description: t("transformingFrom"),
      siteName: t("aisiGroup"),
      images: [
        {
          url: "https://aisigroup.ge/images/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${t("aisiGroup")} - ${t("premiumDev")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("aisiGroup")} - ${t("premiumDev")}`,
      description: t("transformingFrom"),
      images: ["https://aisigroup.ge/images/og-image.jpg"],
    },
    alternates: {
      canonical: `https://aisigroup.ge${locale === "en" ? "" : `/${locale}`}`,
      languages: {
        "ka-GE": "https://aisigroup.ge/ka",
        "en-US": "https://aisigroup.ge/en",
      },
    },
    category: "Real Estate",
    classification: "Business",
    referrer: "origin-when-cross-origin",
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geo1.variable} ${geo2.variable}`}>
        <AuthProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              {/* <Header /> */}
              {children}
              {/* <Footer /> */}

              <WhatsAppChat
                phoneNumber="+995557471414"
                defaultMessage="Hello from aisi group website"
              />
              <MessengerChat
                pageId={process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID || ""}
                defaultMessage="Hello from aisi group website"
              />
            </NextIntlClientProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
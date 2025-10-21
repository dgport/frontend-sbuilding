import SelectFloor from "../elisium/_components/SelectFloor";
import Cover from "../elisium/_components/Cover";

import ElyisiumFAQ from "./_components/StatusFAQ";
import ProjectInfo from "./_components/ProjectInfo";

// export async function generateMetadata(): Promise<Metadata> {
//   const t = await getTranslations("main");

//   return {
//     title: t("aisiStatus"),
//     description: t("transferSpaces"),
//     keywords: t("keyWords").split(", "),
//     creator: t("aisiGroup"),
//     publisher: "Digital Port",
//     metadataBase: new URL("https://aisigroup.ge/"),
//     openGraph: {
//       title: `${t("aisiStatus")} - ${t("aisiGroup")}`,
//       description: t("statusDesc"),
//       url: "https://aisigroup.ge",
//       siteName: t("aisiGroup"),
//       images: [
//         {
//           url: "/images/status/Status1.png",
//           width: 1200,
//           height: 630,
//           alt: t("statusImageAlt"),
//         },
//       ],
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `${t("aisiStatus")} - ${t("aisiGroup")}`,
//       description: t("statusDesc"),
//       images: ["/images/status/Status1.png"],
//     },
//     alternates: {
//       canonical: "https://aisigroup.ge",
//       languages: {
//         en: "https://aisigroup.ge/en",
//         ka: "https://aisigroup.ge/ka",
//       },
//     },
//     robots: {
//       index: true,
//       follow: true,
//       googleBot: {
//         index: true,
//         follow: true,
//         "max-video-preview": -1,
//         "max-image-preview": "large",
//         "max-snippet": -1,
//       },
//     },
//   };
// }

export default function Page() {
  return (
    <>
      <Cover />
      <SelectFloor />
      {/* <SelectParking /> */}
      <ProjectInfo />
      <ElyisiumFAQ />
    </>
  );
}

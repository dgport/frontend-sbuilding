"use client";

import CoverSection from "@/components/shared/cover/MainCoverSection";
import Cover2 from "@/root/public/images/main/MainCover2.png";
import Cover3 from "@/root/public/images/main/MainCover3.png";
import { useTranslations } from "next-intl";

export default function Cover() {
  const t = useTranslations("main");
  return (
    <CoverSection
      images={[Cover2, Cover3]}
      title={t("aisiGroup")}
      subtitle={t("premiumDev")}
      description={t("transformingFrom")}
      secondaryTitle=""
      secondaryDescription={t("coverDesc")}
      tags={[{ text: t("modern") }, { text: t("exclu") }]}
      slideInterval={7000}
      height="h-[700px] md:min-h-screen"
    />
  );
}

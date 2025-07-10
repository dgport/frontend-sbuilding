import CoverSection from "@/components/shared/cover/MainCoverSection";
import Cover1 from "@/root/public/images/status/Status1.png"
import { useTranslations } from "next-intl";

export default function Cover() {
  const t = useTranslations("status");

  return (
    <CoverSection
      images={[Cover1]}
      title={t("aisiStatus")}
      subtitle=""
      description={t("transferSpaces")}
      secondaryTitle={t("aisiAdjara")}
      secondaryDescription={t("statusDesc")}
      tags={[]}
      slideInterval={7000}
      height="h-[700px]"
    />
  );
}

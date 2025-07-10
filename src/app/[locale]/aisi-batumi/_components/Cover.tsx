import CoverSection from "@/components/shared/cover/MainCoverSection";
import Cover1 from "@/root/public/images/batumi/Cover1.png";
import Cover2 from "@/root/public/images/batumi/Cover2.png";
import { useTranslations } from "next-intl";

export default function Cover() {
  const t = useTranslations("batumi");

  return (
    <CoverSection
      images={[Cover1, Cover2]}
      title={t("aisiBatumi")}
      subtitle=""
      description={t("transferSpaces")}
      secondaryTitle={t("aisiAdjara")}
      secondaryDescription={t("batumiDesc")}
      tags={[]}
      slideInterval={7000}
      height="h-[700px]"
    />
  );
}

import CoverSection from "@/components/shared/cover/MainCoverSection";
import Cover1 from "@/root/public/images/goderdzi/MainCover1.jpg";
import Cover2 from "@/root/public/images/goderdzi/MainCover2.jpg";
import { useTranslations } from "next-intl";

export default function Cover() {
  const t = useTranslations("goderdzi");
  return (
    <CoverSection
      images={[Cover1, Cover2]}
      title={t("aisiGoderdzi")}
      subtitle=""
      description={t("transferSpaces")}
      secondaryTitle={t("aisiMountain")}
      secondaryDescription={t("aisiDesc")}
      tags={[]}
      slideInterval={7000}
      height="h-[700px]"
    />
  );
}

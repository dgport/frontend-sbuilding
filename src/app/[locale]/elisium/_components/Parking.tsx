"use client";
import Image from "next/image";
import ParkingImage from "@/root/public/images/elisium/Parking.jpg";
import ParkingMobileImage from "@/root/public/images/elisium/Parking.avif";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Parking() {
  const t = useTranslations("elysium");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <h1 className="text-2xl md:text-3xl pt-10 text-center font-semibold text-gray-900">
        {t("parking")}
      </h1>

      <section className="relative mx-4 my-8 md:mx-8 lg:mx-30 lg:my-10 min-h-screen font-geo2 tracking-widest overflow-hidden">
        <div className="relative w-full h-[100vh] overflow-hidden rounded-2xl">
          <Image
            src={isMobile ? ParkingMobileImage : ParkingImage}
            alt="Parking plan"
            fill
            priority
            quality={100}
            className="object-cover rounded-2xl"
          />
        </div>
      </section>
    </>
  );
}

"use client";

import Image from "next/image";
import ParkingImage from "@/root/public/images/elisium/Parking.jpg";
import { useTranslations } from "next-intl";

export default function Parking() {
  const t = useTranslations("elysium");

  return (
    <>
      <h1 className="text-2xl hidden md:block md:text-3xl pt-10 text-center font-semibold text-gray-900">
        {t("parking")}
      </h1>
      <section className="px-1 mx-4 my-8 md:px-8  lg:mx-30 lg:my-10 min-h-screen font-geo2 tracking-widest relative overflow-hidden">
        <Image
          src={ParkingImage}
          alt="Parking plan"
          className="object-cover h-10 object-center  w-full  overflow-hidden rounded-2xl"
          priority
          quality={100}
          fill
        />
      </section>
    </>
  );
}

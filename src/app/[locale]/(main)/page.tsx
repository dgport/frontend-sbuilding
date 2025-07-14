import React from "react";
import WhyUsSection from "./_components/WhyUsSection";
import HeroSection from "./_components/CoverSection";
import ApartmentSlideshow from "./_components/FeaturesSection";
import ConstructionCarousel from "./_components/Porjects";
import PaymentCalculator from "@/components/shared/calculator/Calculator";

export default function page() {
  return (
    <>
      <HeroSection />
      <ConstructionCarousel />
      <PaymentCalculator />
      <ApartmentSlideshow />
      <WhyUsSection />
    </>
  );
}

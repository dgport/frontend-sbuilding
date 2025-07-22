import WhyUsSection from "./_components/WhyUsSection";
import HeroSection from "./_components/CoverSection";
import ApartmentSlideshow from "./_components/FeaturesSection";
import PaymentCalculator from "@/components/shared/calculator/Calculator";
import ProjectsSection from "./_components/ProjectsSection";

export default function page() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <PaymentCalculator />
      <ApartmentSlideshow />
      <WhyUsSection />
    </>
  );
}

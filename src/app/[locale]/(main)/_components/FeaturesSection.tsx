"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const ApartmentSlideshow = () => {
  const t = useTranslations("main");
  const backgroundImages = [
    "/images/elisium/Image1.avif",
    "/images/elisium/Image1.avif",
    "/images/elisium/Image1.avif",
    "/images/elisium/Image1.avif",
    "/images/elisium/Image1.avif",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const sections = [
    {
      id: "technology",
      title: t("technology_title"),
      description: t("technology_description"),
    },
    {
      id: "ecology",
      title: t("ecology_title"),
      description: t("ecology_description"),
    },
    {
      id: "location",
      title: t("location_title"),
      description: t("location_description"),
    },
  ];

  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? backgroundImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-1000">
        <Image
          src={backgroundImages[currentImageIndex]}
          width={1900}
          height={1200}
          alt={t("apartment_building_alt")}
          className="w-full h-full object-cover md:object-cover animate-[panRight_20s_linear_infinite] md:animate-none md:object-center object-left"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <style jsx>{`
        @keyframes panRight {
          0% {
            object-position: left center;
          }
          100% {
            object-position: right center;
          }
        }
      `}</style>

      <button
        onClick={prevSlide}
        className="hidden lg:block cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden lg:block cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="relative z-10 hidden md:flex h-full">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`flex-1 relative cursor-pointer transition-all duration-500 ${
              index !== sections.length - 1 ? "border-r-2 border-white/30" : ""
            }`}
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                hoveredSection === section.id
                  ? "backdrop-blur-sm bg-blue-500/40"
                  : "bg-transparent"
              }`}
            />
            <div className="relative z-20 flex flex-col justify-center items-center h-full px-8 text-center">
              <h2 className="text-4xl lg:text-5xl font-light text-white mb-8 transition-all duration-500">
                {section.title}
              </h2>
              <div
                className={`transition-all duration-500 transform ${
                  hoveredSection === section.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <p className="text-white text-lg lg:text-xl mb-8 max-w-md leading-relaxed">
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 md:hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-20 flex flex-col justify-center items-center h-full px-6 text-center">
          <h2 className="text-3xl font-light text-white mb-4">
            {sections[currentImageIndex % sections.length].title}
          </h2>
          <p className="text-white text-base mb-6 max-w-sm leading-relaxed">
            {sections[currentImageIndex % sections.length].description}
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-30">
        <div className="flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-blue-500" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApartmentSlideshow;

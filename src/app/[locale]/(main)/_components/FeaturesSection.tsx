"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const ApartmentSlideshow = () => {
  const backgroundImages = [
    "/images/elisium/Image3.avif",
    "/images/elisium/Image4.avif",
    "/images/elisium/Image5.avif",
  ];

  const t = useTranslations("main");

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
      id: "facade",
      title: t("facade_title"),
      layers: [
        t("facade_layer_1"),
        t("facade_layer_2"),
        t("facade_layer_3"),
        t("facade_layer_4"),
        t("facade_layer_5"),
        t("facade_layer_6"),
        t("facade_layer_7"),
        t("facade_layer_8"),
      ],
      systemTitle: t("facade_system_title"),
    },
    {
      id: "location",
      title: t("location_title2"),
      description: t("location_description2"),
    },
    {
      id: "apartments",
      title: t("apartments_title"),
      description: t("apartments_description"),
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
          alt="Apartment Building"
          className="w-full h-full object-cover md:object-cover animate-[panRight_20s_linear_infinite] md:animate-none md:object-center object-left"
        />
        <div className="absolute inset-0 bg-black/10" />
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
        className="hidden lg:block cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30 transition-all duration-300"
        aria-label={t("previous_project")}
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
        className="hidden lg:block cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30 transition-all duration-300"
        aria-label={t("next_project")}
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
            className={`flex-1 relative cursor-pointer  transition-all duration-500 ${
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
            <div className="relative z-20 flex flex-col justify-center md:justify-start md:pt-40  items-center h-full px-8 text-center">
              <h2 className="text-3xl lg:text-4xl font-light text-white mb-6 transition-all duration-500">
                {section.title}
              </h2>
              <div
                className={`transition-all duration-500 transform ${
                  hoveredSection === section.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                {section.description && (
                  <p className="text-white text-base lg:text-lg mb-6 max-w-md leading-relaxed">
                    {section.description}
                  </p>
                )}
                {section.id === "facade" && section.layers && (
                  <div className="text-white text-sm lg:text-base max-w-xs">
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <h4 className="font-semibold mb-3 text-blue-200">
                        {section.systemTitle}
                      </h4>
                      <ul className="text-left space-y-1">
                        {section.layers.map((layer, idx) => (
                          <li
                            key={idx}
                            className="text-xs lg:text-sm text-white"
                          >
                            {layer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 md:hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-20 flex flex-col justify-center items-center h-full px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-light text-white mb-4">
            {sections[currentImageIndex % sections.length].title}
          </h2>
          {sections[currentImageIndex % sections.length].description && (
            <p className="text-white text-sm lg:text-base mb-6 max-w-sm leading-relaxed">
              {sections[currentImageIndex % sections.length].description}
            </p>
          )}
          {currentImageIndex % sections.length === 0 && sections[0].layers && (
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/20 max-w-xs">
              <h4 className="font-semibold mb-2 text-blue-200 text-sm">
                {sections[0].systemTitle}
              </h4>
              <ul className="text-left space-y-0.5">
                {sections[0].layers.map((layer, idx) => (
                  <li key={idx} className="text-xs text-white">
                    {layer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-30">
        <div className="flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                index === currentImageIndex ? "bg-blue-500" : "bg-white/50"
              }`}
              aria-label={`${t("project_gallery")} ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApartmentSlideshow;

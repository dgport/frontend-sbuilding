"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";

const NavButton = memo(
  ({
    direction,
    onClick,
    label,
  }: {
    direction: "prev" | "next";
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`hidden lg:block cursor-pointer absolute ${
        direction === "prev" ? "left-4" : "right-4"
      } top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30 transition-colors duration-300`}
      aria-label={label}
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
          d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  )
);

NavButton.displayName = "NavButton";

const Section = memo(
  ({
    section,

    isLast,
    hoveredSection,
    onMouseEnter,
    onMouseLeave,
  }: any) => (
    <div
      className={`flex-1 relative cursor-pointer transition-all duration-500 ${
        !isLast ? "border-r-2 border-white/30" : ""
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`absolute inset-0 transition-all duration-500 pointer-events-none ${
          hoveredSection === section.id
            ? "backdrop-blur-sm bg-blue-500/40"
            : "bg-transparent"
        }`}
      />
      <div className="relative z-20 flex flex-col justify-center md:justify-start md:pt-40 items-center h-full px-8 text-center">
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
                  {section.layers.map((layer: string, idx: number) => (
                    <li key={idx} className="text-xs lg:text-sm text-white">
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
  )
);

Section.displayName = "Section";

const DotIndicator = memo(
  ({
    isActive,
    onClick,
    label,
  }: {
    isActive: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
        isActive ? "bg-blue-500" : "bg-white/50"
      }`}
      aria-label={label}
    />
  )
);

DotIndicator.displayName = "DotIndicator";

const FeaturesSection = () => {
  const t = useTranslations("main");

  const backgroundImages = useMemo(
    () => [
      "/images/elisium/Image3.avif",
      "/images/elisium/Image4.avif",
      "/images/elisium/Image5.avif",
    ],
    []
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Memoize sections to prevent recreation on every render
  const sections = useMemo(
    () => [
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
    ],
    [t]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const nextSlide = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
  }, [backgroundImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? backgroundImages.length - 1 : prev - 1
    );
  }, [backgroundImages.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  const handleMouseEnter = useCallback((sectionId: string) => {
    setHoveredSection(sectionId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSection(null);
  }, []);

  // Memoize current mobile section
  const currentMobileSection = useMemo(
    () => sections[currentImageIndex % sections.length],
    [sections, currentImageIndex]
  );

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        <Image
          src={backgroundImages[currentImageIndex]}
          alt="Apartment Building"
          width={1920}
          height={1080}
          className="w-full h-full object-cover md:object-cover animate-[panRight_20s_linear_infinite] md:animate-none md:object-center object-left"
          priority={currentImageIndex === 0}
          loading={currentImageIndex === 0 ? "eager" : "lazy"}
          quality={85}
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
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

      {/* Navigation Buttons */}
      <NavButton
        direction="prev"
        onClick={prevSlide}
        label={t("previous_project")}
      />
      <NavButton
        direction="next"
        onClick={nextSlide}
        label={t("next_project")}
      />

      {/* Desktop View */}
      <div className="relative z-10 hidden md:flex h-full">
        {sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            index={index}
            isLast={index === sections.length - 1}
            hoveredSection={hoveredSection}
            onMouseEnter={() => handleMouseEnter(section.id)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>

      {/* Mobile View */}
      <div className="relative z-10 md:hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="relative z-20 flex flex-col justify-center items-center h-full px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-light text-white mb-4">
            {currentMobileSection.title}
          </h2>
          {currentMobileSection.description && (
            <p className="text-white text-sm lg:text-base mb-6 max-w-sm leading-relaxed">
              {currentMobileSection.description}
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

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-30">
        <div className="flex gap-2">
          {backgroundImages.map((_, index) => (
            <DotIndicator
              key={index}
              isActive={index === currentImageIndex}
              onClick={() => goToSlide(index)}
              label={`${t("project_gallery")} ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

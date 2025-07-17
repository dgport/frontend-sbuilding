"use client";

import React, { useState, useEffect } from "react";

const ApartmentSlideshow = () => {
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
      title: "Technológie",
      description:
        "Moderné technológie pre pohodlné bývanie. Smart home systémy, energetická efektívnosť a najnovšie bezpečnostné riešenia.",
      buttonText: "Dozvedieť sa viac",
    },
    {
      id: "ecology",
      title: "Ekológia",
      description:
        "Udržateľné a ekologické riešenia. Zelené technológie, obnoviteľné zdroje energie a environmentálne zodpovedné materiály.",
      buttonText: "Dozvedieť sa viac",
    },
    {
      id: "location",
      title: "Lokalita",
      description:
        "Tichá, zelená a mesto na dosah. Rezidenčná lokalita, ktorá vám umožní byť blízko centra, no nie v jeho ruchu.",
      buttonText: "Dozvedieť sa viac",
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
        <img
          src={backgroundImages[currentImageIndex]}
          alt="Apartment building"
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
        className="absolute left-10 cursor-pointer top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-blue-500/50 hover:bg-blue-600/70 text-white flex items-center justify-center transition-colors duration-300 text-xl"
      >
        ←
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-10 cursor-pointer top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-blue-500/50 hover:bg-blue-600/70 text-white flex items-center justify-center transition-colors duration-300 text-xl"
      >
        →
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
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300 flex items-center gap-2">
                  {section.buttonText}
                  <span>→</span>
                </button>
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
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 flex items-center gap-2">
            {sections[currentImageIndex % sections.length].buttonText}
            <span>→</span>
          </button>
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

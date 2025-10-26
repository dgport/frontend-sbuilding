"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import img from "@/root/public/images/elisium/CoverCardImage.jpg";
import { useTranslations } from "next-intl";

const CoverSection = () => {
  const t = useTranslations("main");
  const backgroundImages = ["/images/elisium/Image1.avif"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotate, setRotate] = useState({ x: 0, z: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const goToNextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);

  const goToPrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? backgroundImages.length - 1 : prev - 1
    );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = -(e.clientY - centerY) / 25;
    const rotateZ = (e.clientX - centerX) / 25;
    setRotate({ x: rotateX, z: rotateZ });
  };

  const handleMouseLeave = () => setRotate({ x: 0, z: 0 });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div
          key={currentImageIndex}
          className="absolute inset-0 w-full h-full bg-cover bg-right lg:bg-center opacity-0 animate-fadeIn transition-all duration-700"
          style={{
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          }}
        />
      </div>
      <button
        onClick={goToPrevImage}
        className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30 transition"
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
        onClick={goToNextImage}
        className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30 transition"
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
      <div className="hidden lg:flex absolute bottom-40 left-1/2 -translate-x-1/2 space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-2 rounded-full transition-all ${
              currentImageIndex === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
      <div className="lg:hidden absolute inset-0 flex flex-col pt-10 items-center justify-center text-white text-center px-4 z-10">
        <h1
          className="text-3xl font-normal mb-6 tracking-wider opacity-0 animate-fadeIn"
          style={{
            textShadow:
              "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6), 0 0 16px rgba(59,130,246,0.3)",
            filter: "drop-shadow(0 0 10px rgba(59,130,246,0.4))",
          }}
        >
          {t("company_slogan")}
        </h1>

        <div className="w-full max-w-[270px] md:max-w-[350px] mx-auto mt-4 transition-transform duration-300 hover:scale-105">
          <Link href="/elisium">
            <div className="relative w-full rounded-2xl shadow-2xl border border-white/30 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-blue-700/20 p-4 text-white cursor-pointer">
              <Image
                src={img || "/placeholder.svg"}
                alt={t("project_alt")}
                className="w-full h-84 md:h-96 rounded-2xl object-cover mb-4"
              />
              <button className="w-full bg-gradient-to-r h-9 from-blue-500 to-blue-600 text-white text-sm px-3 py-1 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105">
                {t("current_project_button")} <ArrowRight size={16} />
              </button>
            </div>
          </Link>
        </div>
      </div>
      <div className="hidden absolute pt-14 gap-20 inset-0 lg:flex items-center justify-between text-white pl-32 xl:pl-48 pr-12 xl:pr-20 z-10">
        <Link href="/elisium">
          <div
            ref={cardRef}
            className="w-92 relative cursor-pointer transition-transform duration-300 hover:scale-105"
            style={{
              perspective: "1200px",
              transform: `rotateX(${rotate.x}deg) rotateZ(${rotate.z}deg)`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="rounded-3xl shadow-2xl border border-white/30 backdrop-blur-xl overflow-hidden transition-transform"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.3), rgba(30,64,175,0.2))",
              }}
            >
              <div className="p-4 flex flex-col items-center text-white">
                <div className="text-3xl mb-2">🏗️</div>
                <h1 className="text-2xl font-bold text-center mb-2 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  {t("current_project")}
                </h1>
                <Image
                  src={img || "/placeholder.svg"}
                  alt={t("project_alt")}
                  className="w-full lg:h-[60%] rounded-md"
                />
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white mt-4 text-base px-5 py-2 rounded-xl flex items-center gap-3 shadow-lg transition-transform hover:scale-105">
                  {t("view_current_project")}
                </button>
              </div>
            </div>
          </div>
        </Link>

        <div className="mr-16 lg:mr-24 text-right max-w-xl opacity-0 animate-fadeIn delay-300">
          <h1
            className="text-5xl text-center font-normal leading-tight tracking-wide"
            style={{
              textShadow:
                "3px 3px 6px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.4)",
              filter: "drop-shadow(0 0 15px rgba(59,130,246,0.5))",
            }}
          >
            {t("company_slogan")}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CoverSection;

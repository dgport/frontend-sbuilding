"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyUsSection() {
  const t = useTranslations("main");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, z: 0 });

  // Detect mobile screen
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const clientTestimonials = [
    {
      id: 1,
      text: t("client_testimonial_1"),
      rating: 5,
      position: { x: 15, y: 20 },
      mobilePosition: { x: 10, y: 5 },
      depth: 0.3,
      delay: 0.2,
    },
    {
      id: 2,
      text: t("client_testimonial_2"),
      rating: 5,
      position: { x: 75, y: 15 },
      mobilePosition: { x: 70, y: 8 },
      depth: 0.6,
      delay: 0.4,
    },
    {
      id: 3,
      text: t("client_testimonial_3"),
      rating: 5,
      position: { x: 10, y: 65 },
      mobilePosition: { x: 5, y: 85 },
      depth: 0.8,
      delay: 0.6,
    },
    {
      id: 4,
      text: t("client_testimonial_4"),
      rating: 5,
      position: { x: 70, y: 70 },
      mobilePosition: { x: 75, y: 90 },
      depth: 0.4,
      delay: 0.8,
    },
    {
      id: 5,
      text: t("client_testimonial_5"),
      rating: 5,
      position: { x: 20, y: 40 },
      mobilePosition: { x: 2, y: 35 },
      depth: 0.7,
      delay: 1.0,
    },
    {
      id: 6,
      text: t("client_testimonial_6"),
      rating: 5,
      position: { x: 65, y: 45 },
      mobilePosition: { x: 88, y: 45 },
      depth: 0.5,
      delay: 1.2,
    },
  ];

  // Handle mouse-based tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 25;
    const rotateZ = (e.clientX - centerX) / 25;
    setRotate({ x: -rotateX, z: rotateZ });

    setMousePosition({
      x: (e.clientX - centerX) / rect.width,
      y: (e.clientY - centerY) / rect.height,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, z: 0 });
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  return (
    <div className="min-h-[90vh] py-10 md:py-0 relative overflow-hidden bg-blue-50">
      {/* Background Grid */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="mathGrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.2"
                opacity="0.8"
              />
            </pattern>
            <radialGradient id="centerVisibility" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="60%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#fff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="gridVisibilityMask">
              <rect width="100%" height="100%" fill="url(#centerVisibility)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#mathGrid)"
            mask="url(#gridVisibilityMask)"
          />
        </svg>
      </div>

      <div className="flex items-center justify-center min-h-screen relative px-4">
        {/* Floating testimonials */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {clientTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="absolute bg-white/90 border-blue-200/60 text-blue-900 backdrop-blur-sm rounded-lg border shadow-lg opacity-0 animate-fadeInUp"
              style={{
                left: `${
                  isMobile
                    ? testimonial.mobilePosition.x
                    : testimonial.position.x
                }%`,
                top: `${
                  isMobile
                    ? testimonial.mobilePosition.y
                    : testimonial.position.y
                }%`,
                animationDelay: `${testimonial.delay}s`,
                opacity: testimonial.depth,
              }}
            >
              <div className="p-2 md:p-3 max-w-32 md:max-w-48">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-1.5 h-1.5 md:w-2 md:h-2 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-[10px] md:text-xs font-medium mb-1 text-blue-800 line-clamp-3">
                  "{testimonial.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Central interactive card */}
        <div
          ref={cardRef}
          className={`relative cursor-pointer select-none mx-auto z-10 w-64 h-88 md:w-80 md:h-96 transition-transform duration-300 ease-out ${
            isHovered ? "scale-105" : "scale-100"
          } opacity-0 animate-fadeIn`}
          style={{
            perspective: "1200px",
            transform: `rotateX(${rotate.x}deg) rotateZ(${rotate.z}deg)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <div
            className="relative w-full h-full rounded-2xl md:rounded-3xl shadow-2xl border border-white/30 transition-transform duration-300"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)",
            }}
          >
            <div className="p-4 md:p-6 h-full flex flex-col justify-center items-center text-white relative overflow-hidden">
              <div
                className={`text-4xl md:text-6xl mb-3 md:mb-4 transition-transform duration-300 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
              >
                🏗️
              </div>

              <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center tracking-wide">
                {t("why_choose_us")}
              </h2>

              <div className="space-y-3 md:space-y-4 text-center">
                <div
                  className={`transition-transform duration-300 ${
                    isHovered ? "scale-105" : "scale-100"
                  }`}
                >
                  <div className="text-yellow-300 text-lg md:text-2xl font-bold">
                    4+
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {t("projects_completed")}
                  </div>
                </div>

                <div
                  className={`transition-transform duration-300 ${
                    isHovered ? "scale-105" : "scale-100"
                  }`}
                >
                  <div className="text-yellow-300 text-lg md:text-2xl font-bold">
                    1,000+
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {t("happy_clients")}
                  </div>
                </div>

                <div
                  className={`transition-transform duration-300 ${
                    isHovered ? "scale-105" : "scale-100"
                  }`}
                >
                  <div className="text-yellow-300 text-lg md:text-2xl font-bold">
                    10+
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {t("years_experience")}
                  </div>
                </div>
              </div>

              {/* Light reflection */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${
                    50 + mousePosition.x * 30
                  }% ${50 + mousePosition.y * 30}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


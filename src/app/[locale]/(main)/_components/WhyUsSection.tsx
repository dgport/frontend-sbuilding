"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyUsSection() {
  const t = useTranslations("main");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const clientTestimonials = [
    {
      id: 1,
      name: t("client_name_1"),
      text: t("client_testimonial_1"),
      rating: 5,
      position: { x: 15, y: 20 }, // Original desktop position
      mobilePosition: { x: 10, y: 5 }, // Mobile specific position
      depth: 0.3,
      delay: 0.2,
    },
    {
      id: 2,
      name: t("client_name_2"),
      text: t("client_testimonial_2"),
      rating: 5,
      position: { x: 75, y: 15 }, // Original desktop position
      mobilePosition: { x: 70, y: 8 },
      depth: 0.6,
      delay: 0.4,
    },
    {
      id: 3,
      name: t("client_name_3"),
      text: t("client_testimonial_3"),
      rating: 5,
      position: { x: 10, y: 65 }, // Original desktop position
      mobilePosition: { x: 5, y: 85 },
      depth: 0.8,
      delay: 0.6,
    },
    {
      id: 4,
      name: t("client_name_4"),
      text: t("client_testimonial_4"),
      rating: 5,
      position: { x: 70, y: 70 }, // Original desktop position
      mobilePosition: { x: 75, y: 90 },
      depth: 0.4,
      delay: 0.8,
    },
    {
      id: 5,
      name: t("client_name_5"),
      text: t("client_testimonial_5"),
      rating: 5,
      position: { x: 20, y: 40 }, // Original desktop position
      mobilePosition: { x: 2, y: 35 },
      depth: 0.7,
      delay: 1.0,
    },
    {
      id: 6,
      name: t("client_name_6"),
      text: t("client_testimonial_6"),
      rating: 5,
      position: { x: 65, y: 45 }, // Original desktop position
      mobilePosition: { x: 88, y: 45 },
      depth: 0.5,
      delay: 1.2,
    },
  ];

  const springConfig = { stiffness: 400, damping: 40 };
  const rotateX = useSpring(0, springConfig);
  const rotateZ = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateXValue = (e.clientY - centerY) / 25;
    const rotateZValue = (e.clientX - centerX) / 25;

    rotateX.set(-rotateXValue);
    rotateZ.set(rotateZValue);

    setMousePosition({
      x: (e.clientX - centerX) / rect.width,
      y: (e.clientY - centerY) / rect.height,
    });
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateZ.set(0);
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  return (
    <div className="min-h-[90vh] py-10 md:py-0 relative overflow-hidden bg-blue-50">
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
            <linearGradient
              id="topBottomFade"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#000" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#000" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#000" stopOpacity="0" />
              <stop offset="80%" stopColor="#000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient
              id="leftRightFade"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#000" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#000" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#000" stopOpacity="0" />
              <stop offset="70%" stopColor="#000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
            </linearGradient>
            <mask id="gridVisibilityMask">
              <rect width="100%" height="100%" fill="url(#centerVisibility)" />
              <rect
                width="100%"
                height="100%"
                fill="url(#topBottomFade)"
                style={{ mixBlendMode: "multiply" }}
              />
              <rect
                width="100%"
                height="100%"
                fill="url(#leftRightFade)"
                style={{ mixBlendMode: "multiply" }}
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#mathGrid)"
            mask="url(#gridVisibilityMask)"
          />
          <g mask="url(#gridVisibilityMask)">
            <polygon
              points="200,150 220,120 240,150 220,180"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
              opacity="0.3"
            />
            <circle
              cx="300"
              cy="200"
              r="15"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="1"
              opacity="0.2"
            />
            <rect
              x="500"
              y="100"
              width="20"
              height="20"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
              opacity="0.25"
            />
            <text
              x="150"
              y="300"
              fontSize="12"
              fill="#3b82f6"
              opacity="0.4"
              fontFamily="monospace"
            >
              E = mc²
            </text>
            <text
              x="400"
              y="400"
              fontSize="10"
              fill="#1d4ed8"
              opacity="0.3"
              fontFamily="monospace"
            >
              F = ma
            </text>
            <text
              x="600"
              y="250"
              fontSize="11"
              fill="#3b82f6"
              opacity="0.35"
              fontFamily="monospace"
            >
              ∑ x²
            </text>
            <text
              x="100"
              y="500"
              fontSize="9"
              fill="#1d4ed8"
              opacity="0.3"
              fontFamily="monospace"
            >
              lim(x→∞)
            </text>
            <text
              x="450"
              y="600"
              fontSize="10"
              fill="#3b82f6"
              opacity="0.4"
              fontFamily="monospace"
            >
              dx/dt
            </text>
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-center min-h-screen relative px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {clientTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="absolute bg-white/90 border-blue-200/60 text-blue-900 backdrop-blur-sm rounded-lg border shadow-lg"
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
                opacity: testimonial.depth,
              }}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: testimonial.depth, scale: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: testimonial.delay,
                type: "spring",
                stiffness: 100,
                damping: 20,
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
                <p className="text-[9px] md:text-xs text-blue-600">
                  - {testimonial.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          ref={cardRef}
          className="relative cursor-pointer select-none mx-auto z-10 w-64 h-88 md:w-80 md:h-96"
          style={{ perspective: "1200px", transformOrigin: "center center" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="relative w-full h-full rounded-2xl md:rounded-3xl shadow-2xl border border-white/30"
            style={{
              rotateX: rotateX,
              rotateZ: rotateZ,
              background:
                "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)",
            }}
          >
            <div className="p-4 md:p-6 h-full flex flex-col justify-center items-center text-white relative overflow-hidden">
              <motion.div
                className="text-4xl md:text-6xl mb-3 md:mb-4"
                animate={{
                  rotateY: mousePosition.x * 15,
                  rotateX: mousePosition.y * 15,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                🏗️
              </motion.div>

              <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center tracking-wide">
                {t("why_choose_us")}
              </h2>

              <div className="space-y-3 md:space-y-4 text-center">
                <motion.div
                  className="text-base md:text-lg font-semibold"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="text-yellow-300 text-lg md:text-2xl font-bold">
                    500+
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {t("projects_completed")}
                  </div>
                </motion.div>

                <motion.div
                  className="text-base md:text-lg font-semibold"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: 0.1,
                  }}
                >
                  <div className="text-yellow-300 text-lg md:text-2xl font-bold">
                    10,000+
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {t("happy_clients")}
                  </div>
                </motion.div>

                <motion.div
                  className="text-base md:text-lg font-semibold"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: 0.2,
                  }}
                >
                  <div className="text-yellow-300 text-lg md:text-2xl font-bold">
                    30+
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    {t("years_experience")}
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl"
                style={{
                  background: `radial-gradient(circle at ${
                    50 + mousePosition.x * 30
                  }% ${
                    50 + mousePosition.y * 30
                  }%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

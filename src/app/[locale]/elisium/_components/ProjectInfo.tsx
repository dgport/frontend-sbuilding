"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ProjectInfo() {
  const t = useTranslations("elysium");

  const amenities = [
    t("amenity1"),
    t("amenity2"),
    t("amenity3"),
    t("amenity4"),
    t("amenity5"),
    t("amenity6"),
    t("amenity7"),
    t("amenity8"),
  ];

  return (
    <section className="bg-white font-geo2 relative py-10 md:py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="construction-grid-parking"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                />
                <rect
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.3"
                />
                <circle cx="10" cy="10" r="2" fill="#1e40af" opacity="0.3" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#construction-grid-parking)"
            />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <div className="bg-blue-900/95 rounded-2xl">
          <div className="relative w-full p-3 px-4 sm:px-8 md:px-12 pb-8 sm:pb-16 pt-0 mx-auto overflow-hidden border border-white/10">
            <div className="relative z-10 p-3 sm:p-6 pt-8 sm:pt-12">
              <div className="flex flex-col items-center mb-8 sm:mb-12">
                <div className="flex items-center mb-2 sm:mb-4">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 text-white mr-2 sm:mr-3">
                    ℹ️
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-normal text-white tracking-wide">
                    {t("projectInformation")}
                  </h3>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full w-24 sm:w-32"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="bg-gradient-to-br from-green-600/30 to-green-800/30 rounded-xl p-4 border border-green-400/20">
                  <div className="flex items-center mb-2">
                    <div className="h-5 w-5 text-green-300 mr-2">📊</div>
                    <span className="text-green-200 font-medium text-2xl md:text-3xl">
                      {t("salesStatus")}
                    </span>
                  </div>
                  <p className="text-white text-lg font-bold">
                    {t("salesPercentage")}
                  </p>
                </div>

                <div className="bg-gradient-to-br  from-blue-600/30 to-blue-800/30 rounded-xl p-4 border border-blue-400/20">
                  <div className="flex items-center mb-2">
                    <div className="h-5 w-5 text-blue-300 mr-2">📍</div>
                    <span className="text-blue-200  font-medium text-2xl md:text-3xl">
                      {t("locationTitle")}
                    </span>
                  </div>
                  <p className="text-white text-lg font-bold">
                    {t("locationAddress")}
                  </p>
                  <p className="text-white/70 text-lg">
                    {t("distanceFromSea")}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 rounded-xl p-4 border border-yellow-400/20">
                  <div className="flex items-center mb-2">
                    <div className="h-5 w-5 text-yellow-300 mr-2">🏗️</div>
                    <span className="text-yellow-200 text-2xl md:text-3xl font-medium">
                      {t("constructionStatus")}
                    </span>
                  </div>
                  <p className="text-white text-lg font-bold">
                    {t("constructionStage")}
                  </p>
                  <p className="text-white/70 text-lg">
                    {t("constructionProgress")}
                  </p>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="mb-8 sm:mb-10">
                <h4 className="text-2xl sm:text-2xl font-semibold text-white mb-6 text-center">
                  {t("premiumAmenities")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 rounded-lg p-3 sm:p-4 border border-white/10 flex items-center hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="text-white/80 mr-3 text-2xl">
                        {index < 2
                          ? "🚗"
                          : index < 4
                          ? "🏋️"
                          : index < 5
                          ? "🏊"
                          : index < 6
                          ? "🍽️"
                          : index < 7
                          ? "🛒"
                          : "✂️"}
                      </div>
                      <p className="text-white/90 text-sm sm:text-lg font-medium">
                        {amenity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

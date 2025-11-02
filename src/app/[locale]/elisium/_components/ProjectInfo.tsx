"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function ProjectInfo() {
  const t = useTranslations("elysium");

  const amenities = useMemo(
    () => [
      t("amenity1"),
      t("amenity2"),
      t("amenity3"),
      t("amenity4"),
      t("amenity5"),
      t("amenity6"),
      t("amenity7"),
      t("amenity8"),
    ],
    [t]
  );

  const amenityIcons = ["🚗", "🚗", "🏋️", "🏋️", "🏊", "🍽️", "🛒", "✂️"];

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url('/images/elisium/Image2.avif')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        {/* Info Card */}
        <div className="w-full max-w-5xl p-4 sm:p-6 md:p-8 mb-8">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center mb-3">
              <div className="h-5 w-5 text-white mr-2">ℹ️</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-white tracking-wide">
                {t("projectInformation")}
              </h3>
            </div>
            <div className="h-0.5 bg-linear-to-r from-transparent via-white/60 to-transparent rounded-full w-24"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-linear-to-br from-green-500/25 to-green-700/25 backdrop-blur-md rounded-lg p-3 border border-green-400/20 transform-gpu">
              <div className="flex items-center mb-1">
                <div className="h-4 w-4 text-green-300 mr-2">📊</div>
                <span className="text-green-200 font-medium text-sm sm:text-base">
                  {t("salesStatus")}
                </span>
              </div>
              <p className="text-white text-base sm:text-lg font-bold">
                {t("salesPercentage")}
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-400/25 to-blue-600/25 backdrop-blur-md rounded-lg p-3 border border-blue-400/20 transform-gpu">
              <div className="flex items-center mb-1">
                <div className="h-4 w-4 text-blue-300 mr-2">📍</div>
                <span className="text-blue-200 font-medium text-sm sm:text-base">
                  {t("locationTitle")}
                </span>
              </div>
              <p className="text-white text-sm sm:text-base font-bold">
                {t("locationAddress")}
              </p>
              <p className="text-white/70 text-xs sm:text-sm">
                {t("distanceFromSea")}
              </p>
            </div>

            <div className="bg-linear-to-br from-yellow-500/25 to-yellow-700/25 backdrop-blur-md rounded-lg p-3 border border-yellow-400/20 transform-gpu">
              <div className="flex items-center mb-1">
                <div className="h-4 w-4 text-yellow-300 mr-2">🏗️</div>
                <span className="text-yellow-200 text-sm sm:text-base font-medium">
                  {t("constructionStatus")}
                </span>
              </div>
              <p className="text-white text-base sm:text-lg font-bold">
                {t("constructionStage")}
              </p>
              <p className="text-white/70 text-xs sm:text-sm">
                {t("constructionProgress")}
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">
              {t("premiumAmenities")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="bg-linear-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-blue-300/15 flex items-center hover:bg-blue-400/30 transition-colors duration-300 transform-gpu"
                >
                  <div className="text-white/80 mr-2 text-lg sm:text-xl">
                    {amenityIcons[index]}
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm font-medium">
                    {amenity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";

interface ApartmentData {
  id: string | number;
  name: string;
  floor: string | number;
  size: string | number;
  balcony: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  sale_price: string | number;
  property_status: string;
}

interface StatusConfig {
  color: string;
  text: string;
}

interface ApartmentModalProps {
  apartment: ApartmentData | null;
  statusConfig: StatusConfig | null;
  onClose: () => void;
}

export function ApartmentModal({
  apartment,
  statusConfig,
  onClose,
}: ApartmentModalProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const t = useTranslations("elysium");

  React.useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [apartment?.id]);

  if (!apartment || !statusConfig) return null;

  const imageSrc = `${process.env.NEXT_PUBLIC_IMAGE}/${apartment.id}`;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl gap-10 shadow-2xl p-5 w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg aspect-[1280/853]">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">{t("loading")}</p>
              </div>
            </div>
          )}
          {imageError ? (
            <div className="w-full h-full bg-white flex items-center justify-center">
              <p className="text-gray-400 text-lg font-medium">
                {t("noImage")}
              </p>
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt="Apartment preview"
              width={1280}
              height={853}
              className={`object-cover w-full h-full transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          )}
        </div>

        <div className="w-full lg:w-1/4 p-1 flex flex-col overflow-y-auto">
          <div
            className="rounded-lg p-2 mb-3 sm:mb-4"
            style={{ backgroundColor: statusConfig.color }}
          >
            <h2 className="text-base sm:text-lg font-bold text-white text-center leading-tight">
              {t("apartment")} {apartment.name} / {t("floor")} {apartment.floor}
            </h2>
          </div>

          <div className="flex justify-center mb-3 sm:mb-4">
            <span
              className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-white font-bold text-xs"
              style={{ backgroundColor: statusConfig.color }}
            >
              {statusConfig.text}
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3 flex-1">
            {[
              { label: t("totalArea"), value: `${apartment.size} m²` },
              { label: t("balcony"), value: `${apartment.balcony || 0}  m²` },
              { label: t("bedrooms"), value: apartment.bedrooms },
              { label: t("pricePerSqm"), value: `$${apartment.sale_price}` },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-1.5 sm:py-2 border-b"
              >
                <span className="text-gray-600 text-sm font-semibold">
                  {item.label}
                </span>
                <span
                  className="text-base sm:text-lg font-bold"
                  style={{ color: statusConfig.color }}
                >
                  {item.value}
                </span>
              </div>
            ))}

            <div className="flex justify-between items-center py-2 sm:py-3">
              <span className="text-gray-600 text-sm font-semibold">
                {t("totalPrice")}
              </span>
              <span
                className="text-lg sm:text-xl font-bold"
                style={{ color: statusConfig.color }}
              >
                $
                {(
                  Number(apartment.size) * Number(apartment.sale_price)
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-3 sm:mt-4 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

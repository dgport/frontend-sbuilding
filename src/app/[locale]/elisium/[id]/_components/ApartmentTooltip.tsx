import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { createPortal } from "react-dom";

interface ApartmentData {
  name: string;
  size: string | number;
  balcony_size: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  sale_price: string | number;
}

interface StatusConfig {
  color: string;
  text: string;
}

interface TooltipPosition {
  x: number;
  y: number;
}

interface ApartmentTooltipProps {
  apartment: ApartmentData | null;
  statusConfig: StatusConfig | null;
  position: TooltipPosition | null;
}

export function ApartmentTooltip({
  apartment,
  statusConfig,
  position,
}: ApartmentTooltipProps) {
  if (!apartment || !statusConfig || !position) return null;

  const t = useTranslations("elysium");

  const tooltip = (
    <div
      className="fixed z-[99999] pointer-events-none tooltip-desktop-only"
      style={{
        left: position.x + 15,
        top: position.y + 15,
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border-2 p-4 min-w-[220px] transition-opacity duration-150"
        style={{
          borderColor: statusConfig.color,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4
            className="font-bold text-lg"
            style={{ color: statusConfig.color }}
          >
            {t("apt")} {apartment.name}
          </h4>
          <span
            className="px-2 py-0.5 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: statusConfig.color }}
          >
            {statusConfig.text}
          </span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{t("totalArea")}:</span>
            <span className="font-semibold">{apartment.size} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("balcony")}:</span>
            <span className="font-semibold">{apartment.balcony_size} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("bedrooms")}:</span>
            <span className="font-semibold">{apartment.bedrooms}</span>
          </div>

          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="text-gray-600">Price:</span>
            <span className="font-bold" style={{ color: statusConfig.color }}>
              $
              {(
                Number.parseFloat(apartment.size.toString()) *
                Number.parseFloat(apartment.sale_price.toString())
              ).toLocaleString()}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {t("clickDetails")}
        </p>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(tooltip, document.body)
    : null;
}

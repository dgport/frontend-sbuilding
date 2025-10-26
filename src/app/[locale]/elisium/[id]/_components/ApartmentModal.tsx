import Image from "next/image";
import type React from "react";
import { useState } from "react";

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
  gradient: string;
  hoverGradient: string;
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

  if (!apartment || !statusConfig) return null;

  const imageSrc = imageError
    ? "/images/elisium/Gegma.png"
    : `/images/apartments/apt-${apartment.id}.jpg`;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="w-full lg:w-3/4 bg-gray-100 flex items-center justify-center p-2 md:p-4 h-64 sm:h-96 lg:h-auto">
          <Image
            src={imageSrc}
            alt={`Apartment ${apartment.name}`}
            className="w-full h-full object-contain rounded-lg"
            onError={() => setImageError(true)}
            width={1200}
            height={800}
          />
        </div>

        {/* Info Section */}
        <div className="w-full lg:w-1/4 p-4 sm:p-6 flex flex-col overflow-y-auto">
          {/* Header */}
          <div
            className="rounded-xl p-3 mb-4"
            style={{ backgroundColor: statusConfig.color }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-white text-center">
              Apartment {apartment.name}
            </h2>
            <p className="text-white text-center text-xs mt-1 opacity-90">
              Floor {apartment.floor}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-4">
            <span
              className="px-3 py-1 rounded-full text-white font-bold text-xs"
              style={{ backgroundColor: statusConfig.color }}
            >
              {statusConfig.text}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 text-sm font-semibold">
                Total Area
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: statusConfig.color }}
              >
                {apartment.size} m²
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 text-sm font-semibold">
                Balcony
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: statusConfig.color }}
              >
                {apartment.balcony} m²
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 text-sm font-semibold">
                Bedrooms
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: statusConfig.color }}
              >
                {apartment.bedrooms}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 text-sm font-semibold">
                Bathrooms
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: statusConfig.color }}
              >
                {apartment.bathrooms}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 text-sm font-semibold">
                Price per m²
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: statusConfig.color }}
              >
                ${apartment.sale_price}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm font-semibold">
                Total Price
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: statusConfig.color }}
              >
                $
                {(
                  Number.parseFloat(apartment.size.toString()) *
                  Number.parseFloat(apartment.sale_price.toString())
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

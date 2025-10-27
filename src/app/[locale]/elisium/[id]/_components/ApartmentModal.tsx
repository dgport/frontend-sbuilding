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
      className="fixed inset-0 z-999999999999 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl gap-10 shadow-2xl p-5 w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden max-h-dvh sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="w-full lg:w-3/4 bg-gray-100 flex items-center justify-center p-2 sm:p-4 h-56 sm:h-96 lg:h-auto">
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
        <div className="w-full lg:w-1/4 p-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <div
            className="rounded-lg p-2 mb-3 sm:mb-4"
            style={{ backgroundColor: statusConfig.color }}
          >
            <h2 className="text-base sm:text-lg font-bold text-white text-center leading-tight">
              Apt {apartment.name} / Floor {apartment.floor}
            </h2>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <span
              className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-white font-bold text-xs"
              style={{ backgroundColor: statusConfig.color }}
            >
              {statusConfig.text}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2 sm:space-y-3 flex-1">
            {[
              { label: "Total Area", value: `${apartment.size} m²` },
              { label: "Balcony", value: `${apartment.balcony} m²` },
              { label: "Bedrooms", value: apartment.bedrooms },
              { label: "Bathrooms", value: apartment.bathrooms },
              { label: "Price per m²", value: `$${apartment.sale_price}` },
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

            {/* Total Price */}
            <div className="flex justify-between items-center py-2 sm:py-3">
              <span className="text-gray-600 text-sm font-semibold">
                Total Price
              </span>
              <span
                className="text-lg sm:text-xl font-bold"
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-3 sm:mt-4 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

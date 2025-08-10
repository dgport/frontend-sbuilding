"use client";

import { useState } from "react";
import { Home, MapPin, ArrowDown, Car, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface Apartment {
  id: number;
  position: { top: string; right: string };
  mapPosition: { lat: number; lng: number };
}

export default function Cover() {
  const t = useTranslations("elysium");

  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [hoveredApartment, setHoveredApartment] = useState<number | null>(null);
  const [isFloorButtonHovered, setIsFloorButtonHovered] =
    useState<boolean>(false);
  const [isParkingButtonHovered, setIsParkingButtonHovered] =
    useState<boolean>(false);

  const apartments: Apartment[] = [
    {
      id: 4,
      position: { top: "15%", right: "20%" },
      mapPosition: { lat: 40.7831, lng: -73.9712 },
    },
  ];

  const handleApartmentClick = (apartment: Apartment): void => {
    setSelectedApartment(apartment);
  };

  const handleCloseModal = (): void => {
    setSelectedApartment(null);
  };

  const handleSelectFloorClick = (): void => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: "smooth",
    });
  };

  const handleSelectParkingClick = (): void => {
    window.scrollTo({
      top: window.innerHeight * 1.9,
      behavior: "smooth",
    });
  };

  const getResponsivePosition = (apartment: Apartment): React.CSSProperties => {
    const basePosition = apartment.position;
    return {
      top: basePosition.top,
      right: basePosition.right,
      transform: "translate(50%, -50%)",
    };
  };

  const renderApartmentMarker = (apartment: Apartment) => (
    <div
      key={apartment.id}
      className="absolute cursor-pointer"
      style={getResponsivePosition(apartment)}
      onMouseEnter={() => setHoveredApartment(apartment.id)}
      onMouseLeave={() => setHoveredApartment(null)}
      onClick={() => handleApartmentClick(apartment)}
    >
      <div
        className={`relative transition-all duration-300 ${
          hoveredApartment === apartment.id ? "scale-110" : ""
        }`}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-500 hover:border-blue-600 transition-colors">
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 hover:text-blue-600 transition-colors" />
        </div>
        <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );

  const renderActionButton = (
    onClick: () => void,
    isHovered: boolean,
    setIsHovered: (hovered: boolean) => void,
    icon: React.ReactNode,
    text: string,
    colorClass: string,
    animationDelay: string = ""
  ) => (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative w-68 md:w-auto flex justify-center overflow-hidden cursor-pointer ${colorClass} text-white px-6 py-3 rounded-full font-semibold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105`}
      style={{
        animation: `bounce 3s infinite ${animationDelay}`,
      }}
    >
      <div
        className={`absolute inset-0 ${colorClass
          .replace("600", "400")
          .replace(
            "700",
            "500"
          )} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}
      ></div>

      <div className="relative flex items-center space-x-2">
        <div
          className={`transition-transform duration-300 ${
            isHovered ? "scale-110 rotate-12" : ""
          }`}
        >
          {icon}
        </div>
        <span className="text-sm md:text-base font-bold">{text}</span>
        <ArrowDown
          className={`w-5 h-5 transition-all duration-300 ${
            isHovered ? "translate-y-1 scale-110" : ""
          }`}
        />
      </div>

      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
      <div
        className={`absolute -top-2 -right-2 w-4 h-4 ${colorClass
          .replace("gradient-to-r from-", "")
          .replace("-600 to-", "-300")
          .replace(
            "-700",
            ""
          )} rounded-full animate-pulse opacity-0 group-hover:opacity-100 delay-100`}
      ></div>
      <div
        className={`absolute -bottom-2 -left-2 w-3 h-3 ${colorClass
          .replace("gradient-to-r from-", "")
          .replace("-600 to-", "-400")
          .replace(
            "-700",
            ""
          )} rounded-full animate-pulse opacity-0 group-hover:opacity-100 delay-200`}
      ></div>
    </button>
  );

  const renderMapModal = () => {
    if (!selectedApartment) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
          </button>

          <div className="w-full h-120 border-4 rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d801.9119219158479!2d41.6012139!3d41.6251961!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406785eb972e2133%3A0x10e08f6aeee10c9f!2s3%20Grigol%20Lortkipanidze%20St%2C%20Batumi!5e0!3m2!1sen!2sge!4v1753530916738!5m2!1sen!2sge"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Property Location"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <div
        className="relative w-full flex-1 bg-cover bg-center md:bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/elisium/Image2.avif')`,
          minHeight: "100vh",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-normal text-white mb-8 mt-36 sm:mt-48 drop-shadow-lg font-geo2">
            {t("mainTitle")}
          </h1>
        </div>
        <div className="relative z-20 mt-28 md:mt-40 w-full h-full">
          {apartments.map(renderApartmentMarker)}
        </div>
        <div className="absolute flex flex-col gap-6 md:flex-row w-full items-center justify-center bottom-40 left-1/2 transform -translate-x-1/2 z-30 space-x-4">
          {renderActionButton(
            handleSelectFloorClick,
            isFloorButtonHovered,
            setIsFloorButtonHovered,
            <Home className="w-5 h-5" />,
            t("selectFloor"),
            "bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-blue-500/25"
          )}

          {renderActionButton(
            handleSelectParkingClick,
            isParkingButtonHovered,
            setIsParkingButtonHovered,
            <Car className="w-5 h-5" />,
            t("selectParking"),
            "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-green-500/25",
            "0.5s"
          )}
        </div>
      </div>
      {renderMapModal()}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translateY(0);
            }
            40%, 43% {
              transform: translateY(-15px);
            }
            70% {
              transform: translateY(-8px);
            }
            90% {
              transform: translateY(-3px);
            }
          }
        `,
        }}
      />
    </div>
  );
}

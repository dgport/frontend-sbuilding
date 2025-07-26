"use client";

import React, { useState, JSX } from "react";
import { Home, MapPin, ArrowDown, Car } from "lucide-react";

interface Apartment {
  id: number;
  name: string;
  position: { top: string; right: string };
  mapPosition: { lat: number; lng: number };
  address: string;
}

export default function Cover(): JSX.Element {
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
      name: "Elisium Location",
      position: { top: "15%", right: "20%" },
      mapPosition: { lat: 40.7831, lng: -73.9712 },
      address: "Elisium Location",
    },
  ];

  const handleApartmentClick = (apartment: Apartment): void => {
    setSelectedApartment(apartment);
  };

  const handleSelectFloorClick = (): void => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const handleSelectParkingClick = (): void => {
    window.scrollTo({
      top: window.innerHeight * 1.5,
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

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <div
        className="relative w-full flex-1 bg-cover bg-center md:bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/elisium/Image2.avif')`,
          minHeight: "100vh",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center mt-24 px-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-8 mt-20 sm:mt-40 drop-shadow-lg">
            Find Your Dream
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Apartment
            </span>
          </h1>
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 sm:px-8 py-3 sm:py-4 mb-16">
            <div className="flex items-center space-x-4 sm:space-x-8 text-white">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold">500+</div>
                <div className="text-xs sm:text-sm opacity-80">
                  Available Units
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold">4.8</div>
                <div className="text-xs sm:text-sm opacity-80">
                  Average Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold">24/7</div>
                <div className="text-xs sm:text-sm opacity-80">Support</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-20 w-full h-full">
          {apartments.map((apartment) => (
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
          ))}
        </div>

        <div className="absolute flex flex-col gap-6 md:flex-row w-full items-center justify-center bottom-8 left-1/2 transform -translate-x-1/2 z-30 space-x-4">
          <button
            onClick={handleSelectFloorClick}
            onMouseEnter={() => setIsFloorButtonHovered(true)}
            onMouseLeave={() => setIsFloorButtonHovered(false)}
            className="group relative w-auto overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            style={{
              animation: "bounce 3s infinite",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>

            <div className="relative flex items-center cursor-pointer space-x-2">
              <Home
                className={`w-5 h-5 transition-transform duration-300 ${
                  isFloorButtonHovered ? "scale-110 rotate-12" : ""
                }`}
              />
              <span className="text-sm md:text-base font-bold">
                Select Your Floor
              </span>
              <ArrowDown
                className={`w-5 h-5 transition-all duration-300 ${
                  isFloorButtonHovered ? "translate-y-1 scale-110" : ""
                }`}
              />
            </div>

            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>

            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-300 rounded-full animate-pulse opacity-0 group-hover:opacity-100 delay-100"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 delay-200"></div>
          </button>

          <button
            onClick={handleSelectParkingClick}
            onMouseEnter={() => setIsParkingButtonHovered(true)}
            onMouseLeave={() => setIsParkingButtonHovered(false)}
            className="group w-auto cursor-pointer relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            style={{
              animation: "bounce 3s infinite 0.5s",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-2">
              <Car
                className={`w-5 h-5 transition-transform duration-300 ${
                  isParkingButtonHovered ? "scale-110 rotate-12" : ""
                }`}
              />
              <span className="text-sm md:text-base font-bold">
                Select Parking
              </span>
              <ArrowDown
                className={`w-5 h-5 transition-all duration-300 ${
                  isParkingButtonHovered ? "translate-y-1 scale-110" : ""
                }`}
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-300 rounded-full animate-pulse opacity-0 group-hover:opacity-100 delay-100"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 delay-200"></div>
          </button>
        </div>
      </div>
      {selectedApartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedApartment.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedApartment(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold px-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="w-full h-96 border rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d801.9119219158479!2d41.6012139!3d41.6251961!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406785eb972e2133%3A0x10e08f6aeee10c9f!2s3%20Grigol%20Lortkipanidze%20St%2C%20Batumi!5e1!3m2!1sen!2sge!4v1753530916738!5m2!1sen!2sge"
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
        </div>
      )}
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

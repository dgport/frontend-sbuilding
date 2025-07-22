"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  Home,
  MapPin,
  Star,
  ArrowDown,
  Phone,
  Calendar,
  Heart,
  Car,
} from "lucide-react";

interface Apartment {
  id: number;
  name: string;
  price: string;
  location: string;
  rating: number;
  image: string;
  position: { top: string; right: string };
  mapPosition: { lat: number; lng: number };
  address: string;
}

interface MapProps {
  apartment: Apartment;
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
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const apartments: Apartment[] = [
    {
      id: 4,
      name: "Penthouse Suite",
      price: "$3,500/month",
      location: "Uptown",
      rating: 4.7,
      image: "/images/elisiuem/Image4.avif",
      position: { top: "15%", right: "20%" },
      mapPosition: { lat: 40.7831, lng: -73.9712 },
      address: "123 Park Avenue, Uptown District",
    },
  ];

  const handleApartmentClick = (apartment: Apartment): void => {
    setSelectedApartment(apartment);
  };

  const handleSelectFloorClick = (): void => {
    // Smooth scroll to next section or viewport height
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const handleSelectParkingClick = (): void => {
    // Smooth scroll to parking section or viewport height * 1.5
    window.scrollTo({
      top: window.innerHeight * 1.5,
      behavior: "smooth",
    });
  };

  // Interactive Map Component (replacing Leaflet)
  const InteractiveMapView: React.FC<MapProps> = () => {
    const [zoom, setZoom] = useState<number>(15);

    const handleZoomIn = (): void => {
      setZoom((prev) => Math.min(prev + 1, 20));
    };

    const handleZoomOut = (): void => {
      setZoom((prev) => Math.max(prev - 1, 1));
    };

    const handleWheel = (e: React.WheelEvent): void => {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    };

    const handleMouseDown = (): void => {
      // Handle mouse down for dragging if needed
    };

    const handleMouseUp = (): void => {
      // Handle mouse up for dragging if needed
    };

    const handleMouseLeave = (): void => {
      // Handle mouse leave for dragging if needed
    };

    useEffect(() => {
      setIsMapLoaded(true);
    }, []);

    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-blue-50">
        {/* Map Background */}
        <div
          className="w-full h-full relative cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #3b82f6 1px, transparent 1px),
                linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
              `,
              backgroundSize: `${zoom * 2}px ${zoom * 2}px`,
            }}
          />

          {/* Streets */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
            <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
          </div>

          {/* Buildings */}
          <div className="absolute inset-0">
            <div className="absolute top-1/6 left-1/6 w-16 h-16 bg-gray-300 rounded shadow-lg"></div>
            <div className="absolute top-1/3 left-2/3 w-12 h-20 bg-gray-300 rounded shadow-lg"></div>
            <div className="absolute top-2/3 left-1/4 w-14 h-12 bg-gray-300 rounded shadow-lg"></div>
            <div className="absolute top-3/4 left-3/4 w-10 h-16 bg-gray-300 rounded shadow-lg"></div>
          </div>

          {/* Property Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
            </div>
          </div>

          {/* Radius Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="border-2 border-red-400 border-dashed rounded-full opacity-50"
              style={{
                width: `${zoom * 8}px`,
                height: `${zoom * 8}px`,
              }}
            />
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
            >
              +
            </button>
            <div className="border-t border-gray-200"></div>
            <button
              onClick={handleZoomOut}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
            >
              −
            </button>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-lg text-sm font-medium">
            Zoom: {zoom}
          </div>
        </div>

        {/* Loading State */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-500">Loading map...</div>
          </div>
        )}
      </div>
    );
  };

  // Get responsive position based on screen size
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
        <div className="relative z-10 text-center pt-16 px-4">
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
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">{selectedApartment.address}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApartment(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold px-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Property Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-blue-600">
                        {selectedApartment.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold">
                        {selectedApartment.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">
                          {selectedApartment.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Tour</span>
                    </button>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Contact Agent</span>
                    </button>
                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Save Property</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full h-96 border rounded-xl">
                <InteractiveMapView apartment={selectedApartment} />
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

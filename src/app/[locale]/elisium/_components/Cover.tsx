"use client";

import React, { useState, useEffect, useRef, JSX } from "react";
import {
  Home,
  MapPin,
  Star,
  Building,
  ArrowDown,
  Phone,
  Calendar,
  Heart,
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
  const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);

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

  // Interactive Map Component (replacing Leaflet)
  const InteractiveMapView: React.FC<MapProps> = ({ apartment }) => {
    const [zoom, setZoom] = useState<number>(15);
    const [center, setCenter] = useState<{ lat: number; lng: number }>(
      apartment.mapPosition
    );
    const [isDragging, setIsDragging] = useState<boolean>(false);

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

    useEffect(() => {
      setIsMapLoaded(true);
    }, []);

    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-blue-50">
        {/* Map Background */}
        <div
          className="w-full h-full relative cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
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
                <Home className="w-4 h-4 text-white" />
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
      {/* Background Image Section */}
      <div
        className="relative w-full flex-1 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/elisium/Image2.avif')`,
          minHeight: "100vh",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Header */}
        <div className="relative z-10 text-center pt-16 px-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-8 mt-20 sm:mt-40 drop-shadow-lg">
            Find Your Dream
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              {" "}
              Apartment
            </span>
          </h1>

          {/* Stats Bar */}
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

        {/* Interactive Apartment Markers */}
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
              {/* Apartment Marker */}
              <div
                className={`relative transition-all duration-300 ${
                  hoveredApartment === apartment.id ? "scale-110" : ""
                }`}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-500 hover:border-blue-600 transition-colors">
                  <Home className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 hover:text-blue-600 transition-colors" />
                </div>

                {/* Pulse Animation */}
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full animate-ping opacity-20"></div>

                {/* Apartment Info Card */}
                {hoveredApartment === apartment.id && (
                  <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 w-56 sm:w-64 opacity-100 transition-opacity duration-300 z-50">
                    <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 flex items-center justify-center">
                      <Home className="w-12 h-12 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {apartment.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{apartment.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold">
                        {apartment.price}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm">{apartment.rating}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Select Floor Button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={handleSelectFloorClick}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 animate-bounce"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>

            {/* Button content */}
            <div className="relative flex items-center space-x-3">
              <Building
                className={`w-6 h-6 transition-transform duration-300 ${
                  isButtonHovered ? "scale-110 rotate-12" : ""
                }`}
              />
              <span className="text-xl font-bold">Select Your Floor</span>
              <ArrowDown
                className={`w-6 h-6 transition-all duration-300 ${
                  isButtonHovered ? "translate-y-1 scale-110" : ""
                }`}
              />
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>

            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-300 rounded-full animate-pulse opacity-0 group-hover:opacity-100 delay-100"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-0 group-hover:opacity-100 delay-200"></div>
          </button>
        </div>
      </div>

      {/* Selected Apartment Modal */}
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

              {/* Apartment Details */}
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

              {/* Interactive Map */}
              <div className="w-full h-96 border rounded-xl">
                <InteractiveMapView apartment={selectedApartment} />
              </div>

              {/* Map Instructions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Map Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use the + and - buttons to zoom in/out</li>
                  <li>• Scroll wheel to zoom</li>
                  <li>
                    • The red circle shows a 500m radius around the property
                  </li>
                  <li>• Red marker indicates the exact property location</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

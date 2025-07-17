// "use client";

// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useCallback,
//   useMemo,
// } from "react";
// import DesktopImage from "@/root/public/images/elisium/DesktopImage.avif";
// import Image from "next/image";
// import { useMediaQuery } from "@/use-media-query";
// import { FloorOverlay } from "@/components/shared/overlay/FloorOverlay";
// import { useRouter } from "next/navigation";
// import { desktopAreas } from "@/constants/coordinants/statusFloorCoord";

// import { useFloorStore } from "@/zustand/floorStore";
// import Loader from "@/components/shared/loader/Loader";
// import { useTranslations } from "next-intl";

// const ORIGINAL_IMAGE_WIDTH = 6000;
// const MOBILE_IMAGE_WIDTH = 1505;

// const MemoizedFloorOverlay = React.memo(
//   FloorOverlay,
//   (prevProps, nextProps) => {
//     return (
//       prevProps.flatId === nextProps.flatId &&
//       prevProps.hoveredApartment === nextProps.hoveredApartment &&
//       prevProps.scaleFactor === nextProps.scaleFactor &&
//       JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
//     );
//   }
// );
// MemoizedFloorOverlay.displayName = "MemoizedFloorOverlay";

// export default function SelectParking() {
//   const t = useTranslations("status");
//   const [hoveredApartment, setHoveredApartment] = useState<number | null>(null);
//   const [scaleFactor, setScaleFactor] = useState<number>(1);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [imageLoaded, setImageLoaded] = useState<boolean>(false);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const router = useRouter();

//   const { setBuildingContext, setCurrentFloor } = useFloorStore();

//   const updateScaleFactor = useCallback(() => {
//     if (imageRef.current) {
//       const currentImageWidth = imageRef.current.clientWidth;
//       const baseWidth = isMobile ? MOBILE_IMAGE_WIDTH : ORIGINAL_IMAGE_WIDTH;
//       setScaleFactor(currentImageWidth / baseWidth);
//     }
//   }, [isMobile]);

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;
//     const debouncedUpdate = () => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(updateScaleFactor, 100);
//     };

//     const resizeObserver = new ResizeObserver(debouncedUpdate);

//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current);
//     }

//     window.addEventListener("resize", debouncedUpdate);

//     return () => {
//       clearTimeout(timeoutId);
//       if (containerRef.current) {
//         resizeObserver.unobserve(containerRef.current);
//       }
//       resizeObserver.disconnect();
//       window.removeEventListener("resize", debouncedUpdate);
//     };
//   }, [updateScaleFactor]);

//   const handleFloorClick = useCallback(
//     (floorId: number) => {
//       const buildingId = 3;
//       const floorPlanId = 6;

//       setIsLoading(true);

//       setBuildingContext(buildingId.toString(), floorPlanId.toString());
//       setCurrentFloor(floorId);

//       setTimeout(() => {
//         router.push(`/aisi-status/${buildingId}/${floorPlanId}`);
//       }, 300);
//     },
//     [router, setBuildingContext, setCurrentFloor]
//   );

//   const handleImageLoad = useCallback(() => {
//     setImageLoaded(true);
//     updateScaleFactor();

//     setTimeout(() => {
//       setIsLoading(false);
//     }, 100);
//   }, [updateScaleFactor]);

//   const stableSetHoveredApartment = useCallback((id: number | null) => {
//     setHoveredApartment(id);
//   }, []);

//   const currentAreas = useMemo(() => desktopAreas, []);

//   return (
//     <section
//       id="select-floor"
//       className="px-4 md:px-8 lg:px-40 py-10 bg-white min-h-screen font-geo2 tracking-widest"
//     >
//       <div className="container2">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl md:text-4xl  font-semibold text-gray-900 mb-4">
//             {t("selectFloor")}
//           </h1>
//         </div>
//         <div ref={containerRef} className="relative w-full">
//           <div className="relative w-full bg-gray-50 rounded-lg border-3 border-slate-500 overflow-hidden">
//             {isLoading && <Loader />}

//             <Image
//               ref={imageRef}
//               src={DesktopImage || "/placeholder.svg"}
//               alt="Floor plan image"
//               className={`w-full h-auto transition-opacity duration-300 ${
//                 isLoading ? "opacity-60" : ""
//               }`}
//               priority
//               quality={100}
//               unoptimized={false}
//               sizes="(max-width: 768px) 100vw, 100vw"
//               style={{
//                 objectFit: "contain",
//                 objectPosition: "center",
//                 maxWidth: "100%",
//                 height: "auto",
//               }}
//               onLoad={handleImageLoad}
//             />

//             {imageLoaded &&
//               !isLoading &&
//               currentAreas.map((area) => (
//                 <MemoizedFloorOverlay
//                   key={area.id}
//                   flatId={area.id}
//                   flatNumber={area.id}
//                   coords={area.coords}
//                   hoveredApartment={hoveredApartment}
//                   setHoveredApartment={stableSetHoveredApartment}
//                   handleFloorClick={() => handleFloorClick(area.id)}
//                   scaleFactor={scaleFactor}
//                 />
//               ))}

//             {hoveredApartment && imageLoaded && !isLoading && (
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white  text-6xl md:text-8xl opacity-70 pointer-events-none z-20 drop-shadow-lg">
//                 {hoveredApartment}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

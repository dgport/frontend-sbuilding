"use client";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CardContent } from "@/components/ui/card";
import Image1 from "@/root/public/images/projects/elisium.jpg";
import Image2 from "@/root/public/images/projects/house-abashidze.png";
import Image3 from "@/root/public/images/projects/house-bagrationi.png";
import Image4 from "@/root/public/images/projects/house-sulaberidze.png";
import Image5 from "@/root/public/images/projects/your-space.png";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ProjectsSection() {
  const navigate = useRouter();

  const data = [
    {
      img: Image1,
      alt: "Elisium",
      title: "Elisium",
      status: "available",
      description: "",
      id: "elisium",
    },
    {
      img: Image2,
      alt: "House on Abashidze",
      title: "House on Abashidze",
      status: "sold-out",
      description: "Completed",
      id: "House on Abashidze",
    },
    {
      img: Image3,
      alt: "House on Bagrationi",
      title: "BHouse on Bagrationi",
      status: "sold-out",
      description: "Completed",
      id: "House on Bagrationi",
    },
    {
      img: Image4,
      alt: "House on Sulaberidze",
      title: "House on Sulaberidze",
      status: "sold-out",
      description: "Completed",
      id: "House on Sulaberidze",
    },
    {
      img: Image5,
      alt: "Your Space",
      title: "Your Space",
      status: "sold-out",
      description: "Completed",
      id: "your-space",
    },
  ];

  const handleElisiumClick = () => {
    navigate.push("/elisium");
  };

  const handleProjectClick = (projectId: string) => {
    if (projectId === "elisium") {
      navigate.push("/elisium");
    }
  };

  return (
    <section className="h-auto w-full md:py-16 relative overflow-hidbden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="construction-grid"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                />
                <rect
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.3"
                />
                <circle cx="10" cy="10" r="2" fill="#1e40af" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#construction-grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <div className="mb-10 flex flex-col justify-center gap-6 px-10 md:flex-row md:gap-20">
          <div className="flex flex-col items-center gap-4 md:gap-6 md:w-[400px]">
            <p className="text-sm md:text-base"> </p>
            <h1 className="text-2xl md:text-4xl   font-extrabold font-geo2 pt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-600 to-blue-400 tracking-wide uppercase drop-shadow-md">
              Our Projects
            </h1>
            <div className="mt-2 h-1 w-48 md:w-80 bg-gradient-to-r from-blue-500 via-blue-300 to-transparent rounded-full"></div>
          </div>
        </div>

        <Carousel opts={{ loop: true }}>
          <CarouselContent className=" md:pr-10 xl:pr-32">
            {data.map((item, index) => (
              <CarouselItem key={index} className="md:basis-2/3 px-4">
                <CardContent className="flex items-center justify-center md:p-0 pr-0 pl-4">
                  <div
                    className={`relative group overflow-hidden rounded-lg shadow-2xl ${
                      item.id === "elisium" ? "cursor-pointer" : ""
                    }`}
                    onClick={() => handleProjectClick(item.id)}
                  >
                    <Image
                      src={item.img || "/placeholder.svg"}
                      alt={item.alt}
                      className={`h-[300px] w-full object-cover md:h-[540px] md:w-[800px] transition-all duration-700 group-hover:scale-105 ${
                        item.status === "sold-out"
                          ? "grayscale-[30%] opacity-80"
                          : ""
                      }`}
                      width={800}
                      height={540}
                    />

                    <div className="absolute top-4 left-4 z-20">
                      {item.status === "available" ? (
                        <Badge className="bg-green-500/90 hover:bg-green-500 text-white border-0 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                          AVAILABLE
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/90 hover:bg-red-500 text-white border-0 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                          SOLD OUT
                        </Badge>
                      )}
                    </div>

                    {item.status === "sold-out" && (
                      <Badge className="absolute top-8 -right-12 bg-red-600/90 text-white px-12 py-2 text-sm font-bold transform rotate-45 shadow-lg z-10">
                        COMPLETED
                      </Badge>
                    )}

                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        item.status === "sold-out"
                          ? "from-black/90 via-black/40 to-transparent"
                          : "from-black/80 via-black/20 to-transparent"
                      }`}
                    />

                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/30" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="space-y-2 md:space-y-3">
                        <h3 className="text-white text-2xl md:text-4xl font-bold tracking-wide leading-tight">
                          <span className="inline-block relative">
                            {item.title}
                            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-white via-white/60 to-transparent" />
                          </span>
                        </h3>
                        <p className="text-white/80 text-sm md:text-base">
                          {item.description}
                        </p>
                        {item.status === "available" && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-300 text-sm font-medium">
                              Now Available
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -top-2 left-6 w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    </div>

                    <div
                      className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                        item.status === "sold-out"
                          ? "from-red-900/20 to-transparent opacity-0 group-hover:opacity-100"
                          : "from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </CardContent>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className=" left-4 md:left-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="right-4 md:right-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
        </Carousel>

        <div className="md:mt-12  mt-8 text-center px-10">
          <button
            onClick={handleElisiumClick}
            className="inline-flex items-center gap-3 bg-blue-500 from-blue-400 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm md:text-base">
              Elisium - Available Now!
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

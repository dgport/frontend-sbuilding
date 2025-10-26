"use client";
import Image from "next/image";
import { memo, useCallback } from "react";
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
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const BackgroundPattern = memo(() => (
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
));

BackgroundPattern.displayName = "BackgroundPattern";

// Memoized Project Card
const ProjectCard = memo(({ item, onProjectClick, t }: any) => {
  const handleClick = useCallback(() => {
    if (item.id === "elisium") {
      onProjectClick(item.id);
    }
  }, [item.id, onProjectClick]);

  return (
    <div
      className={`relative group overflow-hidden rounded-lg shadow-2xl ${
        item.id === "elisium" ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <Image
        src={item.img || "/placeholder.svg"}
        alt={item.alt}
        className={`h-[300px] w-full object-cover md:h-[540px] md:w-[800px] transition-transform duration-700 will-change-transform ${
          item.status === "sold-out" ? "grayscale-[30%] opacity-80" : ""
        }`}
        width={800}
        height={540}
        loading="lazy"
        quality={85}
      />

      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-20">
        {item.status === "available" ? (
          <Badge className="bg-green-500/90 hover:bg-green-500 text-white border-0 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
            {t("available")}
          </Badge>
        ) : (
          <Badge className="bg-red-500/90 hover:bg-red-500 text-white border-0 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
            {t("sold_out")}
          </Badge>
        )}
      </div>

      {/* Completed Badge */}
      {item.status === "sold-out" && (
        <Badge className="absolute top-8 -right-12 bg-red-600/90 text-white px-12 py-2 text-sm font-bold transform rotate-45 shadow-lg z-10">
          {t("completed")}
        </Badge>
      )}

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
          item.status === "sold-out"
            ? "from-black/90 via-black/40 to-transparent"
            : "from-black/80 via-black/20 to-transparent"
        }`}
      />

      {/* Corner Decorations */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/30 pointer-events-none" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pointer-events-none">
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
                {t("now_available")}
              </span>
            </div>
          )}
        </div>
        <div className="absolute -top-2 left-6 w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 pointer-events-none ${
          item.status === "sold-out"
            ? "from-red-900/20 to-transparent opacity-0 group-hover:opacity-100"
            : "from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100"
        }`}
      />
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

export default function ProjectsSection() {
  const t = useTranslations("main");
  const navigate = useRouter();

  const data = [
    {
      img: Image1,
      alt: t("elisium_title"),
      title: t("elisium_title"),
      status: "available",
      description: "",
      id: "elisium",
    },
    {
      img: Image2,
      alt: t("house_abashidze_title"),
      title: t("house_abashidze_title"),
      status: "sold-out",
      description: t("project_completed"),
      id: "House on Abashidze",
    },
    {
      img: Image3,
      alt: t("house_bagrationi_title"),
      title: t("house_bagrationi_title"),
      status: "sold-out",
      description: t("project_completed"),
      id: "House on Bagrationi",
    },
    {
      img: Image4,
      alt: t("house_sulaberidze_title"),
      title: t("house_sulaberidze_title"),
      status: "sold-out",
      description: t("project_completed"),
      id: "House on Sulaberidze",
    },
    {
      img: Image5,
      alt: t("your_space_title"),
      title: t("your_space_title"),
      status: "sold-out",
      description: t("project_completed"),
      id: "your-space",
    },
  ];

  const handleElisiumClick = useCallback(() => {
    navigate.push("/elisium");
  }, [navigate]);

  const handleProjectClick = useCallback(
    (projectId: string) => {
      if (projectId === "elisium") {
        navigate.push("/elisium");
      }
    },
    [navigate]
  );

  return (
    <section className="h-auto w-full md:py-16 relative overflow-hidden">
      <BackgroundPattern />

      <div className="relative z-10">
        <div className="mb-10 flex flex-col justify-center gap-6 px-10 md:flex-row md:gap-20">
          <div className="flex flex-col items-center gap-4 md:gap-6 md:w-[400px]">
            <h1 className="text-2xl md:text-4xl font-extrabold font-geo2 pt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-600 to-blue-400 tracking-wide uppercase drop-shadow-md">
              {t("our_projects")}
            </h1>
            <div className="mt-2 h-1 w-48 md:w-80 bg-gradient-to-r from-blue-500 via-blue-300 to-transparent rounded-full"></div>
          </div>
        </div>

        <Carousel opts={{ loop: true }}>
          <CarouselContent className="md:pr-10 xl:pr-32">
            {data.map((item) => (
              <CarouselItem key={item.id} className="md:basis-2/3 px-4">
                <CardContent className="flex items-center justify-center md:p-0 pr-0 pl-4">
                  <ProjectCard
                    item={item}
                    onProjectClick={handleProjectClick}
                    t={t}
                  />
                </CardContent>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 md:left-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors" />
          <CarouselNext className="right-4 md:right-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors" />
        </Carousel>

        <div className="md:mt-12 mt-8 text-center px-10">
          <Button
            onClick={handleElisiumClick}
            className="inline-flex cursor-pointer items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm md:text-base">
              {t("elisium_available_now")}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}

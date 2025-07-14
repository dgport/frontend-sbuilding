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

export default function Hotel() {
  const data = [
    {
      img: Image1,
      alt: "Elisium Hotel",
      title: "Elisium Building",
    },
    {
      img: Image2,
      alt: "House Abashidze",
      title: "Abashidze Building",
    },
    {
      img: Image3,
      alt: "House Bagrationi",
      title: "Bagrationi Building",
    },
    {
      img: Image4,
      alt: "House Sulaberidze",
      title: "Sulaberidze Building",
    },
    {
      img: Image5,
      alt: "Your Space",
      title: "Your Space Building",
    },
  ];

  return (
    <section className="h-auto w-full py-16 relative overflow-hidden">
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
          <h1>
            <br />
          </h1>
          <div className="flex flex-col items-start gap-6 md:w-[400px]">
            <p className="text-sm md:text-base "> </p>
            <h1 className="text-3xl md:text-4xl font-extrabold font-geo2 pt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-600 to-blue-400 tracking-wide uppercase drop-shadow-md">
              Our Projects
            </h1>
            <div className="mt-2 h-1 w-24 md:w-80 bg-gradient-to-r from-blue-500 via-blue-300 to-transparent rounded-full"></div>
          </div>
        </div>

        <Carousel opts={{ loop: true }}>
          <CarouselContent className="pr-16 md:pr-10 xl:pr-32">
            {data.map((item, index) => (
              <CarouselItem key={index} className="md:basis-2/3">
                <CardContent className="flex items-center justify-center p-0">
                  <div className="relative group overflow-hidden rounded-lg shadow-2xl">
                    <Image
                      src={item.img || "/placeholder.svg"}
                      alt={item.alt}
                      className="h-[300px] w-full object-cover md:h-[540px] md:w-[800px] transition-transform duration-700 group-hover:scale-105"
                      width={800}
                      height={540}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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
                      </div>
                      <div className="absolute -top-2 left-6 w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </CardContent>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-10 w-16 h-16 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="right-10 w-16 h-16 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
        </Carousel>
      </div>
    </section>
  );
}

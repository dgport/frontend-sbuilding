import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Image1 from "@/root/public/images/goderdzi/GoderdziGreen.jpg";
import Image2 from "@/root/public/images/goderdzi/GoderdziNature.jpg";
import Image3 from "@/root/public/images/goderdzi/GoderdziPool.jpg";
import { WaveShape } from "@/components/shared/waveShape/WaveShape";

const propertyImages = [
  { src: Image1, alt: "AISI Goderdzi" },
  { src: Image2, alt: "AISI Goderdzi" },
  { src: Image3, alt: "AISI Goderdzi" },
  { src: Image1, alt: "AISI Goderdzi" },
  { src: Image2, alt: "AISI Goderdzi" },
];

export default function GoderdziGallery() {
  return (
    <div className="relative w-full">
      <WaveShape position="top" className="hidden md:block" />
      <section className="w-full px-4 md:px-8 lg:px-16 py-16 md:py-32 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative">
        <div className="container mx-auto">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {propertyImages.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 h-80">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative h-full overflow-hidden rounded-2xl">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 33vw"
                        priority={index < 2}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:-left-4 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white transition-all duration-200" />
            <CarouselNext className="right-2 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white transition-all duration-200" />
          </Carousel>
        </div>
      </section>

      <WaveShape position="bottom" className="hidden md:block" />
    </div>
  );
}
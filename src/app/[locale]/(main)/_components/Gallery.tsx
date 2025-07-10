"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WaveShape } from "@/components/shared/waveShape/WaveShape";
import { useTranslations } from "next-intl";
import background from "@/root/public/images/bg2.png";
import image1 from "@/root/public/images/main/Batumi2.jpeg";
import image2 from "@/root/public/images/main/Batumi1.jpeg";
import image3 from "@/root/public/images/main/Batumi3.jpg";

const images = [
  {
    id: 0,
    src: image1,
    alt: "Panoramic view",
  },
  {
    id: 1,
    src: image3,
    alt: "Amenities area",
  },
  {
    id: 2,
    src: image2,
    alt: "Luxury features",
  },
];

export default function Gallery() {
  const t = useTranslations("main");
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full overflow-hidden  bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <WaveShape position="top" className="block" />
      <section
        style={{ backgroundImage: `url(${background})` }}
        className="w-full relative py-10 sm:py-8 md:py-32 overflow-hidden bg-none md:bg-cover"
      >
        <div className="flex flex-col w-full items-center relative z-20">
          <div className="block lg:hidden w-full px-2 sm:px-4">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl font-geo2  font-medium z-50 text-white mb-2">
                {t("yourPlace")}
              </h2>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {images.map((image) => (
                    <div key={image.id} className="w-full flex-shrink-0">
                      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-900/50 via-slate-800/40 to-blue-950/60 backdrop-blur-2xl border-2 border-blue-700/30 shadow-xs shadow-blue-900/50 mx-1 sm:mx-2">
                        <div className="relative h-[280px] xs:h-[320px] sm:h-[380px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden w-full m-1 sm:m-2 border border-blue-700/20">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/90 z-10"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent z-10"></div>
                          <Image
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-blue-900/60 hover:bg-blue-800/70 text-white p-2 sm:p-3 rounded-full shadow-xs transition-all duration-300 z-30"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-blue-900/60 hover:bg-blue-800/70 text-white p-2 sm:p-3 rounded-full shadow-xs transition-all duration-300 z-30"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-blue-500 scale-125"
                        : "bg-blue-700/40 hover:bg-blue-600/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block container px-4 md:px-8 xl:px-16">
            <div className="relative h-[660px] mt-8">
              <motion.div
                initial={{ opacity: 0, x: -50, y: 50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="absolute top-[60px] xl:top-0 left-0 w-[280px] md:w-[320px] lg:w-[450px] xl:w-[450px] z-10 group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/50 via-slate-800/40 to-blue-950/60 backdrop-blur-2xl border-2 border-blue-700/30 shadow-2xl shadow-blue-900/50 hover:border-blue-600/40 hover:shadow-blue-800/60 transition-all duration-700 ease-out hover:scale-[1.05] hover:-translate-y-4 transform-gpu">
                  <div className="relative h-[280px] md:h-[320px] lg:h-[420px] rounded-2xl overflow-hidden w-full m-2 border border-blue-700/20">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/90 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent z-10"></div>
                    <Image
                      src={images[0].src || "/placeholder.svg"}
                      alt={images[0].alt}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50, y: 50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-[60px] xl:top-0 right-0 w-[280px] md:w-[320px] lg:w-[450px] xl:w-[450px] z-10 group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/50 via-slate-800/40 to-blue-950/60 backdrop-blur-2xl border-2 border-blue-700/30 shadow-2xl shadow-blue-900/50 hover:border-blue-600/40 hover:shadow-blue-800/60 transition-all duration-700 ease-out hover:scale-[1.05] hover:-translate-y-4 transform-gpu">
                  <div className="relative h-[280px] md:h-[320px] lg:h-[420px] rounded-2xl overflow-hidden w-full m-2 border border-blue-700/20">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/90 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent z-10"></div>
                    <Image
                      src={images[1].src || "/placeholder.svg"}
                      alt={images[1].alt}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-[50px]  left-1/2 transform -translate-x-1/2 z-20 text-center"
              >
                <h2 className="font-geo2 text-2xl md:text-3xl lg:text-4xl xl:leading-[4rem] font-medium text-white">
                  <span>{t("place1")}</span>
                  <span className="hidden 2xl:inline">
                    <br />
                  </span>
                  <span>{t("place2")}</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute top-[260px] xl:top-[200px] left-1/2 transform -translate-x-1/2 w-[240px] md:w-[280px] lg:w-[380px] z-15 group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/50 via-slate-800/40 to-blue-950/60 backdrop-blur-2xl border-2 border-blue-700/30 shadow-2xl shadow-blue-900/50 hover:border-blue-600/40 hover:shadow-blue-800/60 transition-all duration-700 ease-out hover:scale-[1.05] hover:-translate-y-4 transform-gpu">
                  <div className="relative h-[240px] md:h-[280px] lg:h-[360px] rounded-2xl overflow-hidden w-full m-2 border border-blue-700/20">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/90 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent z-10"></div>
                    <Image
                      src={images[2].src || "/placeholder.svg"}
                      alt={images[2].alt}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <WaveShape position="bottom" className="hidden md:block" />
    </div>
  );
}
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/use-media-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import img from "@/root/public/images/goderdzi/MainCover1.jpg";
import img1 from "@/root/public/images/main/Project2.png";
import img3 from "@/root/public/images/main/Project3.png";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import overlay from "@/root/public/images/low-angle-view-modern-ceiling.jpg";
import { WaveShape } from "@/components/shared/waveShape/WaveShape";

export default function ProjectsCarousel() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const t = useTranslations("main");

  const projectsData = [
    {
      id: 1,
      title: t("aisiBatumi"),
      location: t("adjaraBatumi"),
      image: img1,
      address: "/aisi-batumi",
    },
    {
      id: 2,
      title: t("aisiGoderdzi"),
      location: t("adjaraGoderdzi"),
      image: img,
      address: "/aisi-goderdzi",
    },
    {
      id: 3,
      title: t("aisiStatus"),
      location: t("adjaraBatumi"),
      image: img3,
      address: "/aisi-status",
    },
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <section className="w-full py-10 md:py-20 relative pt-20 overflow-hidden border-y border-white">
        <div className="absolute inset-0">
          <Image
            src={overlay || "/placeholder.svg"}
            alt="Modern ceiling background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tb from-slate-900/90 via-blue-950/80 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-900/60 to-slate-950/90"></div>
          <div className="absolute inset-0 bg-blue-950/30"></div>
        </div>

        <div className="flex flex-col w-full items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 w-full px-6"
          >
            <div className="flex md:px-16 w-full justify-between md:justify-start items-center">
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "7rem", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-[2px] bg-gradient-to-r from-white/30 via-white/60 to-white/30 rounded-full mr-4 "
              ></motion.div>
              <h2 className="text-2xl font-geo2 w-full md:text-5xl font-normal tracking-widest text-white uppercase leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {t("ourProjects")}
              </h2>
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "7rem", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-[2px] bg-gradient-to-r from-white/30 via-white/60 to-white/30 rounded-full ml-4 "
              ></motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: false,
                slidesToScroll: 1,
                watchDrag: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-1 md:-ml-2 md:px-12 py-8">
                {projectsData.map((project) => (
                  <CarouselItem
                    key={project.id}
                    className={`px-6 md:px-5 ${
                      isMobile ? "basis-full" : "basis-1/3"
                    }`}
                  >
                    <div className="relative group w-full h-full">
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 via-slate-700/40 to-slate-900/60 backdrop-blur-2xl border-2 border-white/10  shadow-2xl hover:border-white/25 transition-all duration-700 ease-out hover:scale-[1.02] hover:-translate-y-3 transform-gpu">
                        <Link
                          href={project.address}
                          className="block w-full h-full"
                        >
                          <div className="relative h-80 sm:h-96 overflow-hidden rounded-2xl w-full m-2 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.1)]">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95 z-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10"></div>

                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              fill
                              priority
                              className={`object-cover transition-all duration-1000 ease-out group-hover:scale-105`}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent rounded-2xl -m-4 p-4"></div>

                                <div className="relative z-10">
                                  <h3 className="text-3xl font-geo2 md:text-4xl font-bold text-white mb-3 tracking-widest  group-hover:translate-x-2 transition-all duration-500  ">
                                    {project.title}
                                  </h3>
                                  <div className="flex items-center justify-between">
                                    <p className="text-white/95 font-geo2 text-lg font-medium tracking-widest">
                                      {project.location}
                                    </p>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-15px] group-hover:translate-x-0 bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20 shadow-[0_4px_16px_rgba(255,255,255,0.1)]">
                                      <ArrowRight className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute lg:hidden left-2 md:left-4 top-1/2 bg-blue-900/70 hover:bg-blue-800/80 text-white shadow-[0_12px_40px_rgba(30,58,138,0.4)] border-2 border-blue-700/40 hover:border-blue-600/60 h-12 w-12 md:h-14 md:w-14 transition-all duration-300 hover:shadow-[0_16px_50px_rgba(30,58,138,0.5)] backdrop-blur-xl rounded-full hover:scale-110" />
              <CarouselNext className="absolute right-2 lg:hidden md:right-4 top-1/2 bg-blue-900/70 hover:bg-blue-800/80 text-white shadow-[0_12px_40px_rgba(30,58,138,0.4)] border-2 border-blue-700/40 hover:border-blue-600/60 h-12 w-12 md:h-14 md:w-14 transition-all duration-300 hover:shadow-[0_16px_50px_rgba(30,58,138,0.5)] backdrop-blur-xl rounded-full hover:scale-110" />
            </Carousel>
          </motion.div>
        </div>
      </section>
      <WaveShape position="bottom" className=" block" />
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { StaticImageData } from "next/image";

interface Tag {
  text: string;
}

interface CoverSectionProps {
  images?: (StaticImageData | string)[];
  title?: string;
  subtitle?: string;
  description?: string;
  secondaryTitle?: string;
  secondaryDescription?: string;
  tags?: Tag[];
  slideInterval?: number;
  height: string;
}

export default function CoverSection({
  images = [],
  title = "AISI GROUP",
  subtitle,
  description = "Transforming spaces into exceptional living experiences since 2010",
  secondaryTitle,
  secondaryDescription,
  tags = [{ text: "LUXURY" }, { text: "MODERN" }, { text: "EXCLUSIVE" }],
  slideInterval = 7000,
  height,
}: CoverSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [images.length, slideInterval]);

  return (
    <motion.div
      className={`${height} relative w-full overflow-hidden px-6 lg:px-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900`}
    >
      {images.length > 0 && (
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={{
                opacity: currentImageIndex === index ? 1 : 0,
                scale: currentImageIndex === index ? 1 : 1.05,
              }}
              transition={{
                opacity: { duration: 1.5, ease: "easeInOut" },
                scale: { duration: 2, ease: "easeOut" },
              }}
            >
              <Image
                src={image || "/placeholder.svg"}
                className="object-cover w-full h-full"
                alt={`Cover image ${index + 1}`}
                fill
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-blue-950/10 to-slate-900/10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-slate-800/20 to-blue-950/20"></div>
              <div className="absolute inset-0 bg-blue-950/30"></div>
            </motion.div>
          ))}
        </div>
      )}
      <div className="relative z-20 h-full w-full max-w-7xl mx-auto">
        <div className="flex flex-col h-full justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-16 items-end md:items-center h-full pb-2">
            {(title || description || (tags && tags.length > 0)) && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-lg pt-10 lg:pt-0"
              >
                {title && (
                  <div className="mb-4 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "7rem" }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="h-[2px] bg-white/60 rounded-full mb-4"
                    />

                    <motion.h1
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-white font-geo2 text-4xl lg:text-5xl font-normal tracking-wider pt-2"
                    >
                      {title.split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          className={i > 0 ? "ml-2" : ""}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.h1>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "7rem" }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="h-[2px] bg-white/60 rounded-full mt-4 ml-auto"
                    />
                  </div>
                )}

                {subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-white/90 font-geo2 text-base lg:text-2xl   mt-2"
                  >
                    {subtitle}
                  </motion.p>
                )}

                {description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-white font-geo2 text-lg  lg:text-2xl mt-4"
                  >
                    {description}
                  </motion.p>
                )}
              </motion.div>
            )}
            {(secondaryTitle || secondaryDescription) && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-lg lg:ml-auto md:pt-8 lg:mt-0"
              >
                <div className="rounded-2xl bg-white/20 backdrop-blur-xs border border-white/20 p-6">
                  {secondaryTitle && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-xl lg:text-2xl text-center lg:text-start xl:text-4xl font-normal font-geo2 text-white mb-3 lg:mb-5"
                    >
                      {secondaryTitle}
                    </motion.h2>
                  )}

                  {secondaryDescription && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="text-white/90 mb-3 font-geo2 lg:mb-4 text-center lg:text-start text-base lg:text-xl tracking-wide"
                    >
                      {secondaryDescription}
                    </motion.p>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex mt-6 mb-10 gap-2 justify-center lg:justify-start">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          currentImageIndex === index
                            ? "bg-white w-8"
                            : "bg-white/50 w-2 hover:bg-white/70"
                        }`}
                        aria-label={`Show image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

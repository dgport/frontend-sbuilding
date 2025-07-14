"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import testImage from "@/root/public/images/test.png";

const HeroSection = () => {
  const backgroundImages = ["/images/8.jpg", "/images/8.jpg", "/images/8.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const goToNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % backgroundImages.length
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              transition: {
                opacity: { duration: 1.2, ease: "easeOut" },
                scale: { duration: 2.5, ease: [0.25, 1, 0.5, 1] },
                filter: { duration: 1.5, ease: "easeOut" },
              },
            }}
            exit={{
              opacity: 0,
              scale: 1.05,
              filter: "blur(4px)",
              transition: {
                duration: 1,
                ease: "easeIn",
              },
            }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            }}
          />
        </AnimatePresence>
      </div>

      <AnimatePresence>
        <>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.8, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={goToPrevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.8, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onClick={goToNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </>
      </AnimatePresence>

      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-2 rounded-full ${
              currentImageIndex === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 space-y-8 md:space-y-8 lg:space-y-10 z-10">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-2xl lg:text-4xl font-bold mb-2 text-blue-400/90 text-shadow-md tracking-widest font-kalam"
        >
          Building Tomorrow's Dreams!
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl md:text-4xl h-20 tracking-wider lg:tracking-widest lg:text-6xl text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
        >
          PREMIUM DEVELOPMENTS
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(59,130,246,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
            boxShadow: { duration: 0.3 },
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-base lg:text-xl text-white cursor-pointer font-kalam tracking-widest px-8 py-4 rounded-lg font-medium shadow-lg border border-blue-400/30"
        >
          View Our Projects
        </motion.button>
      </div>
    </div>
  );
};

export default HeroSection;

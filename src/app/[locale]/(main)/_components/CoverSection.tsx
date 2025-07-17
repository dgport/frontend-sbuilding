"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import img from "@/root/public/images/testimg.jpg";

const CoverSection = () => {
  const backgroundImages = ["/images/elisium/Image1.avif"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMobileCard, setShowMobileCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const springConfig = { stiffness: 400, damping: 40 };
  const rotateX = useSpring(0, springConfig);
  const rotateZ = useSpring(0, springConfig);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const goToNextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);

  const goToPrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? backgroundImages.length - 1 : prev - 1
    );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    rotateX.set(-(e.clientY - centerY) / 25);
    rotateZ.set((e.clientX - centerX) / 25);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateZ.set(0);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
            transition={{
              opacity: { duration: 1.2 },
              scale: { duration: 2.5 },
              filter: { duration: 1.5 },
            }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            }}
          />
        </AnimatePresence>
      </div>

      {/* Desktop Controls */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.8, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        onClick={goToPrevImage}
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30"
      >
        <svg
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
        onClick={goToNextImage}
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-blue-500/30"
      >
        <svg
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

      {/* Indicators */}
      <div className="hidden md:flex absolute bottom-40 left-1/2 -translate-x-1/2 space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-2 rounded-full ${
              currentImageIndex === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Mobile Text + CTA */}
      <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
        <motion.h1
          className="text-3xl font-bold mb-6 tracking-wider text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Sbuilding, your future apartment
        </motion.h1>
        <motion.button
          onClick={() => setShowMobileCard(!showMobileCard)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-lg text-white px-6 py-3 rounded-xl font-medium shadow-lg border border-blue-400/30 flex items-center gap-3"
        >
          Current project <ArrowRight size={20} />
        </motion.button>
      </div>

      {/* Mobile Card */}
      <AnimatePresence>
        {showMobileCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMobileCard(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm mx-auto"
            >
              <div className="relative w-full rounded-3xl shadow-2xl border border-white/30 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-blue-700/20 p-6 text-white">
                <div className="text-3xl mb-4">🏗️</div>
                <h1 className="text-xl font-bold mb-4 text-center tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Current project
                </h1>
                <Image
                  src={img}
                  alt="Project"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base px-5 py-2 rounded-xl shadow-lg flex items-center gap-3"
                  >
                    View Our Projects <ArrowRight size={20} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden absolute inset-0 md:flex items-center justify-between text-white px-12 z-10">
        <motion.div
          ref={cardRef}
          className="w-96 ml-32 relative"
          style={{ perspective: "1200px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="rounded-3xl shadow-2xl border border-white/30 backdrop-blur-xl overflow-hidden"
            style={{
              rotateX,
              rotateZ,
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.3), rgba(30,64,175,0.2))",
            }}
          >
            <div className="p-4 flex flex-col items-center text-white">
              <div className="text-3xl mb-2">🏗️</div>
              <h1 className="text-2xl font-bold mb-2 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Current project
              </h1>
              <Image
                src={img}
                alt="Project"
                className="w-full h-[70%] rounded-md"
              />
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white mt-4 text-lg px-5 py-2 rounded-xl flex items-center gap-3 shadow-lg"
                >
                  View Our Projects
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          className="mr-16 lg:mr-24 text-right max-w-xl"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <motion.h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/70 drop-shadow-[0_4px_20px_rgba(255,255,255,0.2)]">
            <span className="block">Sbuilding,</span>
            <span className="block mt-2">your future</span>
            <span className="block">apartment</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg lg:text-xl text-white/80 font-light tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Discover quality living spaces built with innovation, vision, and
            care.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default CoverSection;

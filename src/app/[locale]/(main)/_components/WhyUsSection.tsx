"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Home, Building2, SmilePlus, Clock } from "lucide-react";
import test from "@/root/public/images/main/low-angle-shot-modern-glass-city-buildings.jpg";
import { useTranslations } from "next-intl";
 

interface WhyUsProps {
  value: string;
  label: string;
  icon: ReactNode;
}

export default function WhyChooseUs() {
  const t = useTranslations("main");

  const Counter = ({ value, label, icon }: WhyUsProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (isInView) {
        let start = 0;
        const end = Number.parseInt(value);
        const duration = Math.min(1000, Math.max(600, end / 15));
        const stepSize = Math.max(1, Math.floor(end / 50));

        const timer = setInterval(() => {
          start += stepSize;
          if (start > end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, duration / (end / stepSize));

        return () => clearInterval(timer);
      }
    }, [isInView, value]);

    return (
      <div ref={ref} className="flex flex-col items-center text-center group">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative mb-3 p-3 rounded-xl bg-gradient-to-br from-blue-900/30 via-slate-800/10 to-blue-950/20  border border-blue-700/30 shadow-lg shadow-blue-900/30 group-hover:shadow-xl group-hover:shadow-blue-900/50 group-hover:border-blue-700/40 transition-all duration-300"
        >
          <div className="text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-200">
            {icon}
          </div>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold font-geo2 text-white mb-1 drop-shadow-[0_4px_12px_rgba(30,58,138,0.8)] group-hover:scale-105 transition-transform duration-200"
        >
          {count}+
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-blue-100/70 text-lg md:text-lg font-medium font-geo2 tracking-wide drop-shadow-[0_2px_8px_rgba(30,58,138,0.6)]"
        >
          {label}
        </motion.p>
      </div>
    );
  };

  return (
    <section className="relative  mt-20 md:mt-0 py-12 md:py-16 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="absolute inset-0 z-0">
        <Image
          src={test || "/placeholder.svg"}
          alt="Luxury Building"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/85 to-slate-950/90"></div>
        <div className="absolute inset-0 bg-blue-950/0"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6 w-full"
          >
            <div className="flex justify-center items-center mb-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full mr-4 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              ></motion.div>

              <h2 className="text-2xl md:text-4xl font-normal font-geo2 tracking-widest text-white uppercase leading-tight drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                {t("whyChoose")}
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full ml-4 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              ></motion.div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/50 via-slate-800/40 to-blue-950/60 backdrop-blur-xl border border-blue-700/30 shadow-2xl shadow-blue-900/50 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4  gap-10 relative">
              <div className="flex justify-center">
                <Counter
                  value="1000"
                  label={t("deliveredFlats")}
                  icon={<Home size={24} className="mx-auto" />}
                />
              </div>
              <div
                className="hidden md:block absolute h-16 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
                style={{
                  top: "50%",
                  left: "25%",
                  transform: "translateY(-50%)",
                }}
              ></div>

              <div className="flex justify-center">
                <Counter
                  value="4"
                  label={t("building")}
                  icon={<Building2 size={24} className="mx-auto" />}
                />
              </div>

              <div
                className="hidden md:block absolute h-16 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translateY(-50%)",
                }}
              ></div>

              <div className="flex justify-center">
                <Counter
                  value="1000"
                  label={t("happyClients")}
                  icon={<SmilePlus size={24} className="mx-auto" />}
                />
              </div>

              <div
                className="hidden md:block absolute h-16 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
                style={{
                  top: "50%",
                  left: "75%",
                  transform: "translateY(-50%)",
                }}
              ></div>

              <div className="flex justify-center">
                <Counter
                  value="6"
                  label={t("yearsExprerience")}
                  icon={<Clock size={24} className="mx-auto" />}
                />
              </div>
              <div
                className="block md:hidden absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ top: "50%", left: 0 }}
              ></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
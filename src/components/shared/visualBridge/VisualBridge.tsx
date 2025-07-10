"use client"

import { motion } from "framer-motion";

interface EnhancedVisualBridgeProps {
  className?: string;
}

export default function VisualBridge({
  className = "",
}: EnhancedVisualBridgeProps) {
  return (
    <div className={`relative z-30 -mt-20 mb-0 ${className}`}>
      <div className="h-24 bg-gradient-to-b from-transparent via-slate-900/90 to-slate-950/95 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:20px_20px]"></div>
        </div>

        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="flex justify-center items-center">
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "30%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-[2px] bg-gradient-to-r from-transparent via-white/60 to-white/30 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              ></motion.div>

              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                whileInView={{ scale: 1, rotate: 45 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mx-8 relative"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-white/30">
                  <div className="absolute inset-1 bg-gradient-to-br from-slate-800/50 to-slate-900/70 rounded-sm"></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "30%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-[2px] bg-gradient-to-l from-transparent via-white/60 to-white/30 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              ></motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-4">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-lg"
          ></motion.div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: [0, 1, 0], y: -20 }}
              viewport={{ once: true }}
              transition={{
                duration: 3,
                delay: i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
              }}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${25 + i * 15}%`,
                top: `${50 + (i % 2) * 20}%`,
              }}
            ></motion.div>
          ))}
        </div>

        <div className="absolute bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-slate-950/50 to-slate-950"></div>
      </div>

      <div className="h-4 bg-gradient-to-b from-slate-950 to-slate-950/95 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80"></div>
      </div>
    </div>
  );
}
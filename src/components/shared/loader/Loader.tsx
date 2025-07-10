 
import { motion } from "framer-motion";
import BlackAisi from "@/root/public/images/BlackAisi.png";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Loader() {
  const t = useTranslations("main");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.1, 1],
          opacity: 1,
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-4"
        >
          <Image
            src={BlackAisi}
            alt="Aisi Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-gray-700 text-sm font-medium"
        >
          {t("loading")}
        </motion.div>

        <motion.div
          className="flex space-x-1 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gray-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import { Facebook, Instagram } from "../svg";
import Image from "next/image";
import Logo from "@/root/public/images/SBuildingWhite.png";

export default function Footer() {
  const t = useTranslations("main");
  const locale = useLocale();

  const navigationItems = [
    { name: t("main"), href: "/" },
    { name: t("contact"), href: "/contact" },
    { name: t("elisium"), href: "/elisium" },
  ];

  return (
    <footer className="relative  px-4 md:px-24 w-full bg-blue-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-t border-white/10">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

      <div className="relative z-10 container mx-auto px-6 py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Link href={`/${locale}`} className="inline-block mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Image
                  src={Logo || "/placeholder.svg"}
                  alt="AISI Logo"
                  className="w-40 h-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>
            </Link>
            <div className="flex space-x-3">
              <motion.a
                href="https://www.facebook.com/AISIGROUP"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/8 hover:bg-blue-500/20 border border-white/15 hover:border-blue-400/50 p-3 rounded-xl transition-all duration-300 group backdrop-blur-sm"
              >
                <Facebook
                  size={16}
                  className="w-4 h-4 fill-gray-400 group-hover:fill-blue-300 transition-colors duration-300"
                />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/aisigroup/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/8 hover:bg-blue-500/20 border border-white/15 hover:border-blue-400/50 p-3 rounded-xl transition-all duration-300 group backdrop-blur-sm"
              >
                <Instagram
                  size={16}
                  className="w-4 h-4 fill-gray-400 group-hover:fill-blue-300 transition-colors duration-300"
                />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className=""
          >
            <h3 className="text-white text-base font-semibold mb-6 tracking-wide">
              {t("navigation")}
            </h3>
            <div className="space-y-3">
              {navigationItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-gray-300 hover:text-blue-100 transition-colors duration-300 text-sm block py-1 hover:underline underline-offset-4"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-white text-base font-semibold mb-6 tracking-wide">
              {t("contactUs")}
            </h3>
            <div className="space-y-4">
              <motion.div
                className="flex items-start group"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="bg-white/8 border border-white/15 p-2 rounded-lg mr-3 mt-0.5 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
                  <MapPin
                    size={14}
                    className="text-blue-300 group-hover:text-blue-200"
                  />
                </div>
                <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                  ანგისის პირველი შესახვევი #28,
                  <br />
                  Batumi, Georgia
                </span>
              </motion.div>

              <motion.div
                className="flex items-start group"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="bg-white/8 border border-white/15 p-2 rounded-lg mr-3 mt-0.5 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
                  <Phone
                    size={14}
                    className="text-blue-300 group-hover:text-blue-200"
                  />
                </div>
                <a
                  href="tel:+995557471414"
                  className="text-gray-300 hover:text-blue-100 transition-colors duration-300 text-sm group-hover:underline underline-offset-4"
                >
                  +995 557 47 14 14
                </a>
              </motion.div>

              <motion.div
                className="flex items-start group"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="bg-white/8 border border-white/15 p-2 rounded-lg mr-3 mt-0.5 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-300">
                  <Mail
                    size={14}
                    className="text-blue-300 group-hover:text-blue-200"
                  />
                </div>
                <a
                  href="mailto:aisistatus@gmail.com"
                  className="text-gray-300 hover:text-blue-100 transition-colors duration-300 text-sm group-hover:underline underline-offset-4"
                >
                  aisistatus@gmail.com
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-2  border-t justify-center border-white/10 flex flex-col sm:flex-row   items-center space-y-4 sm:space-y-0"
        >
          <p className="text-gray-400 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Digital Port. All rights reserved.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
    </footer>
  );
}

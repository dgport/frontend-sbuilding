"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import { Facebook, Instagram } from "../svg";
import Image from "next/image";
import Logo from "@/root/public/images/AisiLogo1.png";

export default function Footer() {
  const t = useTranslations("main");
  const locale = useLocale();

  const allItems = [
    { name: t("main"), href: "/" },
    { name: t("contact"), href: "/contact" },
    { name: t("aisiBatumi"), href: "/aisi-batumi" },
    { name: t("aisiGoderdzi"), href: "/aisi-goderdzi" },
  ];

  return (
    <footer className="relative px-10 md:px-20 w-full  bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container   mx-auto  py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block flex-none"
          >
            <Link href={`/${locale}`} className="inline-block">
              <Image
                src={Logo || "/placeholder.svg"}
                alt="AISI Logo"
                width={120}
                height={60}
                className="w-24 h-auto opacity-90 hover:opacity-100 transition-opacity duration-200"
              />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("navigation")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-1">
              {allItems.map((item) => (
                <Link
                  key={item.name}
                  href={`/${locale}${item.href}`}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm py-1 block"
                >
                  {item.name}
                </Link>
              ))}
              <a
                className="text-gray-400 hover:text-white"
                href="https://korter.ge"
                target="_blank"
                rel="noopener noreferrer"
              >
                Korter.ge
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("contactUs")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin
                  size={14}
                  className="text-indigo-400 mr-2 mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm leading-relaxed">
                  ანგისის პირველი შესახვევი #28, Batumi, Georgia
                </span>
              </div>
              <div className="flex items-start">
                <Phone
                  size={14}
                  className="text-indigo-400 mr-2 mt-0.5 flex-shrink-0"
                />
                <a
                  href="tel:+995557471414"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  +995 557 47 14 14
                </a>
              </div>
              <div className="flex items-start">
                <Mail
                  size={14}
                  className="text-indigo-400 mr-2 mt-0.5 flex-shrink-0"
                />
                <a
                  href="mailto:aisistatus@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  aisistatus@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 lg:flex-none"
          >
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              {t("followUs")}
            </h3>
            <div className="flex space-x-3">
              <motion.a
                href="https://www.facebook.com/AISIGROUP"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/50 p-2.5 rounded-lg transition-all duration-200 group"
              >
                <Facebook
                  size={16}
                  className="w-4 h-4 fill-gray-400 group-hover:fill-blue-400"
                />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/aisigroup/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-400/50 p-2.5 rounded-lg transition-all duration-200 group"
              >
                <Instagram
                  size={16}
                  className="w-4 h-4 fill-gray-400 group-hover:fill-pink-400"
                />
              </motion.a>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 pt-6 border-t border-white/10 flex flex-row w-full justify-center items-center"
        >
          <p className="text-gray-500 text-xs text-center">
            © {new Date().getFullYear()} Digital Port. All rights reserved.
          </p>
        </motion.div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
    </footer>
  );
}

"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LocaleSwitcher from "@/i18n/LocaleSwitcher";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Logo from "@/root/public/images/AisiLogo1.png";
import Image from "next/image";

export default function Header() {
  const t = useTranslations("main");
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsAdmin(pathname.includes("/admin"));
  }, [pathname]);

  useEffect(() => {
    if (isMobile && isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobile, isMenuOpen]);

  const navItems = [
    { name: t("main"), href: "/" },
    {
      name: t("projects"),
      href: "/projects",
      subItems: [
        { name: t("aisiBatumi"), href: "/aisi-batumi" },
        { name: t("aisiGoderdzi"), href: "/aisi-goderdzi" },
        { name: t("aisiStatus"), href: "/aisi-status" },
      ],
    },
    { name: t("contact"), href: "/contact" },
  ];

  const isActive = (href: string) => {
    return (
      pathname === `/${locale}${href}` ||
      (href === "/" && pathname === `/${locale}`) ||
      (href === "/projects" && pathname.startsWith(`/${locale}/projects`))
    );
  };

  const isSubItemActive = (href: string) => {
    return pathname === `/${locale}${href}`;
  };

  const headerBgClass = isAdmin ? "bg-slate-900" : "bg-transparent";

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProjectsOpen(false);
  };

  const handleLocaleChange = () => {
    closeMenu();
  };

  if (!isMounted) {
    return (
      <header
        className={`  w-full flex flex-col items-center z-50 px-6 lg:px-16 pt-4 ${headerBgClass}`}
      >
        <div className="w-full h-16 lg:h-24 flex items-center justify-between relative">
          <div>
            <Link href={`/${locale}`}>
              <Image
                src={Logo || "/placeholder.svg"}
                alt="AISI Logo"
                className="w-12 md:w-18 h-auto cursor-pointer md:ml-10"
              />
            </Link>
          </div>
          <div className="opacity-0">
            <LocaleSwitcher />
          </div>
          <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-indigo-100" />
        </div>
      </header>
    );
  }

  return (
    <header
      className={`absolute w-full flex flex-col items-center z-50 px-6 lg:px-16 pt-4 ${headerBgClass}`}
    >
      <div className="w-full h-16 lg:h-24 flex items-center justify-between relative">
        <div>
          <Link href={`/${locale}`}>
            <Image
              src={Logo || "/placeholder.svg"}
              alt="AISI Logo"
              className="w-12 md:w-18 h-auto cursor-pointer md:ml-10"
            />
          </Link>
        </div>

        {isMobile ? (
          <>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-[60] text-white p-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={closeMenu}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-16 left-4 right-4 bottom-4 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
                  >
                    <div className="absolute inset-0 opacity-5">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                    </div>

                    <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-shrink-0" />

                    <div className="relative z-10 flex-1 overflow-y-auto p-6">
                      <div className="space-y-3">
                        {navItems.map((item) => (
                          <div key={item.name}>
                            {item.subItems ? (
                              <div className="space-y-2">
                                <button
                                  onClick={() =>
                                    setIsProjectsOpen(!isProjectsOpen)
                                  }
                                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                                    isActive(item.href)
                                      ? "bg-white/10 border border-indigo-400/30 shadow-lg shadow-indigo-500/10"
                                      : "bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20"
                                  }`}
                                  aria-expanded={isProjectsOpen}
                                >
                                  <span className="text-white font-geo2 text-xl font-medium tracking-widest">
                                    {item.name}
                                  </span>
                                  <ChevronRight
                                    size={18}
                                    className={`text-indigo-400 transition-transform duration-200 ${
                                      isProjectsOpen ? "rotate-90" : ""
                                    }`}
                                  />
                                </button>

                                <AnimatePresence>
                                  {isProjectsOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pl-4 space-y-2">
                                        {item.subItems.map((subItem) => (
                                          <Link
                                            key={subItem.name}
                                            href={`/${locale}${subItem.href}`}
                                            onClick={closeMenu}
                                            className={`block p-4 rounded-xl transition-all duration-200 ${
                                              isSubItemActive(subItem.href)
                                                ? "bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 shadow-lg shadow-indigo-500/10"
                                                : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-transparent hover:border-white/20"
                                            }`}
                                          >
                                            <span className="text-lg font-geo2 tracking-widest">
                                              {subItem.name}
                                            </span>
                                          </Link>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ) : (
                              <Link
                                href={`/${locale}${item.href}`}
                                onClick={closeMenu}
                                className={`block p-4 rounded-xl transition-all duration-200 ${
                                  isActive(item.href)
                                    ? "bg-white/10 border border-indigo-400/30 text-white shadow-lg shadow-indigo-500/10"
                                    : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-transparent hover:border-white/20"
                                }`}
                              >
                                <span className="text-xl font-medium font-geo2 tracking-widest">
                                  {item.name}
                                </span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0 p-6 border-t border-white/10">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <LocaleSwitcher
                          variant="mobile"
                          onLocaleChange={handleLocaleChange}
                        />
                      </div>
                    </div>

                    <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-shrink-0" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="flex items-center space-x-4 lg:space-x-8">
            <nav className="space-x-4 lg:space-x-6 xl:space-x-10">
              {navItems.map((item) => (
                <span key={item.name} className="relative inline-block">
                  {item.subItems ? (
                    <div className="relative inline-block">
                      <button
                        onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                        className={`text-white font-geo2 text-xl lg:text-2xl tracking-widest hover:text-gray-300 group inline-flex items-center pb-1 cursor-pointer ${
                          isActive(item.href) ? "font-medium" : ""
                        }`}
                        aria-expanded={isProjectsOpen}
                      >
                        {item.name}
                        <ChevronDown
                          size={16}
                          className={`ml-1 transition-transform duration-300 ${
                            isProjectsOpen ? "rotate-180" : ""
                          }`}
                        />
                        <div className="absolute left-0 bottom-0 w-full h-0.5 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-indigo-500 to-indigo-300 transition-all duration-300 ${
                              isActive(item.href)
                                ? "w-full"
                                : "w-0 group-hover:w-full"
                            }`}
                          />
                        </div>
                      </button>
                      <AnimatePresence>
                        {isProjectsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg rounded-lg py-2 shadow-xl z-10 border border-white/20"
                          >
                            <div className="absolute inset-0 opacity-5 rounded-lg">
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                                  backgroundSize: "20px 20px",
                                }}
                              ></div>
                            </div>

                            <div className="relative z-10">
                              {item.subItems.map((subItem) => (
                                <div key={subItem.name} className="mx-2 my-1">
                                  <Link
                                    href={`/${locale}${subItem.href}`}
                                    className={`block px-3 py-2 rounded-md text-lg md:text-xl font-geo2 tracking-widest transition-all duration-200 ${
                                      isSubItemActive(subItem.href)
                                        ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/30"
                                        : "text-gray-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20"
                                    }`}
                                    onClick={() => setIsProjectsOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={`/${locale}${item.href}`}
                      className={`text-white font-geo2 text-xl lg:text-2xl tracking-widest hover:text-gray-300 group inline-block pb-1 ${
                        isActive(item.href) ? "font-medium" : ""
                      }`}
                    >
                      {item.name}
                      <div className="absolute left-0 bottom-0 w-full h-0.5 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-indigo-500 to-indigo-300 transition-all duration-300 ${
                            isActive(item.href)
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        />
                      </div>
                    </Link>
                  )}
                </span>
              ))}
            </nav>
            <div>
              <LocaleSwitcher />
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 w-full h-px bg-indigo-100" />
      </div>
    </header>
  );
}

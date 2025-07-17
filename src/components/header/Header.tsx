"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LocaleSwitcher from "@/i18n/LocaleSwitcher";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Logo from "@/root/public/images/SBuildingWhite.png";
import Image from "next/image";

export default function Header() {
  const t = useTranslations("main");
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    checkMobile();
    handleScroll();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsAdmin(pathname.includes("/admin"));
  }, [pathname]);

  const navItems = [
    { name: t("main"), href: "/" },
    {
      name: t("projects"),
      href: "/projects",
      subItems: [{ name: t("elisium"), href: "/elisium" }],
    },
    // { name: t("aboutUs"), href: "/about-us" },
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

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProjectsOpen(false);
  };

  const handleLocaleChange = () => {
    closeMenu();
  };

  // Check if we're on contact or about-us pages
  const isContactOrAboutPage =
    pathname.includes("/contact") || pathname.includes("/about-us");

  // Function to get header background classes
  const getHeaderBackgroundClasses = () => {
    if (isAdmin) {
      return "bg-blue-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-white/10";
    }

    if (isContactOrAboutPage) {
      // Always use dark background for contact and about-us pages
      return "bg-blue-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-white/10";
    }

    if (scrolled) {
      // Changed scroll background to a darker slate color
      return "bg-blue-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-white/10";
    }

    // Default transparent background
    return "bg-blue-900/20 backdrop-blur-md";
  };

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
          <div className="w-24 h-8 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </header>
    );
  }

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
    ${getHeaderBackgroundClasses()}
    ${scrolled || isContactOrAboutPage ? " h-16 md:h-20" : " h-20 md:h-24"}
  `;

  return (
    <motion.header
      className={headerClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full relative">
          {isMobile ? (
            <>
              <Link href={`/${locale}`} className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Image
                    src={Logo || "/placeholder.svg"}
                    alt="AISI Logo"
                    className="w-28 h-auto"
                  />
                </motion.div>
              </Link>

              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative z-[60] p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMenuOpen ? "close" : "menu"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    onClick={closeMenu}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed top-28 left-4 right-4 bottom-4 z-50 bg-gradient-to-br from-blue-900/98 via-blue-800/98 to-blue-900/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col"
                  >
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                    </div>
                    <div className="relative z-10 flex-1 overflow-y-auto p-8">
                      <div className="space-y-4">
                        {navItems.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            {item.subItems ? (
                              <>
                                <button
                                  onClick={() =>
                                    setIsProjectsOpen(!isProjectsOpen)
                                  }
                                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 group ${
                                    isActive(item.href)
                                      ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/40 shadow-lg shadow-blue-500/25"
                                      : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30"
                                  }`}
                                >
                                  <span className="text-white font-medium text-lg tracking-wide">
                                    {item.name}
                                  </span>
                                  <ChevronRight
                                    size={18}
                                    className={`text-blue-400 transition-all duration-300 group-hover:text-blue-200 ${
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
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden ml-4 mt-2 space-y-2"
                                    >
                                      {item.subItems.map(
                                        (subItem, subIndex) => (
                                          <motion.div
                                            key={subItem.name}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                              delay: subIndex * 0.05,
                                            }}
                                          >
                                            <Link
                                              href={`/${locale}${subItem.href}`}
                                              onClick={closeMenu}
                                              className={`block p-4 rounded-xl transition-all duration-300 ${
                                                isSubItemActive(subItem.href)
                                                  ? "bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-500/50 text-blue-50 shadow-lg shadow-blue-500/20"
                                                  : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-transparent hover:border-white/20"
                                              }`}
                                            >
                                              <span className="font-medium tracking-wide">
                                                {subItem.name}
                                              </span>
                                            </Link>
                                          </motion.div>
                                        )
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </>
                            ) : (
                              <Link
                                href={`/${locale}${item.href}`}
                                onClick={closeMenu}
                                className={`block p-5 rounded-2xl transition-all duration-300 ${
                                  isActive(item.href)
                                    ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/40 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/30"
                                }`}
                              >
                                <span className="font-medium text-lg tracking-wide">
                                  {item.name}
                                </span>
                              </Link>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 p-8 border-t border-white/10">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
                        <LocaleSwitcher
                          variant="mobile"
                          onLocaleChange={handleLocaleChange}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-full">
                <div className="flex items-center gap-12">
                  <nav className="flex items-center gap-6">
                    {navItems.slice(0, 2).map((item) => (
                      <div key={item.name} className="relative">
                        {item.subItems ? (
                          <div className="relative">
                            <motion.button
                              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                              className={`relative text-white font-medium text-base tracking-wide hover:text-blue-100 group inline-flex items-center px-5 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 border ${
                                isActive(item.href)
                                  ? "bg-gradient-to-r from-blue-500/25 to-blue-600/25 border-blue-400/50 shadow-lg shadow-blue-500/20"
                                  : "bg-white/8 hover:bg-white/15 border-white/15 hover:border-white/25"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {item.name}
                              <ChevronDown
                                size={14}
                                className={`ml-1.5 transition-all duration-300 ${
                                  isProjectsOpen ? "rotate-180" : ""
                                }`}
                              />
                            </motion.button>
                            <AnimatePresence>
                              {isProjectsOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute left-0 mt-1.5 w-52 bg-blue-900/95 backdrop-blur-2xl rounded-xl py-2 shadow-2xl shadow-black/40 z-20 border border-white/20"
                                >
                                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
                                  {item.subItems.map((subItem, index) => (
                                    <motion.div
                                      key={subItem.name}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      className="mx-3 my-1"
                                    >
                                      <Link
                                        href={`/${locale}${subItem.href}`}
                                        className={`block px-3.5 py-2.5 rounded-lg font-medium text-sm tracking-wide transition-all duration-300 ${
                                          isSubItemActive(subItem.href)
                                            ? "bg-gradient-to-r from-blue-500/30 to-blue-600/30 text-blue-50 border border-blue-500/50 shadow-lg shadow-blue-500/20"
                                            : "text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20"
                                        }`}
                                        onClick={() => setIsProjectsOpen(false)}
                                      >
                                        {subItem.name}
                                      </Link>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href={`/${locale}${item.href}`}
                              className={`relative text-white font-medium text-base tracking-wide hover:text-blue-100 group inline-block px-5 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 border ${
                                isActive(item.href)
                                  ? "bg-gradient-to-r from-blue-500/25 to-blue-600/25 border-blue-400/50 shadow-lg shadow-blue-500/20"
                                  : "bg-white/8 hover:bg-white/15 border-white/15 hover:border-white/25"
                              }`}
                            >
                              {item.name}
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </nav>
                  <Link href={`/${locale}`} className="mx-10">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Image
                        src={Logo || "/placeholder.svg"}
                        alt="AISI Logo"
                        className={`transition-all duration-500 ${
                          scrolled || isContactOrAboutPage
                            ? "w-36 h-auto"
                            : "w-40 h-auto"
                        }`}
                      />
                    </motion.div>
                  </Link>
                  <nav className="flex items-center gap-6">
                    {navItems.slice(2).map((item) => (
                      <motion.div
                        key={item.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={`/${locale}${item.href}`}
                          className={`relative text-white font-medium text-base tracking-wide hover:text-blue-100 group inline-block px-5 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 border ${
                            isActive(item.href)
                              ? "bg-gradient-to-r from-blue-500/25 to-blue-600/25 border-blue-400/50 shadow-lg shadow-blue-500/20"
                              : "bg-white/8 hover:bg-white/15 border-white/15 hover:border-white/25"
                          }`}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg ">
                    <LocaleSwitcher />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

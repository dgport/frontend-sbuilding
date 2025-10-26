"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LocaleSwitcher from "@/i18n/LocaleSwitcher";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Logo from "@/root/public/images/SBuildingWhite.png";
import Image from "next/image";

export default function Header() {
  const t = useTranslations("main");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    const onScroll = () => setScrolled(window.scrollY > 20);
    check();
    onScroll();
    window.addEventListener("resize", check);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setIsAdmin(pathname.includes("/admin"));
  }, [pathname]);

  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isMobile]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        isProjectsOpen &&
        !(e.target as HTMLElement).closest(".projects-dropdown")
      ) {
        setIsProjectsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isProjectsOpen]);

  /* ------------------  helpers  ------------------ */
  const navItems = [
    { name: t("main"), href: "/" },
    {
      name: t("projects"),
      href: "/projects",
      subItems: [{ name: t("elisium"), href: "/elisium" }],
    },
    { name: t("contact"), href: "/contact" },
  ];

  const isActive = (href: string) =>
    pathname === `/${locale}${href}` ||
    (href === "/" && pathname === `/${locale}`) ||
    (href === "/projects" && pathname.startsWith(`/${locale}/projects`));

  const isSubItemActive = (href: string) => pathname === `/${locale}${href}`;

  // Check if we're on any project page to highlight the Projects nav
  const isOnProjectPage = () =>
    pathname.startsWith(`/${locale}/projects`) ||
    pathname.startsWith(`/${locale}/elisium`) ||
    navItems
      .find((item) => item.subItems)
      ?.subItems?.some((sub) => pathname === `/${locale}${sub.href}`);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProjectsOpen(false);
  };

  const handleLogoClick = () => {
    router.push(`/${locale}`);
    closeMenu();
  };

  const handleNavClick = (href: string) => {
    router.push(`/${locale}${href}`);
    closeMenu();
  };

  const handleSubClick = (href: string) => {
    router.push(`/${locale}${href}`);
    closeMenu();
  };

  const toggleProjects = () => setIsProjectsOpen((v) => !v);

  const isSpecialPage =
    pathname.includes("/contact") ||
    pathname.includes("/about-us") ||
    /\/elisium\/[^/]+/.test(pathname);

  const headerBg = () => {
    if (isAdmin || isSpecialPage || scrolled)
      return "bg-blue-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-white/10";
    return "bg-blue-900/20 backdrop-blur-md";
  };

  /* ------------------  skeleton while SSR  ------------------ */
  if (!isMounted)
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
          <div className="w-24 h-8 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </header>
    );

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
    ${headerBg()}
    ${scrolled || isSpecialPage ? "h-16 md:h-20" : "h-20 md:h-24"}
  `;

  /* =========================================================
     🎨  RENDER
  ========================================================= */
  return (
    <>
      {/* ---------- header bar ---------- */}
      <motion.header
        className={headerClasses}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto  px-6 h-full">
          <div className="flex items-center justify-between h-full relative">
            {/* mobile hamburger */}
            {isMobile ? (
              <>
                <motion.button
                  onClick={handleLogoClick}
                  className="flex-shrink-0 focus:outline-none cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={Logo || "/placeholder.svg"}
                    alt="SBUILDING Logo"
                    className="w-28 h-auto"
                    priority
                  />
                </motion.button>

                <motion.button
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="relative z-[60] p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 cursor-pointer shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isMenuOpen ? "x" : "menu"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </>
            ) : (
              /* ---------- desktop layout ---------- */
              <div className="flex items-center justify-center w-full">
                <div className="flex items-center gap-12">
                  <nav className="flex items-center gap-6">
                    {navItems.slice(0, 2).map((item) => (
                      <div
                        key={item.name}
                        className="relative projects-dropdown"
                      >
                        {item.subItems ? (
                          <>
                            <motion.button
                              onClick={toggleProjects}
                              className={`text-white font-medium text-base tracking-wide flex items-center px-5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer relative ${
                                isActive(item.href) ||
                                isProjectsOpen ||
                                isOnProjectPage()
                                  ? "bg-blue-500/30 border-blue-400/60 text-blue-50 shadow-lg shadow-blue-500/20"
                                  : "bg-white/8 border-white/15 hover:bg-white/15 hover:border-white/25"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="flex items-center">
                                {item.name}
                                {isOnProjectPage() && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 bg-blue-400 rounded-full ml-2 shadow-sm shadow-blue-400/50"
                                  />
                                )}
                              </span>
                              <ChevronDown
                                size={14}
                                className={`ml-1.5 transition-transform duration-200 ${
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
                                  transition={{
                                    duration: 0.15,
                                    ease: "easeOut",
                                  }}
                                  className="absolute left-0 mt-2 w-64 bg-gradient-to-br from-blue-900/98 to-slate-900/95 backdrop-blur-2xl rounded-2xl py-3 shadow-2xl border border-white/30 ring-1 ring-blue-400/20"
                                >
                                  <div className="px-3 pb-2 border-b border-white/10">
                                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                                      Our Projects
                                    </p>
                                  </div>
                                  {item.subItems.map((sub, index) => (
                                    <motion.button
                                      key={sub.name}
                                      onClick={() => {
                                        handleSubClick(sub.href);
                                        setIsProjectsOpen(false);
                                      }}
                                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer group relative ${
                                        isSubItemActive(sub.href)
                                          ? "text-blue-50 bg-gradient-to-r from-blue-500/40 to-cyan-500/30 shadow-md"
                                          : "text-gray-300 hover:text-white hover:bg-white/10"
                                      }`}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      whileHover={{ x: 6 }}
                                    >
                                      <div className="flex items-center">
                                        {isSubItemActive(sub.href) && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-2 h-2 bg-blue-400 rounded-full mr-3 shadow-sm shadow-blue-400/50"
                                          />
                                        )}
                                        <span className="flex-1">
                                          {sub.name}
                                        </span>
                                        <ChevronRight
                                          size={14}
                                          className={`transition-all duration-200 ${
                                            isSubItemActive(sub.href)
                                              ? "text-blue-300 opacity-100"
                                              : "text-gray-500 opacity-0 group-hover:opacity-100"
                                          }`}
                                        />
                                      </div>
                                      {isSubItemActive(sub.href) && (
                                        <motion.div
                                          layoutId="sub-item-active"
                                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full"
                                          initial={false}
                                          transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 30,
                                          }}
                                        />
                                      )}
                                    </motion.button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <motion.button
                            onClick={() => handleNavClick(item.href)}
                            className={`text-white font-medium text-base tracking-wide px-5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isActive(item.href)
                                ? "bg-blue-500/30 border-blue-400/60 text-blue-50 shadow-lg shadow-blue-500/20"
                                : "bg-white/8 border-white/15 hover:bg-white/15 hover:border-white/25"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="relative">
                              {item.name}
                              {isActive(item.href) && (
                                <motion.div
                                  layoutId="desktop-active-indicator"
                                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 rounded-full"
                                  initial={false}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                />
                              )}
                            </span>
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </nav>

                  <motion.button
                    onClick={handleLogoClick}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={Logo || "/placeholder.svg"}
                      alt="SBUILDING Logo"
                      className={`transition-all duration-500 ${
                        scrolled || isSpecialPage ? "w-36" : "w-40"
                      }`}
                      priority
                    />
                  </motion.button>

                  <nav className="flex items-center gap-6">
                    {navItems.slice(2).map((item) => (
                      <motion.button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className={`text-white font-medium text-base tracking-wide px-5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isActive(item.href)
                            ? "bg-blue-500/30 border-blue-400/60 text-blue-50 shadow-lg shadow-blue-500/20"
                            : "bg-white/8 border-white/15 hover:bg-white/15 hover:border-white/25"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative">
                          {item.name}
                          {isActive(item.href) && (
                            <motion.div
                              layoutId="desktop-active-indicator-2"
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 rounded-full"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}
                        </span>
                      </motion.button>
                    ))}
                  </nav>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <div className="p-2 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors duration-200 cursor-pointer">
                    <LocaleSwitcher />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* ---------- mobile full-screen menu ---------- */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-30"
              onClick={closeMenu}
            />

            {/* menu panel */}
            <motion.nav
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-24 left-4 right-4 bottom-4 z-40 bg-gradient-to-br from-blue-900/98 via-blue-800/98 to-slate-900/98 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header decoration */}
              <div className="flex-shrink-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {item.subItems ? (
                      <>
                        <motion.button
                          onClick={() => setIsProjectsOpen((v) => !v)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl text-white font-medium text-lg tracking-wide border transition-all duration-300 cursor-pointer ${
                            isActive(item.href) || isOnProjectPage()
                              ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20"
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                          }`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="flex items-center">
                            {item.name}
                            {(isActive(item.href) || isOnProjectPage()) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-blue-400 rounded-full ml-3"
                              />
                            )}
                          </span>
                          <ChevronRight
                            size={18}
                            className={`transition-transform duration-300 ${
                              isProjectsOpen ? "rotate-90" : ""
                            }`}
                          />
                        </motion.button>

                        <AnimatePresence>
                          {isProjectsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="ml-4 mt-2 space-y-2 overflow-hidden"
                            >
                              {item.subItems.map((sub, sIdx) => (
                                <motion.button
                                  key={sub.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: sIdx * 0.1 }}
                                  onClick={() => handleSubClick(sub.href)}
                                  className={`w-full text-left p-3 rounded-xl text-base font-medium border transition-all duration-300 cursor-pointer ${
                                    isSubItemActive(sub.href)
                                      ? "bg-gradient-to-r from-blue-500/40 to-cyan-500/30 text-blue-50 border-blue-400/60 shadow-md"
                                      : "text-gray-300 bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20"
                                  }`}
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <span className="flex items-center">
                                    {sub.name}
                                    {isSubItemActive(sub.href) && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-2"
                                      />
                                    )}
                                  </span>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full text-left p-4 rounded-2xl text-white font-medium text-lg tracking-wide border transition-all duration-300 cursor-pointer ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center">
                          {item.name}
                          {isActive(item.href) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-blue-400 rounded-full ml-3"
                            />
                          )}
                        </span>
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Footer with enhanced locale switcher */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex-shrink-0 p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent"
              >
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors duration-200">
                  <LocaleSwitcher variant="mobile" onLocaleChange={closeMenu} />
                </div>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

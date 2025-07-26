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

  /* ------------------  local state  ------------------ */
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  /* ------------------  effects  ------------------ */
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

  /* lock body scroll when mobile menu is opened */
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isMobile]);

  /* close on click-outside */
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
    pathname.includes("/contact") || pathname.includes("/about-us");

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
        <div className="container mx-auto px-6 h-full">
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
                  className="relative z-[60] p-3 rounded-2xl bg-white/10 text-white"
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
                              className="text-white font-medium text-base tracking-wide flex items-center px-5 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15"
                            >
                              {item.name}
                              <ChevronDown
                                size={14}
                                className={`ml-1.5 transition-transform ${
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
                                  className="absolute left-0 mt-1.5 w-52 bg-blue-900/95 backdrop-blur-2xl rounded-xl py-2 shadow-2xl border border-white/20"
                                >
                                  {item.subItems.map((sub) => (
                                    <button
                                      key={sub.name}
                                      onClick={() => {
                                        handleSubClick(sub.href);
                                        setIsProjectsOpen(false);
                                      }}
                                      className="w-full text-left px-3.5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10"
                                    >
                                      {sub.name}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <motion.button
                            onClick={() => handleNavClick(item.href)}
                            className="text-white font-medium text-base tracking-wide px-5 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15"
                          >
                            {item.name}
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </nav>

                  <motion.button onClick={handleLogoClick}>
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
                        className="text-white font-medium text-base tracking-wide px-5 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15"
                      >
                        {item.name}
                      </motion.button>
                    ))}
                  </nav>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <div className="p-2 rounded-2xl bg-white/10">
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30"
              onClick={closeMenu}
            />

            {/* menu panel */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-28 left-4 right-4 bottom-4 z-40 bg-gradient-to-br from-blue-900/98 to-blue-800/98 backdrop-blur-2xl rounded-3xl border border-white/20 flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => setIsProjectsOpen((v) => !v)}
                          className={`w-full flex items-center justify-between p-5 rounded-2xl text-white font-medium text-lg tracking-wide border
                            ${
                              isActive(item.href)
                                ? "bg-blue-500/20 border-blue-500/40"
                                : "bg-white/5 border-white/10"
                            }`}
                        >
                          {item.name}
                          <ChevronRight
                            size={18}
                            className={`transition-transform ${
                              isProjectsOpen ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isProjectsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-4 mt-2 space-y-2"
                            >
                              {item.subItems.map((sub, sIdx) => (
                                <motion.button
                                  key={sub.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: sIdx * 0.05 }}
                                  onClick={() => handleSubClick(sub.href)}
                                  className={`w-full text-left p-4 rounded-xl text-sm font-medium border
                                    ${
                                      isSubItemActive(sub.href)
                                        ? "bg-blue-500/30 text-blue-50 border-blue-500/50"
                                        : "text-gray-300 bg-white/5 border-white/10 hover:text-white"
                                    }`}
                                >
                                  {sub.name}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full text-left p-5 rounded-2xl text-white font-medium text-lg tracking-wide border
                          ${
                            isActive(item.href)
                              ? "bg-blue-500/20 border-blue-500/40"
                              : "bg-white/5 border-white/10"
                          }`}
                      >
                        {item.name}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex-shrink-0 p-8 border-t border-white/10">
                <div className="bg-white/5 rounded-2xl p-4">
                  <LocaleSwitcher variant="mobile" onLocaleChange={closeMenu} />
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

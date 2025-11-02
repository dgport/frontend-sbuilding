"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
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
    window.addEventListener("scroll", onScroll, { passive: true });
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

  const navItems = useMemo(
    () => [
      { name: t("main"), href: "/" },
      {
        name: t("projects"),
        href: "/projects",
        subItems: [{ name: t("elisium"), href: "/elisium" }],
      },
      { name: t("contact"), href: "/contact" },
    ],
    [t]
  );

  const isActive = useCallback(
    (href: string) =>
      pathname === `/${locale}${href}` ||
      (href === "/" && pathname === `/${locale}`) ||
      (href === "/projects" && pathname.startsWith(`/${locale}/projects`)),
    [pathname, locale]
  );

  const isSubItemActive = useCallback(
    (href: string) => pathname === `/${locale}${href}`,
    [pathname, locale]
  );

  const isOnProjectPage = useCallback(
    () =>
      pathname.startsWith(`/${locale}/projects`) ||
      pathname.startsWith(`/${locale}/elisium`) ||
      navItems
        .find((item) => item.subItems)
        ?.subItems?.some((sub) => pathname === `/${locale}${sub.href}`),
    [pathname, locale, navItems]
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setIsProjectsOpen(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    router.push(`/${locale}`);
    closeMenu();
  }, [router, locale, closeMenu]);

  const handleNavClick = useCallback(
    (href: string) => {
      router.push(`/${locale}${href}`);
      closeMenu();
    },
    [router, locale, closeMenu]
  );

  const handleSubClick = useCallback(
    (href: string) => {
      router.push(`/${locale}${href}`);
      closeMenu();
    },
    [router, locale, closeMenu]
  );

  const toggleProjects = useCallback(() => setIsProjectsOpen((v) => !v), []);

  const isSpecialPage = useMemo(
    () =>
      pathname.includes("/contact") ||
      pathname.includes("/about-us") ||
      pathname.includes("/elisium") ||
      /\/elisium\/[^/]+/.test(pathname),
    [pathname]
  );

  const headerBg = useMemo(() => {
    if (isAdmin || isSpecialPage || scrolled)
      return "bg-blue-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-white/10";
    return "bg-blue-900/20 backdrop-blur-md";
  }, [isAdmin, isSpecialPage, scrolled]);

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
    fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out z-[8888] 
    ${headerBg}
    ${scrolled || isSpecialPage ? "h-16 md:h-20" : "h-20 md:h-24"}
  `;

  return (
    <>
      <header className={headerClasses}>
        <div className="container mx-auto px-6 h-full ">
          <div className="flex items-center justify-between h-full relative">
            {isMobile ? (
              <>
                <button
                  onClick={handleLogoClick}
                  className="flex-shrink-0 focus:outline-none cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <Image
                    src={Logo || "/placeholder.svg"}
                    alt="SBUILDING Logo"
                    className="w-28 h-auto"
                    priority
                  />
                </button>

                <button
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="relative z-[60] p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <div
                    className={`transition-all duration-200 ${
                      isMenuOpen ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </div>
                </button>
              </>
            ) : (
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
                            <button
                              onClick={toggleProjects}
                              className={`text-white font-medium text-base tracking-wide flex items-center px-5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                                isActive(item.href) ||
                                isProjectsOpen ||
                                isOnProjectPage()
                                  ? "bg-blue-500/30 border-blue-400/60 text-blue-50 shadow-lg shadow-blue-500/20"
                                  : "bg-white/8 border-white/15 hover:bg-white/15 hover:border-white/25"
                              }`}
                            >
                              <span className="flex items-center">
                                {item.name}
                                {isOnProjectPage() && (
                                  <span className="w-2 h-2 bg-blue-400 rounded-full ml-2 shadow-sm shadow-blue-400/50 animate-pulse" />
                                )}
                              </span>
                              <ChevronDown
                                size={14}
                                className={`ml-1.5 transition-transform duration-200 ${
                                  isProjectsOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {isProjectsOpen && (
                              <div className="absolute left-0 mt-2 w-64 bg-gradient-to-br from-blue-900/98 to-slate-900/95 backdrop-blur-2xl rounded-2xl py-3 shadow-2xl border border-white/30 ring-1 ring-blue-400/20 animate-fade-in-scale">
                                <div className="px-3 pb-2 border-b border-white/10">
                                  <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                                    Our Projects
                                  </p>
                                </div>
                                {item.subItems.map((sub) => (
                                  <button
                                    key={sub.name}
                                    onClick={() => {
                                      handleSubClick(sub.href);
                                      setIsProjectsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer group relative hover:translate-x-1 ${
                                      isSubItemActive(sub.href)
                                        ? "text-blue-50 bg-gradient-to-r from-blue-500/40 to-cyan-500/30 shadow-md"
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      {isSubItemActive(sub.href) && (
                                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 shadow-sm shadow-blue-400/50 animate-pulse" />
                                      )}
                                      <span className="flex-1">{sub.name}</span>
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
                                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => handleNavClick(item.href)}
                            className={`text-white font-medium text-base tracking-wide px-5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                              isActive(item.href)
                                ? "bg-blue-500/30 border-blue-400/60 text-blue-50 shadow-lg shadow-blue-500/20"
                                : "bg-white/8 border-white/15 hover:bg-white/15 hover:border-white/25"
                            }`}
                          >
                            <span className="relative">
                              {item.name}
                              {isActive(item.href) && (
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />
                              )}
                            </span>
                          </button>
                        )}
                      </div>
                    ))}
                  </nav>

                  <button
                    onClick={handleLogoClick}
                    className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Image
                      src={Logo || "/placeholder.svg"}
                      alt="SBUILDING Logo"
                      className={`transition-all duration-500 ${
                        scrolled || isSpecialPage ? "w-36" : "w-40"
                      }`}
                      priority
                    />
                  </button>

                  <nav className="flex items-center gap-6">
                    {navItems.slice(2).map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className={`text-white font-medium text-base tracking-wide px-5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                          isActive(item.href)
                            ? "bg-blue-500/30 border-blue-400/60 text-blue-50 shadow-lg shadow-blue-500/20"
                            : "bg-white/8 border-white/15 hover:bg-white/15 hover:border-white/25"
                        }`}
                      >
                        <span className="relative">
                          {item.name}
                          {isActive(item.href) && (
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />
                          )}
                        </span>
                      </button>
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
      </header>

      {isMobile && isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 animate-fade-in"
            onClick={closeMenu}
          />

          <nav className="fixed top-24 left-4 right-4 bottom-4 z-40 bg-gradient-to-br from-blue-900/98 via-blue-800/98 to-slate-900/98 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-slide-in-top">
            <div className="flex-shrink-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {navItems.map((item, idx) => (
                <div
                  key={item.name}
                  className="animate-slide-in-left"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => setIsProjectsOpen((v) => !v)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl text-white font-medium text-lg tracking-wide border transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98] ${
                          isActive(item.href) || isOnProjectPage()
                            ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <span className="flex items-center">
                          {item.name}
                          {(isActive(item.href) || isOnProjectPage()) && (
                            <span className="w-2 h-2 bg-blue-400 rounded-full ml-3 animate-pulse" />
                          )}
                        </span>
                        <ChevronRight
                          size={18}
                          className={`transition-transform duration-300 ${
                            isProjectsOpen ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {isProjectsOpen && (
                        <div className="ml-4 mt-2 space-y-2 overflow-hidden animate-expand-down">
                          {item.subItems.map((sub) => (
                            <button
                              key={sub.name}
                              onClick={() => handleSubClick(sub.href)}
                              className={`w-full text-left p-3 rounded-xl text-base font-medium border transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98] ${
                                isSubItemActive(sub.href)
                                  ? "bg-gradient-to-r from-blue-500/40 to-cyan-500/30 text-blue-50 border-blue-400/60 shadow-md"
                                  : "text-gray-300 bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20"
                              }`}
                            >
                              <span className="flex items-center">
                                {sub.name}
                                {isSubItemActive(sub.href) && (
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-2 animate-pulse" />
                                )}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left p-4 rounded-2xl text-white font-medium text-lg tracking-wide border transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98] ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <span className="flex items-center">
                        {item.name}
                        {isActive(item.href) && (
                          <span className="w-2 h-2 bg-blue-400 rounded-full ml-3 animate-pulse" />
                        )}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex-shrink-0 p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-transparent">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors duration-200">
                <LocaleSwitcher variant="mobile" onLocaleChange={closeMenu} />
              </div>
            </div>
          </nav>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInTop {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expandDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 500px;
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.15s ease-out;
        }

        .animate-slide-in-top {
          animation: slideInTop 0.3s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.4s ease-out both;
        }

        .animate-expand-down {
          animation: expandDown 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}

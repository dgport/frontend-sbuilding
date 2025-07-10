"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales } from "./routing";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { English, Georgian } from "@/components/svg";

type Locale = "en" | "ka";

const LanguageFlags = {
  en: () => <English className="h-6 w-6" />,
  ka: () => <Georgian className="h-6 w-6" />,
};

const languageNames: Record<Locale, string> = {
  en: "English",
  ka: "ქართული",
};

interface LocaleSwitcherProps {
  variant?: "mobile" | "desktop";
  onLocaleChange?: () => void;
}

export default function LocaleSwitcher({
  variant = "desktop",
  onLocaleChange,
}: LocaleSwitcherProps) {
  const t = useTranslations("main");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    const pathWithoutLocale = pathname.replace(
      new RegExp(`^/${currentLocale}`),
      ""
    );
    const searchParams = new URLSearchParams(window.location.search).toString();
    const queryString = searchParams ? `?${searchParams}` : "";
    const newPath = `/${newLocale}${pathWithoutLocale}${queryString}`;

    router.push(newPath);
    router.refresh();

    setIsOpen(false);
    onLocaleChange?.();
  };

  const CurrentFlag = LanguageFlags[currentLocale];

  if (variant === "mobile") {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/80 text-sm font-medium tracking-wide">
            {t("changeLang") || "Language"}
          </span>
          <div className="flex items-center gap-2">
            <CurrentFlag />
            <span className="text-white text-sm font-medium">
              {languageNames[currentLocale]}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {(locales as unknown as Locale[]).map((locale) => {
            const Flag = LanguageFlags[locale];
            const isActive = locale === currentLocale;

            return (
              <Button
                key={locale}
                variant={isActive ? "default" : "outline"}
                className={`flex items-center justify-center gap-2 px-4 py-3 text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/30 text-indigo-100 border-2 border-indigo-400/50 shadow-lg shadow-indigo-500/20"
                    : "bg-white/5 text-white/80 border-2 border-white/20 hover:bg-indigo-500/20 hover:text-indigo-100 hover:border-indigo-400/40 hover:shadow-md hover:shadow-indigo-500/10"
                }`}
                onClick={() => handleLocaleChange(locale)}
                disabled={isActive}
              >
                <Flag />
                <span className="font-geo2 tracking-wider">
                  {languageNames[locale]}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex gap-2 items-center cursor-pointer p-2 rounded-full hover:bg-white/10 transition-all duration-200 group">
          <div className="relative">
            <CurrentFlag />
            <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-all duration-200" />
          </div>
          <span className="md:hidden text-white font-medium">
            {t("changeLang") || "Language"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="absolute inset-0 opacity-5 rounded-lg">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 grid gap-1">
          {(locales as unknown as Locale[]).map((locale) => {
            const Flag = LanguageFlags[locale];
            const isActive = locale === currentLocale;

            return (
              <Button
                key={locale}
                variant="ghost"
                className={`justify-start gap-3 w-full py-3 text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/30"
                    : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20"
                }`}
                onClick={() => handleLocaleChange(locale)}
                disabled={isActive}
              >
                <Flag />
                <span className="font-geo2 tracking-wide">
                  {languageNames[locale]}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
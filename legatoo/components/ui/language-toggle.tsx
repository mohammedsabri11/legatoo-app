"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Locale } from "@/locales";

interface LanguageOption {
  code: Locale;
  name: string;
  flag: string;
  flagDescription: string;
}

const languages: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    flagDescription: "USA Flag",
  },
  {
    code: "ar",
    name: "العربية",
    flag: "🇸🇦",
    flagDescription: "Saudi Arabia Flag",
  },
];

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === 'ar';

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:text-foreground transition-all duration-200    border-border rounded-md hover:bg-accent hover:border-primary/50 hover:shadow-sm cursor-pointer ${isRTL ? 'flex-row-reverse' : ''} ${
          isOpen ? 'bg-accent border-primary/50 shadow-sm' : ''
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        {/* <span className="text-lg">{currentLanguage.flag}</span> */}
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <Globe
          className={`h-4 w-4 text-primary transition-all duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-gray-500"
          }`}
        />
      </button>

      {isOpen && (
        <div className={`absolute mt-2 w-40 bg-background border border-border rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200 ${isRTL ? 'left-0' : 'right-0'}`}>
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-all duration-150 ${
                  locale === language.code
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-foreground hover:font-medium"
                } ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>{language.name}</span>
                {locale === language.code && (
                  <span className={`text-primary font-bold ${isRTL ? 'mr-auto' : 'ml-auto'}`}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

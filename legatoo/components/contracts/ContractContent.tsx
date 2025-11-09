"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";
import clsx from "clsx";
import { normalizeContractContent } from "@/utils/contractFormatting";

const RTL_LOCALE_PREFIXES = [
  "ar",
  "fa",
  "he",
  "ku",
  "ps",
  "ur",
  "sd",
  "dv",
];
const RTL_CHAR_PATTERN = /[\u0590-\u08FF]/;

interface ContractContentProps {
  content: string | null | undefined;
  className?: string;
  locale?: string;
}

export function ContractContent({ content, className, locale }: ContractContentProps) {
  const normalizedHtml = useMemo<string>(() => {
    const normalized = normalizeContractContent(content ?? "");
    return DOMPurify.sanitize(normalized, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "span",
      ],
      ALLOWED_ATTR: {
        p: ["dir"],
        h1: ["dir"],
        h2: ["dir"],
        h3: ["dir"],
        h4: ["dir"],
        h5: ["dir"],
        h6: ["dir"],
        span: ["class"],
      },
    }) as string;
  }, [content]);

  const isRTL = useMemo(() => {
    const normalizedLocale = (locale ?? "").toLowerCase();
    const localeIsRTL = normalizedLocale
      ? RTL_LOCALE_PREFIXES.some((prefix) =>
          normalizedLocale.startsWith(prefix)
        )
      : false;

    if (localeIsRTL) {
      return true;
    }

    const plainText = (content ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return RTL_CHAR_PATTERN.test(plainText);
  }, [content, locale]);

  return (
    <div
      className={clsx(
        "contract-viewer",
        isRTL ? "contract-viewer-rtl" : "contract-viewer-ltr",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
}



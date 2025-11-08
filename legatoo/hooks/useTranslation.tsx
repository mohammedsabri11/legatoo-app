'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { Locale, messages, defaultLocale, TranslationKey, getNestedValue, interpolateVariables } from '@/locales'

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, variables?: Record<string, string>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

interface TranslationProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

export function TranslationProvider({ children, initialLocale = defaultLocale }: TranslationProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  // Save locale preference to localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ar')) {
      setLocale(savedLocale)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('locale', locale)
    // Update document direction for Arabic
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }, [locale])

  const t = (key: TranslationKey, variables?: Record<string, string>): string => {
    const text = getNestedValue(messages[locale], key)
    return interpolateVariables(text, variables)
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

// Hook for getting current locale without context (useful for server-side)
export function useLocale() {
  return typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale) || defaultLocale : defaultLocale
}

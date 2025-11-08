import en from './en/common.json'
import ar from './ar/common.json'
import landingEn from '../components/landing/locales/en/landing.json'
import landingAr from '../components/landing/locales/ar/landing.json'
import companyEstablishmentEn from '../components/company-establishment/locales/en/company-establishment.json'
import companyEstablishmentAr from '../components/company-establishment/locales/ar/company-establishment.json'
import subscriptionsEn from '../components/supscriptions/locales/en/subscriptions.json'
import subscriptionsAr from '../components/supscriptions/locales/ar/subscriptions.json'
import faqEn from '../components/faq/locales/en/faq.json'
import faqAr from '../components/faq/locales/ar/faq.json'
import templatesEn from '../app/dashboard/templates/locales/en/templates.json'
import templatesAr from '../app/dashboard/templates/locales/ar/templates.json'
import templateUseEn from '../app/dashboard/templates/locales/en/template-use.json'
import templateUseAr from '../app/dashboard/templates/locales/ar/template-use.json'

export type Locale = 'en' | 'ar'

export const locales: Locale[] = ['en', 'ar']

export const defaultLocale: Locale = 'en'

export const messages = {
  en: { ...en, landing: landingEn, companyEstablishment: companyEstablishmentEn, subscriptions: subscriptionsEn, faq: faqEn, templates: templatesEn, templateUse: templateUseEn },
  ar: { ...ar, landing: landingAr, companyEstablishment: companyEstablishmentAr, subscriptions: subscriptionsAr, faq: faqAr, templates: templatesAr, templateUse: templateUseAr },
} as const

export type Messages = typeof messages

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationKey = NestedKeyOf<typeof messages.en>

// Helper function to get nested value from object using dot notation
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
  return typeof result === 'string' ? result : path
}

// Global variables that are available in all translations
export const globalVariables = {
  appname: 'Legatoo'
}

// Helper function to interpolate variables in translation strings
export function interpolateVariables(text: string, variables: Record<string, string> = {}): string {
  // Merge global variables with provided variables (provided variables take precedence)
  const allVariables = { ...globalVariables, ...variables }
  return text.replace(/\{(\w+)\}/g, (match, key) => (allVariables as Record<string, string>)[key] || match)
}

// Translation function
export function t(key: TranslationKey, locale: Locale = defaultLocale, variables?: Record<string, string>): string {
  const text = getNestedValue(messages[locale], key)
  return interpolateVariables(text, variables)
}

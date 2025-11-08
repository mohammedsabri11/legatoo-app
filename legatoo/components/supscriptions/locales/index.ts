import en from './en/subscriptions.json'
import ar from './ar/subscriptions.json'

export type Locale = 'en' | 'ar'

export const locales: Locale[] = ['en', 'ar']

export const defaultLocale: Locale = 'en'

export const messages = {
  en,
  ar,
} as const

export type Messages = typeof messages

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationKey = NestedKeyOf<typeof en>

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

// Helper function to interpolate variables in translation strings
export function interpolateVariables(text: string, variables: Record<string, string> = {}): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match)
}

// Translation function
export function t(key: TranslationKey, locale: Locale = defaultLocale, variables?: Record<string, string>): string {
  const text = getNestedValue(messages[locale], key)
  return interpolateVariables(text, variables)
}

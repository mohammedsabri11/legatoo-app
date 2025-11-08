import en from './en/templates.json'
import ar from './ar/templates.json'

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


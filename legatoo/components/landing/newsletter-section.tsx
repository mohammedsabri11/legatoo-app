'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Mail, Send } from 'lucide-react'

export function NewsletterSection() {
  const { t } = useTranslation()
  return (
    <section className="bg-neutral-1000-light  py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl !text-white font-bold mb-4">{t('landing.newsletter.title')}</h2>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder={t('landing.newsletter.placeholder')}
            className="flex-1 px-3 py-2 bg-white text-neutral-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-transparent"
          />
          <button className="flex items-center gap-2 px-6 py-2 text-white bg-primary rounded-md hover:bg-primary/90 transition-colors font-medium">
            <Send className="w-4 h-4" />
            {t('landing.newsletter.cta')}
          </button>
        </div>
      </div>
    </section>
  )
}

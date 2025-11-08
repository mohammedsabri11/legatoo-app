'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function HighlightsSection() {
  const { t } = useTranslation()
  return (
    <section className="py-24 text-white bg-neutral-1000 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold mb-12 text-center !text-white">{t('landing.highlights.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-warning-500">{t('landing.highlights.stats.estatePlanning.number')}</div>
            <div className="text-lg font-semibold mb-2">{t('landing.highlights.stats.estatePlanning.label')}</div>
            <p className="text-sm text-neutral-300">
              {t('landing.highlights.stats.estatePlanning.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-warning-500">{t('landing.highlights.stats.businesses.number')}</div>
            <div className="text-lg font-semibold mb-2">{t('landing.highlights.stats.businesses.label')}</div>
            <p className="text-sm text-neutral-300">
              {t('landing.highlights.stats.businesses.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-warning-500">{t('landing.highlights.stats.experience.number')}</div>
            <div className="text-lg font-semibold mb-2">{t('landing.highlights.stats.experience.label')}</div>
            <p className="text-sm text-neutral-300">
              {t('landing.highlights.stats.experience.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function AttorneysSection() {
  const { t } = useTranslation()
  return (
    <section className="py-16 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t('landing.attorneys.title')}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto text-pretty">
          {t('landing.attorneys.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors">
            {t('landing.attorneys.buttons.getLegalHelp')}
          </button>
      
          <button className="px-6 py-3 text-base font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            {t('landing.attorneys.buttons.scheduleCall')}
          </button>
          <button className="px-6 py-3 text-base font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
            {t('landing.attorneys.buttons.attorneyDirectory')}
          </button>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function ServicesSection() {
  const { t } = useTranslation()
  return (
    <section className="py-16 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">{t('landing.services.title')}</h2>

        <div className="space-y-16">
          {/* Business Services */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-warning-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Business professional image placeholder</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t('landing.services.business.title')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('landing.services.business.description')}
              </p>
              <button className="px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors mb-4">
                {t('landing.services.business.cta')}
              </button>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.business.options.llc')}
                </button>
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.business.options.corporation')}
                </button>
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.business.options.dba')}
                </button>
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.business.options.getLegalHelp')}
                </button>
              </div>
            </div>
          </div>

          {/* Family Services */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="w-full h-96 bg-gradient-to-br from-success-500/20 to-primary/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-success-500 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Family at home image placeholder</p>
                </div>
              </div>
            </div>
            <div className="lg:order-1">
              <h3 className="text-2xl font-bold text-foreground mb-4">{t('landing.services.family.title')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('landing.services.family.description')}
              </p>
              <button className="px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors mb-4">
                {t('landing.services.family.cta')}
              </button>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.family.options.lastWill')}
                </button>
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.family.options.livingTrust')}
                </button>
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.family.options.powerOfAttorney')}
                </button>
              </div>
              <div className="mt-4">
                <button className="px-6 py-3 text-base font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.business.options.getLegalHelp')}
                </button>
              </div>
            </div>
          </div>

          {/* IP Services */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-warning-500/20 to-error-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Intellectual property work image placeholder</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t('landing.services.ip.title')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('landing.services.ip.description')}
              </p>
              <button className="px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors mb-4">
                {t('landing.services.ip.cta')}
              </button>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.ip.options.trademarks')}
                </button>
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.ip.options.copyrights')}
                </button>
                <button className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  {t('landing.services.ip.options.patents')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export function CompanyCtaSection() {
  const { t } = useTranslation()
  
  return (
    <section className="py-20" style={{ backgroundColor: '#182A65' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          {t('companyEstablishment.cta.title')}
        </h2>
        <p className="text-xl text-white/90 mb-8">
          {t('companyEstablishment.cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            className="px-10 py-4 bg-[#679594] text-white text-lg font-semibold rounded-lg hover:bg-[#5a8482] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t('companyEstablishment.cta.buttons.startNow')}
          </button>
          <button 
            className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-[#182A65] transition-all duration-300"
          >
            {t('companyEstablishment.cta.buttons.scheduleConsultation')}
          </button>
        </div>
      </div>
    </section>
  )
}

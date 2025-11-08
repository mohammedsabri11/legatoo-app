'use client'

import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export function CompanyProcessSection() {
  const { t } = useTranslation()
  
  const processSteps = [
    { 
      step: t('companyEstablishment.process.steps.consultation.step'), 
      title: t('companyEstablishment.process.steps.consultation.title'), 
      desc: t('companyEstablishment.process.steps.consultation.description') 
    },
    { 
      step: t('companyEstablishment.process.steps.structureSelection.step'), 
      title: t('companyEstablishment.process.steps.structureSelection.title'), 
      desc: t('companyEstablishment.process.steps.structureSelection.description') 
    },
    { 
      step: t('companyEstablishment.process.steps.documentPreparation.step'), 
      title: t('companyEstablishment.process.steps.documentPreparation.title'), 
      desc: t('companyEstablishment.process.steps.documentPreparation.description') 
    },
    { 
      step: t('companyEstablishment.process.steps.registration.step'), 
      title: t('companyEstablishment.process.steps.registration.title'), 
      desc: t('companyEstablishment.process.steps.registration.description') 
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('companyEstablishment.process.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('companyEstablishment.process.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-[#679594] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

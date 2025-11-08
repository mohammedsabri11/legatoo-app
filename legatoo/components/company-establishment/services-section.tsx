'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function CompanyServicesSection() {
  const { t } = useTranslation()
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('companyEstablishment.services.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('companyEstablishment.services.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-[#679594] rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('companyEstablishment.services.items.legalStructure.title')}
            </h3>
            <p className="text-gray-600">
              {t('companyEstablishment.services.items.legalStructure.description')}
            </p>
          </div>
          
          {/* Service 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-[#679594] rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('companyEstablishment.services.items.documentPreparation.title')}
            </h3>
            <p className="text-gray-600">
              {t('companyEstablishment.services.items.documentPreparation.description')}
            </p>
          </div>
          
          {/* Service 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-[#679594] rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('companyEstablishment.services.items.licenseAcquisition.title')}
            </h3>
            <p className="text-gray-600">
              {t('companyEstablishment.services.items.licenseAcquisition.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function CompanyHeroSection() {
  const { t } = useTranslation()
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/company-hero-bg.jpg"
          alt="Professional business team in modern office"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Blue Overlay with 60% opacity */}
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(24, 42, 101, 0.6)' }}></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          {t('companyEstablishment.hero.title')}
        </h1>
        
        {/* Subtext */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          {t('companyEstablishment.hero.description')}
        </p>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            className="px-10 py-4 bg-[#679594] text-white text-lg font-semibold rounded-lg hover:bg-[#5a8482] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            style={{ backgroundColor: '#679594' }}
          >
            {t('companyEstablishment.hero.buttons.startBuilding')}
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            className="px-10 py-4 bg-transparent border-2 border-[#679594] text-[#679594] text-lg font-semibold rounded-lg hover:bg-[#679594] hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            {t('companyEstablishment.hero.buttons.bookConsultation')}
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

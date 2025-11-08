'use client'

import Image from 'next/image'
import heroImage from '@/public/landing/hero.jpg'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

export function HeroSection() {
  const { t, locale } = useTranslation()
  
  // Choose video based on language
  const videoSrc = locale === 'ar' ? '/video/3.mp4' : '/video/3b.mp4'
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          key={locale} // Force re-render when language changes
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
          {/* Fallback image if video doesn't load */}
          <Image 
            src={heroImage}
            alt="Professional legal consultation meeting" 
            fill
            className="object-cover"
            priority
          />
        </video>
        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="lg:w-[50%] gap-12 items-center">
          <div className="text-white">
            {/* Online Status Message */}
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance !text-white">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-200 mb-8 text-pretty">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/company-establishment">
              <button className="px-8 py-4 text-lg font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-lg">
                {t('hero.buttons.businessFormation')}
              </button>
              </Link>
              <button className="px-8 py-4 text-lg font-medium text-white bg-transparent border-2 border-white rounded-md hover:bg-white hover:text-gray-900 transition-colors">
                {t('hero.buttons.meetLawyer')}
              </button>
              <button className="px-8 py-4 text-lg font-medium text-white bg-transparent border-2 border-white rounded-md hover:bg-white hover:text-gray-900 transition-colors">
                {t('hero.buttons.trademarkProtection')}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

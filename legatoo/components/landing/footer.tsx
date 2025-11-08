'use client'

import { useTranslation } from '@/hooks/useTranslation'
import Image from 'next/image'
import Link from 'next/link'
export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-neutral-1000  text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4 !text-white">{t('footer.company.title')}</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.company.about')}
                </Link> 
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.company.careers')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.company.contact')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.company.news')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.company.press')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.company.investorRelations')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 !text-white">{t('footer.support.title')}</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.support.helpCenter')}
                </Link>
              </li>
              <li>
                    <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.support.customerCare')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.support.speakWithAttorney')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.support.joinAttorneyNetwork')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.support.security')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 !text-white">{t('footer.learnMore.title')}</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.learnMore.businessContracts')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.learnMore.businessNameGenerator')}
                </Link>
              </li>
              <li>
                  <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.learnMore.legalFormTemplates')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.learnMore.startLLC')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.learnMore.startCorporation')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  {t('footer.learnMore.trademarkName')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/logo.png"
                  alt="Legatoo Logo"
                  width={120}
                  height={40}
                  className="h-18 w-auto brightness-0 invert"
                />
              </Link>
            </div>
            <p className="text-sm text-neutral-300 mb-4">{t('footer.legal.copyright')}</p>
            <p className="text-xs text-neutral-400">
              {t('footer.legal.disclaimer')}
            </p>
          </div>
        </div>
        {/* Social Media and Payment Methods Section */}
        <div className="border-t border-neutral-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Media Icons - Center */}
            <div className="flex items-center justify-center gap-4">
              {/* WhatsApp */}
              <Link href="#" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </Link>
              
              {/* X (Twitter) */}
              <Link href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              
              {/* Instagram */}
              <Link href="#" className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                </Link>
              
              {/* LinkedIn */}
              <Link href="#" className="w-10 h-10 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center  transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Link> 
            </div>
            
            {/* Payment Methods - Right */}
            <div className="flex items-center gap-4">
              <span className='text-sm text-neutral-300'>{t('footer.legal.paymentMethods')}</span>
              <div className="flex items-center gap-3">
                {/* MasterCard */}
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  <div className="flex">
                    <div className="w-4 h-4 bg-red-500 rounded-full -mr-1"></div>
                    <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                {/* VISA */}
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">VISA</span>
                </div>
                {/* Apple Pay */}
                <div className="w-12 h-8 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Pay</span>
                </div>
                {/* CSAP/Mada */}
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center border">
                  <span className="text-xs font-semibold text-green-600">mada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Attorney Advertisement */}
        <div className="border-t border-neutral-700 mt-8 pt-6">
          <div className="text-center text-xs text-neutral-400">
              <p>
                {t('footer.legal.attorneyAdvertisement')}
              </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

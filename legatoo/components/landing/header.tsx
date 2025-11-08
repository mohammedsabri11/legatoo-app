'use client'

import { Phone, Menu, X } from "lucide-react"
// import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "@/components/ui"
import { useState } from "react"
import Image from "next/image"
import { useTranslation } from '@/hooks/useTranslation'
import Link from "next/link"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
    // Close mobile menu after clicking
    setIsMobileMenuOpen(false)
  }
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm shadow-md border-border">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/logo.png"
                alt="Legatoo Logo"
                width={180}
                height={100}
                className=""
                priority
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-semibold">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              {t('navigation.home')}
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              {t('navigation.services')}
            </button>
            <button 
              onClick={() => scrollToSection('subscriptions')} 
              className="text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              {t('navigation.supscriptions')}
            </button>
            <button 
              onClick={() => scrollToSection('attorneys')} 
              className="text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              {t('navigation.about')}
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              {t('navigation.faq')}
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              {t('navigation.contact')}
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4 font-semibold">
            <div className="hidden md:flex items-center space-x-2 text-sm text-foreground">
              <Phone className="h-4 w-4" />
              <span dir="ltr" className="!text-left">
                  {t('contact.info.phone.value')}

                  </span>
            </div>
            <LanguageToggle />
            {/* <ThemeToggle /> */}
            <Link href="/auth/login" className=" px-2  md:px-4 py-2 text-sm font-medium  cursor-pointer bg-primary text-primary-foreground  border border-border rounded-md hover:bg-primary/90 transition-colors">
            {t('navigation.login')}
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-4">
              <nav className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-foreground hover:text-primary cursor-pointer transition-colors py-2 text-left"
                >
                  {t('navigation.home')}
                </button>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-foreground hover:text-primary cursor-pointer transition-colors py-2 text-left"
                >
                  {t('navigation.services')}
                </button>
                <button 
                  onClick={() => scrollToSection('subscriptions')} 
                  className="text-foreground hover:text-primary cursor-pointer transition-colors py-2 text-left"
                >
                  {t('navigation.supscriptions')}
                </button>
                <button 
                  onClick={() => scrollToSection('attorneys')} 
                  className="text-foreground hover:text-primary cursor-pointer transition-colors py-2 text-left"
                >
                  {t('navigation.about')}
                </button>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="text-foreground hover:text-primary cursor-pointer transition-colors py-2 text-left"
                >
                  {t('navigation.faq')}
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-foreground hover:text-primary cursor-pointer transition-colors py-2 text-left"
                >
                  {t('navigation.contact')}
                </button>
              </nav>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm text-foreground !text-left">
                  <Phone className="h-4 w-4" />
                  <span dir="ltr" className="!text-left">
                  {t('contact.info.phone.value')}

                  </span>
                </div>
              
              </div>
             
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

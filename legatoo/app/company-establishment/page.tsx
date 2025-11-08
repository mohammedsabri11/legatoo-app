'use client'

import React from 'react'
import { 
  CompanyHeroSection, 
  CompanyServicesSection, 
  CompanyProcessSection, 
  CompanyCtaSection 
} from '@/components/company-establishment'

const CompanyEstablishmentPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      
      {/* Hero Section */}
      <CompanyHeroSection />

      {/* Service Features Section */}
      <CompanyServicesSection />

      {/* Process Steps Section */}
      <CompanyProcessSection />

      {/* CTA Section */}
      <CompanyCtaSection />
    </div>
  )
}

export default CompanyEstablishmentPage
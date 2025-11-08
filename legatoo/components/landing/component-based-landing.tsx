import React from 'react'
import { Header } from './header'
import { HeroSection } from './hero-section'
import { AttorneysSection } from './attorneys-section'
import { HighlightsSection } from './highlights-section'
import { WhyChooseSection } from './why-choose-section'
import { ServicesSection } from './services-section'
import { TestimonialsSection } from './testimonials-section'
import { NewsletterSection } from './newsletter-section'
import { ContactSection } from './contact-section'
import { Footer } from './footer'
import { ScrollToTop } from './scroll-to-top'
import { SupscriptionsPage } from './subscriptions'
import { FaqPage } from './faq'

export interface ComponentBasedLandingProps {
  className?: string
}

const ComponentBasedLanding: React.FC<ComponentBasedLandingProps> = ({ className }) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Header />
      <section id="home">
        <HeroSection />
      </section>
      <section id="attorneys">
        <AttorneysSection />
      </section>
      <section id="highlights">
        <HighlightsSection />
      </section>
      <section id="why-choose">
        <WhyChooseSection />
      </section>
      <section id="services">
        <ServicesSection />
      </section>
      <section id="subscriptions">
        <SupscriptionsPage />
      </section>
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <section id="faq">
        <FaqPage />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <NewsletterSection />
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export { ComponentBasedLanding }

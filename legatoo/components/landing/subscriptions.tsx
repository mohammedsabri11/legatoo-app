'use client'

import React from 'react'
import { SubscriptionCards, ComparisonTable, TechnicalMechanisms } from '@/components/supscriptions'

export   function SupscriptionsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      
      {/* Subscription Cards */}
      <SubscriptionCards />
      
      {/* Comparison Table */}
      {/* <ComparisonTable /> */}
      
      {/* Technical Mechanisms */}
      <TechnicalMechanisms />
      
      {/* Footer */}
    </div>
  )
}
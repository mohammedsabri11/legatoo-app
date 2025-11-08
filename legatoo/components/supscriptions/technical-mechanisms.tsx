'use client'

import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Shield, TrendingUp, BarChart3, Bell, Zap } from 'lucide-react'

export function TechnicalMechanisms() {
  const { t } = useTranslation()

  const mechanisms = [
    {
      key: 'tokenTracking',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      key: 'rateLimiting',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      key: 'monitoringAlerts',
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200'
    }
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('subscriptions.technicalMechanisms.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subscriptions.technicalMechanisms.subtitle')}
          </p>
        </div>

        {/* Mechanisms Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {mechanisms.map((mechanism, index) => {
            const IconComponent = mechanism.icon
            return (
              <div
                key={mechanism.key}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8 `}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${mechanism.bgColor} rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  <IconComponent className={`h-8 w-8 ${mechanism.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {t(`subscriptions.technicalMechanisms.mechanisms.${index}.title`)}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-center leading-relaxed">
                  {t(`subscriptions.technicalMechanisms.mechanisms.${index}.description`)}
                </p>

                {/* Additional Visual Elements */}
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Zap className="h-4 w-4" />
                    <span>نظام متقدم</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
 
      </div>
    </div>
  )
}

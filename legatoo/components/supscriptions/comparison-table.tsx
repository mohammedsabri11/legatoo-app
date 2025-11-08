'use client'

import React from 'react'
import { Check, X, Minus } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function ComparisonTable() {
  const { t } = useTranslation()

  const features = [
    {
      key: 'fileUpload',
      icon: '📁'
    },
    {
      key: 'aiChat',
      icon: '🤖'
    },
    {
      key: 'contractGeneration',
      icon: '📄'
    },
    {
      key: 'reportsExport',
      icon: '📊'
    },
    {
      key: 'multiUser',
      icon: '👥'
    },
    {
      key: 'governmentIntegrations',
      icon: '🏛️'
    }
  ]

  const plans = ['free', 'monthly', 'annual']

  const getFeatureValue = (featureKey: string, planKey: string) => {
    return t(`subscriptions.comparison.table.${featureKey}.${planKey}` as never)
  }

  const getFeatureNote = (featureKey: string) => {
    return t(`subscriptions.comparison.table.${featureKey}.note` as never)
  }

  const renderFeatureIcon = (value: string) => {
    if (value.toLowerCase().includes('disabled') || value.toLowerCase().includes('لا') || value.toLowerCase().includes('no')) {
      return <X className="h-5 w-5 text-red-500" />
    } else if (value.toLowerCase().includes('unlimited') || value.toLowerCase().includes('غير محدود')) {
      return <Check className="h-5 w-5 text-green-500" />
    } else {
      return <Minus className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('subscriptions.comparison.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subscriptions.comparison.subtitle')}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-b">
                  {t('subscriptions.comparison.features.fileUpload').split(' ')[0]}
                </th>
                {plans.map((plan) => (
                  <th key={plan} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b">
                    {t(`subscriptions.comparison.plans.${plan}` as never)}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-b">
                  {t('subscriptions.comparison.notes')}
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Feature Name */}
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {t(`subscriptions.comparison.features.${feature.key}` as never)}
                      </span>
                    </div>
                  </td>

                  {/* Plan Values */}
                  {plans.map((plan) => {
                    const value = getFeatureValue(feature.key, plan)
                    return (
                      <td key={plan} className="px-6 py-4 text-center border-b">
                        <div className="flex items-center justify-center gap-2">
                          {renderFeatureIcon(value)}
                          <span className="text-sm text-gray-700">{value}</span>
                        </div>
                      </td>
                    )
                  })}

                  {/* Notes */}
                  <td className="px-6 py-4 text-right border-b">
                    <span className="text-xs text-gray-500">
                      {getFeatureNote(feature.key)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

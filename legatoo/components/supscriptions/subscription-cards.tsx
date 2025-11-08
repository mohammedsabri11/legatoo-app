'use client'

import React from 'react'
import { Check, X, Star } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function SubscriptionCards() {
  const { t } = useTranslation()

  const plans = [
    {
      key: 'freeTrial',
      popular: false,
      borderColor: 'border-gray-200',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      buttonColor: 'bg-primary hover:bg-primary/90',

    },
    {
      key: 'monthly',
      popular: true,
      borderColor: 'border-primary',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      buttonColor: 'bg-primary hover:bg-primary/90',
    },
    {
      key: 'annual',
      popular: false,
      borderColor: 'border-green-500',
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      buttonColor: 'bg-primary hover:bg-primary/90',

    }
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('subscriptions.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subscriptions.subtitle')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.key} 
              className={`subscription-card relative shadow-lg rounded-2xl ${plan.bgColor} ${plan.borderColor} ${plan.textColor}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 transition-all duration-300 ease-in-out transform hover:scale-110">
                    <Star className="h-4 w-4 fill-current" />
                    الأكثر شعبية
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col justify-between h-full">
               <div className="">
                 {/* Plan Icon & Name */}
                 <div className="text-center mb-6">
                  <h3 className="text-2xl mt-4 font-bold text-primary  mb-2">
                    {t(`subscriptions.plans.${plan.key}.name` as never)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t(`subscriptions.plans.${plan.key}.description` as never)}
                  </p>
                  <div className="text-3xl font-bold text-primary">
                    {t(`subscriptions.plans.${plan.key}.price` as never)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t(`subscriptions.plans.${plan.key}.period` as never)}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-green-600">
                    {t(`subscriptions.plans.${plan.key}.features.title` as never)}
                  </h4>
                  <ul className="space-y-2">
                    {plan.key === 'freeTrial' && (
                      <>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.freeTrial.features.items.0')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.freeTrial.features.items.1')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.freeTrial.features.items.2')}</span>
                        </li>
                      </>
                    )}
                    {plan.key === 'monthly' && (
                      <>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.monthly.features.items.0')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.monthly.features.items.1')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.monthly.features.items.2')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.monthly.features.items.3')}</span>
                        </li>
                      </>
                    )}
                    {plan.key === 'annual' && (
                      <>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.annual.features.items.0')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.annual.features.items.1')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.annual.features.items.2')}</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Limitations */}
                <div className="mb-8">
                  <h4 className="font-semibold text-lg mb-3 text-red-600">
                    {t(`subscriptions.plans.${plan.key}.limitations.title` as never)}
                  </h4>
                  <ul className="space-y-2">
                    {plan.key === 'freeTrial' && (
                      <>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.freeTrial.limitations.items.0')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.freeTrial.limitations.items.1')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.freeTrial.limitations.items.2')}</span>
                        </li>
                      </>
                    )}
                    {plan.key === 'monthly' && (
                      <>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.monthly.limitations.items.0')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.monthly.limitations.items.1')}</span>
                        </li>
                      </>
                    )}
                    {plan.key === 'annual' && (
                      <>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.annual.limitations.items.0')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t('subscriptions.plans.annual.limitations.items.1')}</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
               </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${plan.buttonColor}`}
                >
                  {t(`subscriptions.plans.${plan.key}.cta` as never)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

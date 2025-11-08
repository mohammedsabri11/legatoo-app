'use client'

import React, { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { ChevronDown, Search, Mail, Phone } from 'lucide-react'
import { messages } from '@/locales'

interface FaqItem {
  question: string
  answer: string
}

export function FaqAccordion() {
  const { t, locale } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const categories = ['general', 'pricing', 'technical', 'legal']

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getFilteredQuestions = (category: string): FaqItem[] => {
    // Get the questions array directly from the messages object
    const questionsData = (messages[locale]?.faq?.questions as Record<string, FaqItem[]>)?.[category] as FaqItem[] || []
    
    // Debug logging
    
    if (!searchTerm) return questionsData
    
    return questionsData.filter((q: FaqItem) => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => {
            const questionCount = getFilteredQuestions(category).length
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {t(`faq.categories.${category}` as never)} ({questionCount})
              </button>
            )
          })}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {getFilteredQuestions(activeCategory).map((item: FaqItem, index: number) => {
            const key = `${activeCategory}-${index}`
            const isOpen = openItems[key] || false
            
            return (
              <div
                key={key}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(activeCategory, index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('faq.contact.title')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('faq.contact.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`mailto:${t('faq.contact.email')}`}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-1000 text-white rounded-lg  hover:bg-primary/90 transition-colors"
            >
              <Mail className="h-5 w-5" />
              {t('faq.contact.email')}
            </a>
            
            <a
              href={`tel:${t('faq.contact.phone')}`}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Phone className="h-5 w-5" />
              {t('faq.contact.phone')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

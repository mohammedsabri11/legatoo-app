'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { LanguageToggle } from '@/components/ui'
import { useForgotPassword } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const { t, locale } = useTranslation()
  const forgotPasswordMutation = useForgotPassword()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const newErrors = { ...errors }
    
    if (!emailValue.trim()) {
      newErrors.email = locale === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
    } else if (emailValue.length > 254) {
      newErrors.email = locale === 'ar' ? 'البريد الإلكتروني طويل جداً' : 'Email is too long'
    } else if (!emailRegex.test(emailValue)) {
      newErrors.email = locale === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Please enter a valid email address'
    } else {
      delete newErrors.email
    }
    
    setErrors(newErrors)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!email.trim()) {
      newErrors.email = locale === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
    } else if (email.length > 254) {
      newErrors.email = locale === 'ar' ? 'البريد الإلكتروني طويل جداً' : 'Email is too long'
    } else if (!emailRegex.test(email)) {
      newErrors.email = locale === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Clear previous errors
    setErrors({})
    
    // Use React Query mutation
    forgotPasswordMutation.mutate({ email }, {
      onSuccess: () => {
        setIsSubmitted(true)
      },
      onError: (error: unknown) => {
        // Handle API errors - show field-specific errors
        if (error && typeof error === 'object' && 'errors' in error) {
          setErrors((error as { errors: Record<string, string> }).errors)
        }
        // Toast error is handled globally in the hook
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/video/3.mp4" type="video/mp4" />
            <source src="/video/3.webm" type="video/webm" />
          </video>
        {/* Dark Overlay for Better Form Readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t('auth.forgotPassword.backToHome')}
            </span>
          </Link>
          
          {/* Language Toggle */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Success Message */}
        <div className="relative z-20 w-full max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            {/* Logo */}
            <div className="flex justify-center mb-2">
              <Image
                src="/logo.png"
                alt="Legatoo Logo"
                width={180}
                height={30}
                className=""
              />
            </div>

            {/* Success Message */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100/20 backdrop-blur-sm mb-6">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold !text-white mb-4">
                {t('auth.forgotPassword.success.title')}
              </h2>
              <p className="text-sm text-gray-100 mb-8">
                {t('auth.forgotPassword.success.message')}
              </p>
              <div className="space-y-4">
                <Link
                  href="/auth/login"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#679594] hover:bg-[#5a8482] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#679594] transition-colors"
                >
                  {t('auth.forgotPassword.success.backToSignIn')}
                </Link>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                    setErrors({})
                  }}
                  className="w-full flex justify-center items-center py-3 px-4 border border-white/30 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#679594] transition-colors backdrop-blur-sm"
                >
                  {t('auth.forgotPassword.success.tryAgain')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/video/3.mp4" type="video/mp4" />
          <source src="/video/3.webm" type="video/webm" />
        </video>
        {/* Dark Overlay for Better Form Readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Top Navigation */}
      <div className="absolute w-full md:max-w-7xl mx-auto top-0 left-0 right-0 z-30 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t('auth.forgotPassword.backToHome')}
            </span>
          </Link>
          
          {/* Language Toggle */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Form */}
      <div className="relative z-20 w-full max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.png"
              alt="Legatoo Logo"
              width={180}
              height={30}
              className=""
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold !text-white">
              {t('auth.forgotPassword.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-100">
              {t('auth.forgotPassword.subtitle')}
            </p>
          </div>

          {/* Forgot Password Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                {t('auth.forgotPassword.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#679594] focus:border-transparent transition-colors placeholder-white ${
                    errors.email ? '!border-red-500' : '!border-[#679594]'
                  }`}
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#679594] hover:bg-[#5a8482] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#679594] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {forgotPasswordMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('auth.forgotPassword.sending')}
                </div>
              ) : (
                <div className="flex items-center">
                  {t('auth.forgotPassword.sendResetLink')}
                  <ArrowLeft className="ml-2 h-4 w-4" />
                </div>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="flex items-center justify-center text-sm font-medium text-[#679594] hover:text-[#5a8482]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('auth.forgotPassword.backToSignIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

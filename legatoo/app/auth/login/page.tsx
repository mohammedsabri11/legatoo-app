'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
import { LanguageToggle } from '@/components/ui'
import { useLogin } from '@/hooks/useAuth'

export default function LoginPage() {
  const { t } = useTranslation()
  const loginMutation = useLogin()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Real-time validation
    validateField(name, value)
  }

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          newErrors.email = t('auth.login.validation.emailRequired')
        } else if (value.length > 254) {
          newErrors.email = t('auth.login.validation.emailTooLong')
        } else if (!emailRegex.test(value)) {
          newErrors.email = t('auth.login.validation.emailInvalid')
        } else {
          delete newErrors.email
        }
        break
        
      case 'password':
        if (!value) {
          newErrors.password = t('auth.login.validation.passwordRequired')
        } else if (value.length < 6) {
          newErrors.password = t('auth.login.validation.passwordTooShort')
        } else if (value.length > 128) {
          newErrors.password = t('auth.login.validation.passwordTooLong')
        } else {
          delete newErrors.password
        }
        break
    }
    
    setErrors(newErrors)
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = t('auth.login.validation.emailRequired')
    } else if (formData.email.length > 254) {
      newErrors.email = t('auth.login.validation.emailTooLong')
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('auth.login.validation.emailInvalid')
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('auth.login.validation.passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.login.validation.passwordTooShort')
    } else if (formData.password.length > 128) {
      newErrors.password = t('auth.login.validation.passwordTooLong')
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
    loginMutation.mutate(formData, {
      onError: (error: unknown) => {
        // Handle API errors - show field-specific errors
        if (error && typeof error === 'object' && 'errors' in error) {
          setErrors((error as { errors: Record<string, string> }).errors)
        }
        // Toast error is handled globally in the hook
      }
    })
  }

  return (
    <div className="min-h-screen relative flex flex-col     overflow-hidden">
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
      <div className="  z-30 p-4 sm:p-4 w-full md:max-w-7xl mx-auto ">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t('auth.login.backToHome')}
            </span>
          </Link>
          
          {/* Language Toggle */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Form */}
      <div className="relative z-20 w-full max-w-xl  mx-auto px-4 sm:px-6">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border  shadow-2xl   p-8">
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
            <h2 className="text-3xl font-bold text-gray-900">
              {t('auth.login.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-100">
              {t('auth.login.subtitle')}
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                {t('auth.login.email')}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#679594] focus:border-transparent transition-colors placeholder-white ${
                      errors.email ? '!border-red-500' : '!border-[#679594]'
                    }`}
                    placeholder={t('auth.login.emailPlaceholder')}
                  />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                {t('auth.login.password')}
              </label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-12 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#679594] focus:border-transparent transition-colors placeholder-white ${
                      errors.password ? '!border-red-500' : '!border-[#679594]'
                    }`}
                    placeholder={t('auth.login.passwordPlaceholder')}
                  />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-white hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#679594] focus:ring-[#679594] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  {t('auth.login.rememberMe')}
                </label>
              </div>
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-[#679594] hover:text-[#5a8482]">
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#679594] hover:bg-[#5a8482] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#679594] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('auth.login.signingIn')}
                </div>
              ) : (
                <div className="flex items-center">
                  {t('auth.login.signIn')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-100">
              {t('auth.login.noAccount')}{' '}
              <Link href="/auth/signup" className="font-medium text-[#679594] hover:text-[#5a8482]">
                {t('auth.login.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

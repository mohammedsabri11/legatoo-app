"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { LanguageToggle } from "@/components/ui";
import { useSignup } from "@/hooks/useAuth";

export default function SignupPage() {
  const { t, locale } = useTranslation();
  const signupMutation = useSignup();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Real-time validation for text inputs
    if (type !== "checkbox") {
      validateField(name, value);
    } else if (name === "agreeToTerms") {
      // Handle checkbox validation
      const newErrors = { ...errors };
      if (checked) {
        delete newErrors.agreeToTerms;
      } else {
        newErrors.agreeToTerms =
          locale === "ar"
            ? "يجب الموافقة على الشروط والأحكام"
            : "You must agree to the terms and conditions";
      }
      setErrors(newErrors);
    }
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName =
            locale === "ar" ? "الاسم الأول مطلوب" : "First name is required";
        } else if (value.trim().length < 2) {
          newErrors.firstName =
            locale === "ar"
              ? "الاسم الأول يجب أن يكون حرفين على الأقل"
              : "First name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          newErrors.firstName =
            locale === "ar"
              ? "الاسم الأول يجب أن يكون أقل من 50 حرف"
              : "First name must be less than 50 characters";
        } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(value.trim())) {
          newErrors.firstName =
            locale === "ar"
              ? "الاسم الأول يجب أن يحتوي على أحرف فقط"
              : "First name must contain only letters";
        } else {
          delete newErrors.firstName;
        }
        break;

      case "lastName":
        if (!value.trim()) {
          newErrors.lastName =
            locale === "ar" ? "الاسم الأخير مطلوب" : "Last name is required";
        } else if (value.trim().length < 2) {
          newErrors.lastName =
            locale === "ar"
              ? "الاسم الأخير يجب أن يكون حرفين على الأقل"
              : "Last name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          newErrors.lastName =
            locale === "ar"
              ? "الاسم الأخير يجب أن يكون أقل من 50 حرف"
              : "Last name must be less than 50 characters";
        } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(value.trim())) {
          newErrors.lastName =
            locale === "ar"
              ? "الاسم الأخير يجب أن يحتوي على أحرف فقط"
              : "Last name must contain only letters";
        } else {
          delete newErrors.lastName;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email =
            locale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
        } else if (value.length > 254) {
          newErrors.email =
            locale === "ar"
              ? "البريد الإلكتروني طويل جداً"
              : "Email is too long";
        } else if (!emailRegex.test(value)) {
          newErrors.email =
            locale === "ar"
              ? "البريد الإلكتروني غير صحيح"
              : "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        // Remove all non-digit characters for validation
        const cleanPhone = value.replace(/\D/g, "");
        if (!value.trim()) {
          newErrors.phone =
            locale === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
        } else if (cleanPhone.length !== 10) {
          newErrors.phone =
            locale === "ar"
              ? "رقم الهاتف يجب أن يحتوي على 10 أرقام"
              : "Phone number must be exactly 10 digits";
        } else if (!cleanPhone.startsWith("05")) {
          newErrors.phone =
            locale === "ar"
              ? "رقم الهاتف يجب أن يبدأ بـ 05 (مثل: 0501234567)"
              : "Phone number must start with 05 (e.g., 0501234567)";
        } else {
          delete newErrors.phone;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password =
            locale === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
        } else if (value.length < 8) {
          newErrors.password =
            locale === "ar"
              ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
              : "Password must be at least 8 characters";
        } else if (value.length > 128) {
          newErrors.password =
            locale === "ar" ? "كلمة المرور طويلة جداً" : "Password is too long";
        } else if (!/(?=.*[a-z])/.test(value)) {
          newErrors.password =
            locale === "ar"
              ? "كلمة المرور يجب أن تحتوي على حرف صغير"
              : "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          newErrors.password =
            locale === "ar"
              ? "كلمة المرور يجب أن تحتوي على حرف كبير"
              : "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          newErrors.password =
            locale === "ar"
              ? "كلمة المرور يجب أن تحتوي على رقم"
              : "Password must contain at least one number";
        } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
          newErrors.password =
            locale === "ar"
              ? "كلمة المرور يجب أن تحتوي على رمز خاص"
              : "Password must contain at least one special character";
        } else {
          delete newErrors.password;
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword =
            locale === "ar"
              ? "تأكيد كلمة المرور مطلوب"
              : "Confirm password is required";
        } else if (formData.password !== value) {
          newErrors.confirmPassword =
            locale === "ar"
              ? "كلمات المرور غير متطابقة"
              : "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName =
        locale === "ar" ? "الاسم الأول مطلوب" : "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName =
        locale === "ar"
          ? "الاسم الأول يجب أن يكون حرفين على الأقل"
          : "First name must be at least 2 characters";
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName =
        locale === "ar"
          ? "الاسم الأول يجب أن يكون أقل من 50 حرف"
          : "First name must be less than 50 characters";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName =
        locale === "ar"
          ? "الاسم الأول يجب أن يحتوي على أحرف فقط"
          : "First name must contain only letters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName =
        locale === "ar" ? "الاسم الأخير مطلوب" : "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName =
        locale === "ar"
          ? "الاسم الأخير يجب أن يكون حرفين على الأقل"
          : "Last name must be at least 2 characters";
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName =
        locale === "ar"
          ? "الاسم الأخير يجب أن يكون أقل من 50 حرف"
          : "Last name must be less than 50 characters";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName =
        locale === "ar"
          ? "الاسم الأخير يجب أن يحتوي على أحرف فقط"
          : "Last name must contain only letters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email =
        locale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (formData.email.length > 254) {
      newErrors.email =
        locale === "ar" ? "البريد الإلكتروني طويل جداً" : "Email is too long";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email =
        locale === "ar"
          ? "البريد الإلكتروني غير صحيح"
          : "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^(\+966|0)?[5-9][0-9]{8}$/;
    const cleanPhone = formData.phone.replace(/\s/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone =
        locale === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone =
        locale === "ar"
          ? "رقم الهاتف غير صحيح. يجب أن يبدأ بـ +966 أو 0 ويحتوي على 9 أرقام"
          : "Please enter a valid Saudi phone number (e.g., +966501234567 or 0501234567)";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password =
        locale === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        locale === "ar"
          ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
          : "Password must be at least 8 characters";
    } else if (formData.password.length > 128) {
      newErrors.password =
        locale === "ar" ? "كلمة المرور طويلة جداً" : "Password is too long";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password =
        locale === "ar"
          ? "كلمة المرور يجب أن تحتوي على حرف صغير"
          : "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        locale === "ar"
          ? "كلمة المرور يجب أن تحتوي على حرف كبير"
          : "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        locale === "ar"
          ? "كلمة المرور يجب أن تحتوي على رقم"
          : "Password must contain at least one number";
    } else if (
      !/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)
    ) {
      newErrors.password =
        locale === "ar"
          ? "كلمة المرور يجب أن تحتوي على رمز خاص"
          : "Password must contain at least one special character";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        locale === "ar"
          ? "تأكيد كلمة المرور مطلوب"
          : "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        locale === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match";
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms =
        locale === "ar"
          ? "يجب الموافقة على الشروط والأحكام"
          : "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📝 Form submitted with data:", formData);

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    console.log("✅ Form validation passed, triggering mutation");

    // Clear previous errors
    setErrors({});

    // Use React Query mutation
    signupMutation.mutate(formData, {
      onError: (error: unknown) => {
        console.log("❌ Mutation error:", error);
        // Handle API errors - show field-specific errors
        if (error && typeof error === 'object' && 'errors' in error) {
          setErrors((error as { errors: Record<string, string> }).errors);
        }
        // Toast error is handled globally in the hook
      },
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
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
      <div className="  flex justify-between w-full md:max-w-7xl mx-auto  z-30 p-4 sm:p-2 sm:pt-4">
        <div className="flex items-center justify-between w-full">
          {/* Back Button */}
          <Link 
            href="/"
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t("auth.signup.backToHome")}
            </span> 
          </Link>

          {/* Language Toggle */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Centered Form */}
      <div className="relative z-20 w-full max-w-3xl mx-auto mb-10 px-4 sm:px-6">
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center   ">
            <Image
              src="/logo.png"
              alt="Legatoo Logo"
              width={180}
              height={30}
              className=" "
            />
          </div>

          {/* Header */}
          <div className="text-center ">
            <h2 className="text-3xl font-bold !text-white">
              {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
            </h2>
            <p className="mt-2 text-sm text-gray-100">
              {locale === "ar"
                ? "انضم إلى منصة ليجاتو لإدارة العقود"
                : "Join Legatoo platform for contract management"}
            </p>
          </div>

          {/* Google Sign-in */}
          {/* <div className="my-4 flex justify-center ">
            <div className="">
              <GoogleSignInButton
                onGoogleSignIn={handleGoogleSignIn}
                isLoading={googleLoading}
                text={
                  locale === "ar"
                    ? "إنشاء حساب بـ Google"
                    : "Sign up with Google"
                }
              />
            </div>
          </div> */}

          {/* Signup Form */}
          <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-white mb-2"
                >
                  {locale === "ar" ? "الاسم الأول" : "First Name"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#679594] focus:border-transparent transition-colors placeholder-white ${
                      errors.firstName ? "!border-red-500" : "!border-[#679594]"
                    }`}
                    placeholder={locale === "ar" ? "الاسم الأول" : "First name"}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-white mb-2"
                >
                  {locale === "ar" ? "الاسم الأخير" : "Last Name"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#679594] focus:border-transparent transition-colors placeholder-white ${
                      errors.lastName ? "!border-red-500" : "!border-[#679594]"
                    }`}
                    placeholder={locale === "ar" ? "الاسم الأخير" : "Last name"}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                {locale === "ar" ? "البريد الإلكتروني" : "Email Address"}
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
                    errors.email ? "!border-red-500" : "!border-[#679594]"
                  }`}
                  placeholder={
                    locale === "ar"
                      ? "أدخل بريدك الإلكتروني"
                      : "Enter your email"
                  }
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-white mb-2"
              >
                {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#679594] focus:border-transparent transition-colors placeholder-white ${
                    errors.phone ? "!border-red-500" : "!border-[#679594]"
                  }`}
                  placeholder={
                    locale === "ar" ? "05 1234 5678" : "05 1234 5678"
                  }
                  dir="ltr"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                {locale === "ar" ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#679594] focus:border-transparent transition-colors placeholder-white ${
                    errors.password ? "!border-red-500" : "!border-[#679594]"
                  }`}
                  placeholder={
                    locale === "ar" ? "أدخل كلمة المرور" : "Enter your password"
                  }
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white mb-2"
              >
                {locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#679594] focus:border-transparent transition-colors placeholder-white ${
                    errors.confirmPassword
                      ? "!border-red-500"
                      : "!border-[#679594]"
                  }`}
                  placeholder={
                    locale === "ar"
                      ? "أعد إدخال كلمة المرور"
                      : "Confirm your password"
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-white hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-white hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#679594] focus:ring-[#679594] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-white">
                  {locale === "ar" ? "أوافق على" : "I agree to the"}{" "}
                  <Link
                    href="/terms"
                    className="text-[#679594] hover:text-[#5a8482]"
                  >
                    {locale === "ar" ? "شروط الخدمة" : "Terms of Service"}
                  </Link>{" "}
                  {locale === "ar" ? "و" : "and"}{" "}
                  <Link
                    href="/privacy"
                    className="text-[#679594] hover:text-[#5a8482]"
                  >
                    {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signupMutation.isPending || !formData.agreeToTerms}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#679594] hover:bg-[#5a8482] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#679594] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {signupMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {locale === "ar"
                    ? "جاري إنشاء الحساب..."
                    : "Creating account..."}
                </div>
              ) : (
                <div className="flex items-center">
                  {locale === "ar" ? "إنشاء الحساب" : "Create Account"}
                  <CheckCircle className="ml-2 h-4 w-4" />
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-100">
              {locale === "ar"
                ? "لديك حساب بالفعل؟"
                : "Already have an account?"}{" "}
              <Link
                href="/auth/login"
                className="font-medium text-[#679594] hover:text-[#5a8482]"
              >
                {locale === "ar" ? "تسجيل الدخول" : "Sign in here"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client'

// Theme management utilities
export type Theme = 'light' | 'dark' | 'system'
export type Direction = 'ltr' | 'rtl'

// Theme management
export const setTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return
  
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
  
  localStorage.setItem('theme', theme)
}

export const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem('theme') as Theme) || 'system'
}

export const initializeTheme = () => {
  if (typeof window === 'undefined') return
  
  const savedTheme = getTheme()
  setTheme(savedTheme)
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    if (getTheme() === 'system') {
      setTheme('system')
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}

// RTL management
export const setDirection = (direction: Direction) => {
  if (typeof window === 'undefined') return
  
  const html = window.document.documentElement
  html.setAttribute('dir', direction)
  localStorage.setItem('direction', direction)
}

export const getDirection = (): Direction => {
  if (typeof window === 'undefined') return 'ltr'
  return (localStorage.getItem('direction') as Direction) || 'ltr'
}

export const initializeDirection = () => {
  if (typeof window === 'undefined') return
  
  const savedDirection = getDirection()
  setDirection(savedDirection)
}

// Combined initialization
export const initializeApp = () => {
  initializeTheme()
  initializeDirection()
}

// Utility function to get RTL-aware classes
export const getRTLClasses = (baseClasses: string, rtlClasses?: string): string => {
  const direction = getDirection()
  return direction === 'rtl' && rtlClasses ? rtlClasses : baseClasses
}

// Utility function for conditional RTL styling
export const conditionalRTL = <T>(ltrValue: T, rtlValue: T): T => {
  const direction = getDirection()
  return direction === 'rtl' ? rtlValue : ltrValue
}


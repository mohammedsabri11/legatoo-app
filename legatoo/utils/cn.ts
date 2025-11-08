// Simple class name utility without external dependencies
type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean>

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []
  
  for (const input of inputs) {
    if (!input) continue
    
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const nested = cn(...input)
      if (nested) classes.push(nested)
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }
  
  return classes.join(' ')
}

// RTL-aware class utility
export function rtlClass(ltrClass: string, rtlClass: string, direction: 'ltr' | 'rtl' = 'ltr'): string {
  return direction === 'rtl' ? rtlClass : ltrClass
}

// Size variants utility
export function getSizeClasses(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {
  const sizes = {
    xs: 'h-6 px-2 text-xs',
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
    xl: 'h-12 px-10 text-lg',
  }
  return sizes[size]
}

// Color variants utility
export function getColorClasses(variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral') {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
    success: 'bg-success-500 text-white hover:bg-success-600',
    warning: 'bg-warning-500 text-white hover:bg-warning-600',
    error: 'bg-error-500 text-white hover:bg-error-600',
    neutral: 'bg-neutral-500 text-white hover:bg-neutral-600',
  }
  return variants[variant]
}

// Outline color variants utility
export function getOutlineColorClasses(variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral') {
  const variants = {
    primary: 'border-primary text-primary hover:bg-primary/10',
    secondary: 'border-secondary text-secondary-foreground hover:bg-secondary/10',
    accent: 'border-accent text-accent-foreground hover:bg-accent/10',
    success: 'border-success-500 text-success-500 hover:bg-success-50',
    warning: 'border-warning-500 text-warning-500 hover:bg-warning-50',
    error: 'border-error-500 text-error-500 hover:bg-error-50',
    neutral: 'border-neutral-500 text-neutral-500 hover:bg-neutral-50',
  }
  return variants[variant]
}


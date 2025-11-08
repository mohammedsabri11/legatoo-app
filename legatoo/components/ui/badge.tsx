'use client'

import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    }

    const variantClasses = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      secondary: 'bg-secondary/10 text-secondary-foreground border-secondary/20',
      accent: 'bg-accent/10 text-accent-foreground border-accent/20',
      success: 'bg-success-100 text-success-800 border-success-200 dark:bg-success-900/20 dark:text-success-200',
      warning: 'bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-900/20 dark:text-warning-200',
      error: 'bg-error-100 text-error-800 border-error-200 dark:bg-error-900/20 dark:text-error-200',
      neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-900/20 dark:text-neutral-200',
      outline: 'border border-input bg-background text-foreground',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }

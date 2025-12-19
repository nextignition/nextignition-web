'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  href?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  href,
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center'
  
  const variants = {
    primary: 'bg-navy-blue text-white hover:bg-electric-blue hover:shadow-lg hover:shadow-navy-blue/50',
    secondary: 'bg-atomic-orange text-white hover:bg-atomic-orange/90 hover:shadow-lg hover:shadow-atomic-orange/50',
    outline: 'border-2 border-navy-blue text-navy-blue hover:bg-navy-blue hover:text-white',
    ghost: 'text-navy-blue hover:bg-navy-blue/10',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
  
  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonContent}
      </a>
    )
  }
  
  return buttonContent
}


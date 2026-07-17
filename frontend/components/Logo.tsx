/**
 * Verifund Logo Component
 *
 * Variants:
 * - "full": Logo Mark + Wordmark
 * - "mark": Logo Mark only
 * - "wordmark": Wordmark only
 */

import React from 'react';
import Image from 'next/image';

export type LogoVariant = 'full' | 'mark' | 'wordmark';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoTheme = 'light' | 'dark';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  theme?: LogoTheme;
  className?: string;
}

const sizeMap = {
  sm: { width: 20, height: 20, text: 'text-base' },
  md: { width: 24, height: 24, text: 'text-xl' },
  lg: { width: 32, height: 32, text: 'text-2xl' },
  xl: { width: 40, height: 40, text: 'text-3xl' },
};

export function Logo({
  variant = 'full',
  size = 'md',
  theme = 'dark',
  className = '',
}: LogoProps) {
  const colorClass = theme === 'dark' ? 'text-foreground' : 'text-background';
  const { width, height, text: textSize } = sizeMap[size];

  // Verifund Mark (Loaded from public/verifundlogo.svg)
  const StrongMark = () => (
    <Image 
      src="/verifundlogo.svg" 
      alt="Verifund Logo" 
      width={width} 
      height={height}
      className={`object-contain ${className}`}
    />
  );

  // Wordmark
  const Wordmark = () => (
    <span
      className={`${textSize} font-bold ${colorClass} font-[family-name:var(--font-display)] transition-colors tracking-tight`}
    >
      Verifund
    </span>
  );

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <StrongMark />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Wordmark />
      </div>
    );
  }

  // Full logo (default): Strong Mark + Wordmark
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <StrongMark />
      <Wordmark />
    </div>
  );
}

// Convenience components for common use cases
export function LogoFull(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="full" />;
}

export function LogoMark(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="mark" />;
}

export function LogoWordmark(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="wordmark" />;
}

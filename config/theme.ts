// GenZ Live — Brand Foundation & Design Tokens
// Visual Direction: Premium international news publication + modern Gen-Z digital media

export const BRAND_TOKENS = {
  brand: {
    name: 'GENZ LIVE',
    tagline: 'The Voice of GenZ',
  },
  colors: {
    // Primary Navy / Dark Foundations
    bg: {
      deep: '#030712',      // Deepest background
      main: '#080d1a',      // Primary app background
      surface: '#0f172a',   // Card / Surface background
      elevated: '#1e293b',  // Elevated panels / Popovers
    },
    // Text colors
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
      inverse: '#030712',
    },
    // Selective Accent Colors
    accents: {
      electricBlue: {
        DEFAULT: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.4)',
        light: '#60a5fa',
        dark: '#1d4ed8',
      },
      cyan: {
        DEFAULT: '#06b6d4',
        glow: 'rgba(6, 182, 212, 0.4)',
        light: '#22d3ee',
        dark: '#0e7490',
      },
      purple: {
        DEFAULT: '#8b5cf6',
        glow: 'rgba(139, 92, 246, 0.4)',
        light: '#a78bfa',
        dark: '#6d28d9',
      },
      pink: {
        DEFAULT: '#ec4899',
        glow: 'rgba(236, 72, 153, 0.4)',
        light: '#f472b6',
        dark: '#be185d',
      },
      orange: {
        DEFAULT: '#f97316',
        glow: 'rgba(249, 115, 22, 0.4)',
        light: '#fb923c',
        dark: '#c2410c',
      },
    },
    // Borders
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.15)',
      active: 'rgba(139, 92, 246, 0.5)',
    },
  },
  typography: {
    fontFamilies: {
      heading: 'var(--font-outfit), sans-serif',
      body: 'var(--font-jakarta), sans-serif',
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  radius: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.5rem',// 24px
    full: '9999px',
  },
  shadows: {
    card: '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
    glowBlue: '0 0 25px rgba(59, 130, 246, 0.3)',
    glowPurple: '0 0 25px rgba(139, 92, 246, 0.3)',
    glowCyan: '0 0 25px rgba(6, 182, 212, 0.3)',
    glowPink: '0 0 25px rgba(236, 72, 153, 0.3)',
  },
} as const;

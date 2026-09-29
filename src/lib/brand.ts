/**
 * PrintOS Brand Design System Tokens
 * Grounded in printing industry heritage (CMYK influence) & enterprise SaaS aesthetics.
 */

export const BRAND = {
  name: 'PrintOS',
  tagline: 'Manage. Print. Grow.',

  // Primary Brand Colors
  colors: {
    printosBlue: '#1D5DFF', // Primary brand color
    deepNavy: '#071A3D',    // Headers, sidebar, dark mode
    cyanBlue: '#23A8FF',    // Highlights, hover states
    white: '#FFFFFF',       // Background
    lightGray: '#F5F7FA',   // Cards, surfaces
  },

  // Print Industry Accent Colors (CMYK)
  cmyk: {
    magenta: '#FF008C',     // Notifications, active states
    yellow: '#FFD400',      // Warnings, highlights
    cyan: '#00C8FF',        // Charts, accents
    black: '#111827',       // Typography
  },

  // Dashboard Palette
  dashboard: {
    sidebar: {
      background: '#071A3D',
      text: '#D8E3FF',
      active: '#1D5DFF',
      hover: '#122A59',
      border: '#10244C',
    },
    cards: {
      background: '#FFFFFF',
      border: '#E8EDF5',
      darkBackground: '#0B224F',
      darkBorder: '#162E63',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },

  // Data Visualization Colors
  dataViz: {
    revenue: '#1D5DFF',       // Revenue
    production: '#23A8FF',    // Production
    completedJobs: '#10B981', // Completed Jobs
    pendingJobs: '#FFD400',   // Pending Jobs
    delayedJobs: '#FF008C',   // Delayed Jobs
    inventory: '#8B5CF6',     // Inventory
  },

  // Brand Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #23A8FF 0%, #1D5DFF 50%, #071A3D 100%)',
    cmyk: 'linear-gradient(135deg, #00C8FF, #1D5DFF, #FF008C, #FFD400)',
  },

  // Typography
  typography: {
    headings: 'Plus Jakarta Sans',
    body: 'Inter',
    analytics: 'JetBrains Mono',
  },
} as const;

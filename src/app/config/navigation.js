/**
 * Centralized navigation configuration for the entire application
 * This serves as a single source of truth for all navigation-related data
 */

// Main navigation items used in both header and footer
export const MAIN_NAV_ITEMS = [
  {
    path: '/',
    label: 'Home',
    exact: true,
    type: 'internal',
    showInHeader: true,
    showInFooter: false
  },
  {
    path: '/components',
    label: 'Components',
    exact: false,
    type: 'internal',
    showInHeader: true,
    showInFooter: true
  },
  {
    path: '/theming',
    label: 'Theming Guide',
    exact: false,
    type: 'internal',
    showInHeader: true,
    showInFooter: true
  }
]

// External links, primarily for footer
export const EXTERNAL_LINKS = [
  {
    path: 'https://github.com/agilite',
    label: 'GitHub',
    icon: 'github',
    type: 'external',
    showInHeader: false,
    showInFooter: true
  }
]

// Helper functions to filter navigation items for specific components
export const getHeaderNavItems = () => 
  MAIN_NAV_ITEMS.filter(item => item.showInHeader)

export const getFooterResourceItems = () => 
  MAIN_NAV_ITEMS.filter(item => item.showInFooter)

export const getFooterConnectItems = () => 
  EXTERNAL_LINKS.filter(item => item.showInFooter) 
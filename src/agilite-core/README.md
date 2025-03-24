# Agilit-e Core

A collection of reusable components, configs, and utilities for Agilit-e applications.

## Features

- 🎨 Modern, responsive UI components
- 🌓 Built-in dark mode support with system preference detection
- 🎯 Performance optimized with React.memo and useMemo
- 📦 Easy to extend Tailwind configuration
- 🔧 Comprehensive utility classes and styles
- 📝 PropTypes and JSDoc documentation

## Contents

### Components

- `Logo`: Agilit-e brand logo component with dark mode support
  - Supports multiple sizes and grayscale variant
  - Automatic dark/light mode switching
  - Optional text display

- `ThemeToggle`: Animated dark/light mode toggle
  - Smooth day/night animation
  - System preference detection
  - LocalStorage persistence

- `BackgroundEffect`: Dynamic background component
  - Responsive design
  - Different styles for dark/light modes
  - Customizable opacity

### Context

- `ThemeContext`: Context provider for dark/light mode theming
- `ThemeProvider`: Provider component that handles:
  - System preference detection
  - LocalStorage persistence
  - Dark mode class management
- `useTheme`: Hook to access theme context

### Styles

- Core TailwindCSS styles and utility classes
- Common component styles (buttons, containers, etc.)
- Transition utilities
- Dark mode variants

### Config

- Base Tailwind configuration
- Extensible theme settings
- Custom color palette
- Animation presets

## Installation

1. Copy the `agilite-core` directory into your project's `src` folder
2. Install required dependencies:

```bash
npm install lodash prop-types @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
```

## Usage

### Basic Component Usage

Import components directly from the core:

```jsx
import { Logo, ThemeToggle, BackgroundEffect, ThemeProvider } from './agilite-core';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <nav>
          <Logo size="small" />
          <ThemeToggle />
        </nav>
        <div className="relative">
          <BackgroundEffect />
          <main className="relative z-10">
            Your content here
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
```

### Styling and Theme Customization

1. Create a `tailwind.config.js` in your application folder:

```js
const agiliteCore = require('./src/agilite-core/config/tailwind.config');
const merge = require('lodash/merge');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    ...merge({}, agiliteCore.theme, {
      extend: {
        // Your customizations here
        colors: {
          'custom-brand': '#ff6b00',
        },
      },
    }),
  },
  plugins: []
}
```

2. Import core styles in your main `index.js`:

```js
import './agilite-core/styles/core.css';
```

### Utility Classes

The core provides several utility classes:

```jsx
// Transitions
import { TRANSITIONS } from './agilite-core/styles';
<div className={TRANSITIONS.MEDIUM}>...</div>

// Buttons
import { BUTTON_VARIANTS } from './agilite-core/styles';
<button className={BUTTON_VARIANTS.PRIMARY}>...</button>

// Containers
import { CONTAINER_CLASSES } from './agilite-core/styles';
<div className={CONTAINER_CLASSES.PADDED}>...</div>
```

## Best Practices

1. Always wrap your app with `ThemeProvider`
2. Use the provided utility classes for consistency
3. Extend the core Tailwind config instead of modifying it
4. Place the `BackgroundEffect` in a relative container
5. Use `memo` for components that don't need frequent updates

## Example App

Check the `boilerplate-demo` directory for a complete example application showcasing all components and features.

## Contributing

When adding new features:
1. Follow the existing code structure
2. Add proper PropTypes and documentation
3. Use memoization where appropriate
4. Update tests and documentation
5. Follow the established naming conventions
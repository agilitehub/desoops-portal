# Agilit-e Core

A collection of reusable components, configs, and utilities for Agilit-e applications.

## Contents

### Components

- `Logo`: Agilit-e brand logo component
- `ThemeToggle`: Dark/light mode toggle with animations
- `BackgroundEffect`: Decorative background effects with responsive design

### Context

- `ThemeContext`: Context provider for dark/light mode theming
- `ThemeProvider`: Provider component for theme context
- `useTheme`: Hook to access theme context

### Styles

- Core TailwindCSS styles and utility classes
- Common component styles like buttons, containers, etc.

### Config

- `tailwind.config.js`: Shared Tailwind configuration

## Usage

Import components directly from the core:

```jsx
import { Logo, ThemeToggle, BackgroundEffect, ThemeProvider } from './agilite-core';

function App() {
  return (
    <ThemeProvider>
      <div>
        <Logo />
        <ThemeToggle />
        <BackgroundEffect />
      </div>
    </ThemeProvider>
  );
}
```

For Tailwind configuration, import the core config in your tailwind.config.js:

```js
const agiliteCore = require('./src/agilite-core/config/tailwind.config');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: agiliteCore.theme,
  plugins: []
} 
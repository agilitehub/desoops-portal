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

## Tailwind Configuration

The core provides a base Tailwind configuration that should not be modified directly. Instead, extend it in your application:

### Recommended Approach

Create a tailwind.config.js in your application folder that extends the core configuration:

```js
const agiliteCore = require('../agilite-core/config/tailwind.config');
const merge = require('lodash/merge');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    ...merge({}, agiliteCore.theme, {
      extend: {
        // Your customizations here
        colors: {
          'custom-color': '#7e22ce',
        },
      },
    }),
  },
  plugins: []
}
```

This approach is demonstrated in the boilerplate demo, where the core configuration is extended in:
`src/agilite-core/boilerplate-demo/config/tailwind.config.js`

Refer to the documentation in that directory for more details on customization.
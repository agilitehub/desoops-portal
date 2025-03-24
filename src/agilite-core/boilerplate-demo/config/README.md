# Boilerplate Configuration

This directory contains configuration files for the boilerplate application that can be customized by users without modifying the core files in the `agilite-core` directory.

## Tailwind Configuration

The `tailwind.config.js` file in this directory extends the core Tailwind configuration from `agilite-core/config/tailwind.config.js` using Lodash's `merge` utility.

### How to Customize

To customize the Tailwind configuration for your application:

1. **Open the boilerplate config file**: `src/agilite-core/boilerplate-demo/config/tailwind.config.js`

2. **Add your customizations** within the `theme.extend` object:

```js
theme: {
  ...merge({}, agiliteCore.theme, {
    extend: {
      // Add your custom extensions here
      colors: {
        // Example: Add new colors or override existing ones
        'custom-brand': '#ff6b00',
        'custom-accent': '#0088cc',
      },
      // Add other customizations like:
      fontFamily: {
        // Your custom fonts
      },
      spacing: {
        // Custom spacing values
      },
      // Any other Tailwind theme customizations
    },
  }),
},
```

3. **Add plugins** if needed:

```js
plugins: [
  // Add Tailwind plugins here
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
],
```

This approach allows you to customize the application's styling without modifying any files in the `agilite-core` directory, making it easier to update the core library in the future.

## Navigation Configuration

The `navigation.js` file defines the navigation structure for the boilerplate application. You can customize it to match your application's routing needs. 
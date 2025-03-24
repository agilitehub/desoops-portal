import React from 'react'

/**
 * Configuration for ThemeProvider context showcase
 */
const ThemeProviderConfig = {
  title: 'ThemeProvider',
  description: 'The ThemeProvider provides a context for managing light and dark mode themes across your application. It includes automatic detection of system preferences and persists the user\'s choice in localStorage.',
  usage: 'import { ThemeProvider, useTheme } from \'./agilite-core\';',
  codeExample: `
// Wrap your app with the provider
<ThemeProvider>
  <App />
</ThemeProvider>

// Use the theme context in any component
const MyComponent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <div>
      <p>Current theme: {darkMode ? 'Dark' : 'Light'}</p>
      <button onClick={toggleDarkMode}>
        Toggle Theme
      </button>
    </div>
  );
};
`,
  props: [],
  notes: 'The ThemeProvider handles all the logic for theme switching including applying the \'dark\' class to the html element and storing preferences.'
}

export default ThemeProviderConfig 
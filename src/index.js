import React from 'react'
import ReactDOM from 'react-dom/client'
import './agilite-core/styles/core.css' // Import consolidated styles
import BoilerplateApp from './agilite-core/boilerplate-demo' // Boilerplate demo app
import reportWebVitals from './reportWebVitals'

// Import Font Awesome CSS
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent Font Awesome from automatically adding CSS to the page
config.autoAddCss = false

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BoilerplateApp />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

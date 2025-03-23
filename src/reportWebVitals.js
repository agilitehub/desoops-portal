// This module reports Web Vitals performance metrics for the application
// Web Vitals are important metrics that measure real user experience:
// CLS - Cumulative Layout Shift (visual stability)
// FID - First Input Delay (interactivity)
// FCP - First Contentful Paint (initial render)
// LCP - Largest Contentful Paint (loading performance) 
// TTFB - Time to First Byte (server response time)

const reportWebVitals = (onPerfEntry) => {
  // Only run if a valid callback function is provided
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import web-vitals library to keep initial bundle size small
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Report each metric using the provided callback
      getCLS(onPerfEntry) // Measures layout shifts
      getFID(onPerfEntry) // Measures input delay
      getFCP(onPerfEntry) // Measures first content paint
      getLCP(onPerfEntry) // Measures largest content paint
      getTTFB(onPerfEntry) // Measures time to first byte
    })
  }
}

export default reportWebVitals

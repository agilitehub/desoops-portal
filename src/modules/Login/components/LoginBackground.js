import React from 'react'

const SHAPES = [
  { className: 'login-shape-hero-coral', layer: 'login-shape-back' },
  { className: 'login-shape-hero-coral-accent', layer: 'login-shape-mid' },
  { className: 'login-shape-coral-left', layer: 'login-shape-back' },
  { className: 'login-shape-blue-center', layer: 'login-shape-mid' },
  { className: 'login-shape-coral-overlap', layer: 'login-shape-mid' },
  { className: 'login-shape-blue-right', layer: 'login-shape-back' },
  { className: 'login-shape-pink-float', layer: 'login-shape-front' },
  { className: 'login-shape-cyan-top', layer: 'login-shape-back' },
  { className: 'login-shape-coral-bottom', layer: 'login-shape-mid' },
  { className: 'login-shape-blue-lower', layer: 'login-shape-front' }
]

const LoginBackground = () => (
  <div className='login-bg' aria-hidden='true'>
    {SHAPES.map(({ className, layer }) => (
      <div key={className} className={`login-shape ${layer} ${className}`} />
    ))}
  </div>
)

export default LoginBackground

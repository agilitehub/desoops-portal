import React from 'react'

import styles from '../styles/login.module.sass'

const SHAPES = [
  { className: 'shapeHeroCoral', layer: 'layerBack' },
  { className: 'shapeHeroCoralAccent', layer: 'layerMid' },
  { className: 'shapeCoralLeft', layer: 'layerBack' },
  { className: 'shapeBlueCenter', layer: 'layerMid' },
  { className: 'shapeCoralOverlap', layer: 'layerMid' },
  { className: 'shapeBlueRight', layer: 'layerBack' },
  { className: 'shapePinkFloat', layer: 'layerFront' },
  { className: 'shapeCyanTop', layer: 'layerBack' },
  { className: 'shapeCoralBottom', layer: 'layerMid' },
  { className: 'shapeBlueLower', layer: 'layerFront' }
]

const LoginBackground = () => (
  <div className={styles.background} aria-hidden='true'>
    {SHAPES.map(({ className, layer }) => (
      <div key={className} className={`${styles.shape} ${styles[layer]} ${styles[className]}`} />
    ))}
  </div>
)

export default LoginBackground

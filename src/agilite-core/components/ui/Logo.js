import React from 'react'

const Logo = ({
  className = '',
  textColor = 'text-agilite-slate',
  showText = true,
  variant = 'color', // 'color' or 'grayscale'
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  // Colors based on variant
  const nodeColor = variant === 'color' ? '#E30613' : '#4A545E'
  const centerNodeColor = '#4A545E'
  const lineColor = variant === 'color' ? '#E30613' : '#4A545E'

  // Size mapping
  const sizeMap = {
    small: 'h-10 w-10',
    medium: 'h-16 w-16',
    large: 'h-24 w-24'
  }

  const logoSize = sizeMap[size] || sizeMap.medium

  return (
    <div className={`flex items-center ${className}`}>
      {/* 3D Network nodes logo */}
      <div className={`relative ${logoSize} mr-4`} aria-hidden='true'>
        {/* Shadow effect */}
        <div className='absolute bottom-[-8px] left-1/4 w-1/2 h-[3px] bg-gray-300/50 dark:bg-gray-700/50 rounded-full blur-sm'></div>

        {/* SVG exactly matching the provided image */}
        <svg className='absolute inset-0 w-full h-full' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
          {/* Connection lines */}
          <g strokeWidth='1.2' stroke={lineColor} strokeOpacity='0.8'>
            <line x1='50' y1='50' x2='28' y2='25' />
            <line x1='50' y1='50' x2='15' y2='35' />
            <line x1='50' y1='50' x2='15' y2='50' />
            <line x1='50' y1='50' x2='20' y2='65' />
            <line x1='50' y1='50' x2='30' y2='75' />
            <line x1='50' y1='50' x2='50' y2='78' />
            <line x1='50' y1='50' x2='70' y2='75' />
            <line x1='50' y1='50' x2='80' y2='65' />
            <line x1='50' y1='50' x2='85' y2='50' />
            <line x1='50' y1='50' x2='85' y2='35' />
            <line x1='50' y1='50' x2='72' y2='25' />
            <line x1='50' y1='50' x2='50' y2='22' />
            <line x1='50' y1='50' x2='35' y2='35' />
            <line x1='50' y1='50' x2='65' y2='35' />
            <line x1='50' y1='50' x2='40' y2='62' />
            <line x1='50' y1='50' x2='60' y2='62' />
          </g>

          {/* Red nodes - exact placement to match image */}
          <g fill={nodeColor}>
            {/* Primary nodes */}
            <circle cx='28' cy='25' r='4' />
            <circle cx='15' cy='35' r='3' />
            <circle cx='15' cy='50' r='4' />
            <circle cx='20' cy='65' r='3.5' />
            <circle cx='30' cy='75' r='4' />
            <circle cx='50' cy='78' r='5' />
            <circle cx='70' cy='75' r='4' />
            <circle cx='80' cy='65' r='3.5' />
            <circle cx='85' cy='50' r='4' />
            <circle cx='85' cy='35' r='3' />
            <circle cx='72' cy='25' r='4' />
            <circle cx='50' cy='22' r='5' />

            {/* Secondary nodes */}
            <circle cx='35' cy='35' r='4.5' />
            <circle cx='65' cy='35' r='4.5' />
            <circle cx='40' cy='62' r='3.5' />
            <circle cx='60' cy='62' r='3.5' />

            {/* Smaller nodes */}
            <circle cx='58' cy='27' r='2.5' />
            <circle cx='42' cy='27' r='2.5' />
            <circle cx='75' cy='42' r='2' />
            <circle cx='25' cy='42' r='2' />
            <circle cx='72' cy='58' r='2.2' />
            <circle cx='28' cy='58' r='2.2' />
            <circle cx='58' cy='72' r='2.5' />
            <circle cx='42' cy='72' r='2.5' />
          </g>

          {/* Gray center node */}
          <circle cx='50' cy='50' r='7' fill={centerNodeColor} />
        </svg>
      </div>

      {/* Agilit-e text */}
      {showText && (
        <span
          className={`text-3xl font-normal tracking-wider ${textColor} dark:text-white`}
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          AGILIT-E
        </span>
      )}
    </div>
  )
}

export default Logo 
import React from 'react'

const BackgroundEffect = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      {/* Base gradient background - enhanced for light mode */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50/60 dark:from-gray-900 dark:via-agilite-red/15 dark:to-agilite-black'></div>

      {/* Light mode dynamic elements - with dark red colors */}
      <div className='absolute inset-0 block dark:hidden'>
        {/* Dark red circle accent */}
        <div className='absolute top-[25%] left-[8%] w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-red-900/20 via-agilite-red/15 to-transparent'></div>

        {/* Bottom accent with dark red */}
        <div className='absolute bottom-0 left-0 w-[70%] h-[4px] bg-gradient-to-r from-red-900/70 via-agilite-red to-transparent'></div>

        {/* Light geometric shape with dark red */}
        <div className='absolute left-0 bottom-0 w-[400px] h-[400px] bg-gradient-to-tr from-red-800/30 via-agilite-red/15 to-transparent'></div>

        {/* Additional dark red accent */}
        <div className='absolute bottom-[20%] right-[15%] w-[200px] h-[200px] rounded-full bg-gradient-to-bl from-red-900/25 via-agilite-red/15 to-transparent blur-xl'></div>

        {/* New dark red element */}
        <div className='absolute top-[60%] right-[30%] w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-red-800/20 via-agilite-red/15 to-transparent blur-lg'></div>
      </div>

      {/* Dark mode dynamic elements - updated with more dark red */}
      <div className='absolute inset-0 hidden dark:block'>
        {/* Wave pattern top */}
        <div className='absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-red-900/40 to-transparent rounded-br-[70%] rounded-bl-[30%]'></div>

        {/* Curved diagonal accent */}
        <div className='absolute right-0 top-[30%] h-[300px] w-[300px] bg-red-900/40 rounded-full blur-xl'></div>

        {/* Bottom wave pattern */}
        <div className='absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-agilite-slate/20 via-red-900/35 to-transparent rounded-tr-[50%] rounded-tl-[70%]'></div>

        {/* Abstract shape */}
        <div className='absolute left-[20%] top-[25%] w-48 h-48 bg-red-900/35 rounded-tl-[80px] rounded-br-[80px] transform rotate-12 blur-md'></div>
      </div>
    </div>
  )
}

export default BackgroundEffect 
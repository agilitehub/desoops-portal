import React from 'react'

/**
 * Video component that displays the DeSo Ops introduction videos
 * Supports dark mode with appropriate styling
 */
const Video = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Video */}
        <div className="rounded-xl overflow-hidden shadow-lg dark:shadow-deso-blue/20 
          bg-white dark:bg-deso-secondary border border-gray-100 dark:border-deso-blue/20
          transform transition-all duration-200 hover:scale-105">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/PAQELCazfs8"
              title="DeSo Ops Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Second Video */}
        <div className="rounded-xl overflow-hidden shadow-lg dark:shadow-deso-blue/20 
          bg-white dark:bg-deso-secondary border border-gray-100 dark:border-deso-blue/20
          transform transition-all duration-200 hover:scale-105">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/Qf2DMRo_Fyc"
              title="DeSo Ops Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Video 
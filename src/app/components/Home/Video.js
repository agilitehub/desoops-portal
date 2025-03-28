import React from 'react'

/**
 * Video component that displays the DeSoOps introduction videos
 * Supports dark mode with appropriate styling
 */
const Video = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* First Video */}
        <div className="flex flex-col items-center">
          <div className="w-full overflow-visible mb-6 sm:mb-12">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FF4500] dark:text-[#FF7F50] text-center
              drop-shadow-[0_3px_3px_rgba(0,0,0,0.15)] tracking-tight transform scale-100 sm:scale-[1.5] origin-center">
              🚀 Revolutionize Your DeSo Experience
            </h3>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg dark:shadow-deso-blue/20 
            bg-white dark:bg-deso-secondary border border-gray-100 dark:border-deso-blue/20
            transform transition-all duration-200 hover:scale-[1.02] w-full">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/PAQELCazfs8?modestbranding=1&rel=0&showinfo=0"
                title="DeSoOps Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Second Video */}
        <div className="flex flex-col items-center">
          <div className="w-full overflow-visible mb-6 sm:mb-12">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FF4500] dark:text-[#FF7F50] text-center
              drop-shadow-[0_3px_3px_rgba(0,0,0,0.15)] tracking-tight transform scale-100 sm:scale-[1.5] origin-center">
              ⚡️ Supercharge Your DeSo Journey
            </h3>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg dark:shadow-deso-blue/20 
            bg-white dark:bg-deso-secondary border border-gray-100 dark:border-deso-blue/20
            transform transition-all duration-200 hover:scale-[1.02] w-full">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/Qf2DMRo_Fyc?modestbranding=1&rel=0&showinfo=0"
                title="DeSoOps Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Video 
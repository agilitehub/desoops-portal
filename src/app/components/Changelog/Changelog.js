import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PageLayout } from '../Layout'
import { 
  faRocket, 
  faBug, 
  faWrench,
  faStar,
  faShield,
  faUsers,
  faGem,
  faBan,
  faArrowsRotate,
  faCode,
  faCalculator,
  faGears,
  faFilter,
  faVideo,
  faSearch,
  faCalendar,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

/**
 * Changelog component that displays version history and updates
 */
const Changelog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')

  const versions = [
    {
      version: '2.6.0',
      date: '11 Sep 2024',
      type: 'feature',
      icon: faGears,
      title: 'Enhanced Distribution & Calculations',
      emoji: '🚀',
      changes: [
        'Opting Out Enhancements - Improved user control over participation',
        'Distribute to DeSoOps Users - New distribution target option',
        'Calculate $DESO in USD - Added USD value calculation feature',
        'Other Crypto Distribution Type - Expanded distribution options',
        'Enhanced user interface and controls',
        'Improved calculation accuracy and performance'
      ]
    },
    {
      version: '2.5.0',
      date: '13 Jul 2024',
      type: 'feature',
      icon: faUsers,
      title: 'Distribute tokens to Poll Voters',
      changes: [
        'Added ability to distribute tokens to voters of any Poll Post on the DeSo Platform',
        'New Poll Voters option in distribution targets',
        'Dialog to paste DeSo Poll link',
        'Enhanced user interface for poll voter selection'
      ]
    },
    {
      version: '2.4.1',
      date: '13 May 2024',
      type: 'feature',
      icon: faFilter,
      title: 'DESO Balance Distribution',
      changes: [
        'Distribute to Users based on their $DESO Balance',
        'New filter option in Rules tab to target users by $DESO balance',
        'Added "Where $DESO Balance is" filter in user targeting',
        'Enhanced token distribution mechanisms',
        'Added logic to manage GraphQL Data inconsistencies',
        'Minor Bug Fixes'
      ]
    },
    {
      version: '2.4.0',
      date: '15 Mar 2024',
      type: 'feature',
      icon: faGem,
      title: 'Diamond Shower Distribution',
      changes: [
        'Added Diamonds as a new distribution type option',
        'Bulk Distribute Diamond Showers to Token Holders, Followers, and more',
        'Configurable diamond distribution options:',
        '- Select number of diamonds to send (1-8)',
        '- Choose number of posts to diamond',
        '- Set time filter for posts',
        '- View estimated cost per user',
        'Warning system for high-cost distributions',
        'Minor UI Tweaks'
      ]
    },
    {
      version: '2.3.0',
      date: '31 Jan 2024',
      type: 'improvement',
      icon: faBan,
      title: 'Mass Tag Opt-Out',
      changes: [
        'Opt Out of being mass-tagged by a User via the DeSoOps Portal',
        'User privacy enhancement features',
        'Improved tag management system'
      ]
    },
    {
      version: '2.2.1',
      date: '17 Jan 2024',
      type: 'bug',
      icon: faArrowsRotate,
      title: 'Transaction Retry',
      changes: [
        'You can now retry submitting failed transactions',
        'Improved transaction error handling',
        'Enhanced transaction reliability'
      ]
    },
    {
      version: '2.2.0',
      date: '8 Jan 2024',
      type: 'feature',
      icon: faRocket,
      title: 'StealthEX Integration',
      changes: [
        'StealthEX DEX Integration allowing the swapping of over 1400 crypto tokens',
        'Expanded token support',
        'Enhanced DEX integration features',
        'Improved swap functionality'
      ]
    }
  ]

  const getTypeColor = (type) => {
    switch (type) {
      case 'feature':
        return 'bg-emerald-500/10 text-black dark:text-white border-emerald-500/20'
      case 'bug':
        return 'bg-red-500/10 text-black dark:text-white border-red-500/20'
      case 'improvement':
        return 'bg-blue-500/10 text-black dark:text-white border-blue-500/20'
      case 'security':
        return 'bg-purple-500/10 text-black dark:text-white border-purple-500/20'
      default:
        return 'bg-gray-500/10 text-black dark:text-white border-gray-500/20'
    }
  }

  const getTypeBadge = (type) => {
    const labels = {
      feature: 'New Feature',
      bug: 'Bug Fix',
      improvement: 'Enhancement',
      security: 'Security'
    }
    return labels[type] || type
  }

  const years = [...new Set(versions.map(v => new Date(v.date).getFullYear()))]
  const filteredVersions = versions.filter(version => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      version.version.toLowerCase().includes(searchLower) ||
      version.title.toLowerCase().includes(searchLower) ||
      version.changes.some(change => change.toLowerCase().includes(searchLower))
    const matchesYear = selectedYear === 'all' || new Date(version.date).getFullYear().toString() === selectedYear
    return matchesSearch && matchesYear
  })

  // Add a helper function to highlight search matches
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <span key={i} className="bg-deso-primary/20 dark:bg-deso-light/20 px-1 rounded">{part}</span>
        : part
    )
  }

  return (
    <PageLayout>
      <div className="py-8 px-3 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 sm:mb-4 relative inline-block">
              <span className="absolute inset-0 blur-[0.5px]
                text-black/95 dark:text-white/95">
                Changelog
              </span>
              <span className="relative bg-gradient-to-r from-[#FF4500] via-[#9333EA] to-[#3B82F6]
                dark:from-[#FF4500] dark:via-[#FF6B3D] dark:to-[#FFA500]
                bg-clip-text text-transparent animate-gradient font-black">
                Changelog
              </span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-deso-primary/80 dark:text-gray-300">
              Track our latest updates and improvements
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                  bg-white/50 dark:bg-deso-secondary/80 backdrop-blur-sm text-sm sm:text-base
                  focus:ring-2 focus:ring-deso-primary/20 focus:border-deso-primary/30
                  dark:focus:ring-deso-light/20 dark:focus:border-deso-light/30
                  dark:text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                    dark:hover:text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full sm:w-auto py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700
                  bg-white/50 dark:bg-deso-secondary/80 backdrop-blur-sm text-sm sm:text-base
                  focus:ring-2 focus:ring-deso-primary/20 focus:border-deso-primary/30
                  dark:focus:ring-deso-light/20 dark:focus:border-deso-light/30
                  dark:text-white"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline View */}
          <div className="relative">
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-deso-primary/20 to-deso-accent/20
              dark:from-deso-light/20 dark:to-deso-accent/20"></div>
            
            <div className="space-y-6 sm:space-y-8">
              {filteredVersions.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-deso-primary/60 dark:text-gray-400 text-base sm:text-lg">
                    No updates found matching "{searchTerm}"
                  </div>
                </div>
              ) : (
                filteredVersions.map((version, index) => (
                  <div 
                    key={version.version}
                    className="relative pl-8 sm:pl-16"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-3 sm:left-6 -translate-x-1/2 w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 
                      ${getTypeColor(version.type)} bg-white dark:bg-deso-secondary
                      transform transition-transform duration-300 group-hover:scale-125`}>
                    </div>

                    {/* Content Card */}
                    <div className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/80 rounded-xl p-4 sm:p-6 
                      shadow-[0_8px_16px_rgba(255,69,0,0.2),0_4px_8px_rgba(147,51,234,0.2),0_2px_4px_rgba(59,130,246,0.2)]
                      hover:shadow-[0_32px_64px_rgba(255,69,0,0.25),0_16px_32px_rgba(147,51,234,0.3),0_8px_16px_rgba(59,130,246,0.35)]
                      dark:shadow-[0_8px_16px_rgba(255,69,0,0.25),0_4px_8px_rgba(255,107,61,0.2)]
                      dark:hover:shadow-[0_32px_64px_rgba(255,69,0,0.3),0_16px_32px_rgba(255,107,61,0.35),0_8px_16px_rgba(255,165,0,0.4)]
                      transition-all duration-500 ease-out transform hover:scale-[1.01] hover:-translate-y-1
                      relative overflow-hidden group"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`${getTypeColor(version.type)} p-2 sm:p-3 rounded-lg 
                          bg-opacity-10 dark:bg-opacity-20 flex-shrink-0 transform transition-transform duration-300 
                          group-hover:scale-110`}>
                          <FontAwesomeIcon icon={version.icon} className="text-xl sm:text-2xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-xl sm:text-2xl font-extrabold relative inline-block">
                                <span className="absolute inset-0 blur-[0.5px]
                                  text-black/90 dark:text-white/95">
                                  v{highlightMatch(version.version, searchTerm)}
                                </span>
                                <span className="relative bg-gradient-to-r from-[#FF4500] via-[#9333EA] to-[#3B82F6]
                                  dark:from-[#FF4500] dark:via-[#FF6B3D] dark:to-[#FFA500]
                                  bg-clip-text text-transparent">
                                  v{highlightMatch(version.version, searchTerm)}
                                </span>
                              </h2>
                              <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${getTypeColor(version.type)}`}>
                                {getTypeBadge(version.type)}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold relative inline-block
                              px-2 sm:px-3 py-1 rounded-full 
                              border border-deso-primary/20 dark:border-deso-light/20
                              backdrop-blur-sm">
                              <span className="absolute inset-0 blur-[0.5px] px-2 sm:px-3 py-1
                                text-black/90 dark:text-white/95">
                                {version.date}
                              </span>
                              <span className="relative bg-gradient-to-r from-[#FF4500] to-[#3B82F6]
                                dark:from-[#FF6B3D] dark:to-[#FFA500]
                                bg-clip-text text-transparent">
                                {version.date}
                              </span>
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 relative inline-block">
                            <span className="absolute inset-0 blur-[0.5px]
                              text-black/90 dark:text-white/95">
                              {version.emoji} {highlightMatch(version.title, searchTerm)}
                            </span>
                            <span className="relative bg-gradient-to-r from-[#FF4500] via-[#9333EA] to-[#3B82F6]
                              dark:from-[#FF6B3D] dark:via-[#FF8C42] dark:to-[#FFA500]
                              bg-clip-text text-transparent">
                              {version.emoji} {highlightMatch(version.title, searchTerm)}
                            </span>
                          </h3>
                          <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg">
                            {version.changes.map((change, changeIndex) => (
                              <li 
                                key={changeIndex}
                                className="flex items-start gap-2 text-deso-primary/80 dark:text-gray-300"
                              >
                                <span className="text-deso-accent dark:text-deso-light mt-1.5">•</span>
                                <span>{highlightMatch(change, searchTerm)}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Video section only for version 2.6.0 */}
                          {version.version === '2.6.0' && (
                            <div className="mt-4 pt-4 sm:mt-6 sm:pt-6 border-t border-deso-accent/10 dark:border-deso-light/10">
                              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <FontAwesomeIcon icon={faVideo} className="text-deso-accent dark:text-deso-light" />
                                <h3 className="text-base sm:text-lg font-semibold text-deso-primary dark:text-white">
                                  Release Overview Video
                                </h3>
                              </div>
                              <div className="max-w-2xl mx-auto rounded-lg overflow-hidden">
                                <iframe
                                  className="w-full h-[280px] sm:h-[400px] rounded-lg shadow-lg"
                                  src="https://www.youtube.com/embed/DIRPIC72T8k"
                                  title="DeSoOps V2.6.0 Release Overview"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-center text-deso-primary/60 dark:text-gray-400">
                                Video by EchoDeSo Alliance (By @JohnVJardin)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Changelog 
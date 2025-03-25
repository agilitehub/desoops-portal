import React from 'react'
import Logo from '@/agilite-core/components/ui/Logo'

/**
 * Footer logo section with description
 */
const FooterLogo = ({ description }) => {
  return (
    <div className="mb-6 md:mb-0">
      <Logo size="small" />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}

export default FooterLogo 
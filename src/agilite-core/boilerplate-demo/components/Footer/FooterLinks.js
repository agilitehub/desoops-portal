import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

/**
 * Generic FooterLinks component that can be used for different footer sections
 */
const FooterLinks = ({ title, items }) => {
  // Map icon names to FontAwesome icons
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'github':
        return faGithub
      default:
        return null
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider">
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.type === 'internal' ? (
              <Link 
                to={item.path} 
                className="text-gray-600 dark:text-gray-400 hover:text-agilite-red dark:hover:text-agilite-red"
              >
                {item.icon && <FontAwesomeIcon icon={getIcon(item.icon)} className="mr-2" />}
                {item.label}
              </Link>
            ) : (
              <a 
                href={item.path}
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-agilite-red dark:hover:text-agilite-red"
              >
                {item.icon && <FontAwesomeIcon icon={getIcon(item.icon)} className="mr-2" />}
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterLinks 
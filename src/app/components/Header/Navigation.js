import React from 'react'
import { NavLink } from 'react-router-dom'
import { getHeaderNavItems } from '../../config/navigation'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'

/**
 * Generic Navigation component that can be used for both mobile and desktop
 * Accepts custom classNames, link styles, and click handlers
 */
const Navigation = ({ 
  containerClassName = '', 
  navLinkClassName, 
  onLinkClick = () => {},
  items = getHeaderNavItems() 
}) => {
  return (
    <div className={containerClassName}>
      {items.map(item => (
        <NavLink 
          key={item.path}
          to={item.path} 
          className={navLinkClassName}
          onClick={() => onLinkClick(item)}
          end={item.exact}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

export default Navigation 
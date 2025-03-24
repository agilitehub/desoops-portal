import React from 'react'
import CodeBlock from './CodeBlock'

/**
 * Reusable instruction step component for step-by-step guides
 */
const InstructionStep = ({ number, title, description, code }) => {
  return (
    <li className="text-lg text-gray-800 dark:text-white">
      <span className="font-semibold">{title}</span>
      <p className="mt-2 text-gray-600 dark:text-gray-400 pl-6">
        {description}
      </p>
      {code && <CodeBlock code={code} />}
    </li>
  )
}

export default InstructionStep 
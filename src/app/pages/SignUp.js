import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWallet, 
  faKey, 
  faUserPlus,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons'
import PageLayout from '../components/Layout/PageLayout'

const SignUp = () => {
  const [agreedToSeedPhrase, setAgreedToSeedPhrase] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreedToSeedPhrase) {
      return
    }
    // Handle sign up logic here
  }

  const isFormValid = agreedToSeedPhrase

  return (
    <PageLayout>
      <div className='container-padded py-16 max-w-3xl mx-auto'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <h1 className='mb-6 text-4xl font-bold tracking-tight text-deso-primary dark:text-white drop-shadow-[0_8px_16px_rgba(19,66,146,0.5)] dark:drop-shadow-[0_8px_16px_rgba(255,127,80,0.5)]'>
            Welcome to DeSoOps! Let's Get Started
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            We're excited to have you join us! In just a few simple steps, you'll have your own secure account that puts you in control of your digital presence.
          </p>
        </div>

        {/* Main Form Section */}
        <div className='backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-8 
          shadow-[0_12px_32px_rgba(19,66,146,0.25)]
          dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)]'>
          
          {/* Important Notice */}
          <div className='mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded'>
            <div className='flex items-start'>
              <FontAwesomeIcon icon={faShieldHalved} className='text-blue-500 text-xl mt-1 mr-4' />
              <div>
                <h3 className='text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2'>
                  Your Security Comes First
                </h3>
                <p className='text-blue-700 dark:text-blue-100 mb-4'>
                  We're about to create your secure account. Here's what will happen:
                </p>
                <ul className='space-y-3 text-blue-700 dark:text-blue-100 ml-4'>
                  <li className='flex items-start'>
                    <FontAwesomeIcon icon={faWallet} className='mt-1 mr-3' />
                    <span>We'll create your personal digital wallet - think of it as your secure digital identity</span>
                  </li>
                  <li className='flex items-start'>
                    <FontAwesomeIcon icon={faKey} className='mt-1 mr-3' />
                    <span>You'll receive a special 12-word seed phrase - this is like the master key to your account</span>
                  </li>
                </ul>
                <div className='mt-4 p-3 bg-blue-100 dark:bg-blue-800/50 rounded'>
                  <p className='text-blue-800 dark:text-blue-100 font-medium'>
                    💡 Quick Tip: When you get your 12-word seed phrase, write it down and keep it somewhere safe. It's the only way to recover your account if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Agreement Checkbox */}
            <div className='flex items-start p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors'>
              <div className='flex items-center h-6'>
                <input
                  id='seedPhrase'
                  type='checkbox'
                  checked={agreedToSeedPhrase}
                  onChange={(e) => setAgreedToSeedPhrase(e.target.checked)}
                  className='w-5 h-5 border-2 border-deso-primary/20 dark:border-deso-light/20 rounded 
                    text-deso-primary focus:ring-deso-primary dark:focus:ring-deso-light'
                />
              </div>
              <label htmlFor='seedPhrase' className='ml-3 text-gray-600 dark:text-gray-300 cursor-pointer'>
                I understand that I need to safely store my 12-word seed phrase
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type='submit'
              disabled={!isFormValid}
              className={`w-full flex justify-center items-center px-6 py-4 rounded-lg text-lg font-semibold
                transition-all duration-200 transform hover:scale-105 
                ${isFormValid 
                  ? 'bg-deso-primary hover:bg-deso-blue text-white shadow-[0_8px_24px_rgba(19,66,146,0.5)] hover:shadow-[0_12px_32px_rgba(19,66,146,0.6)] dark:bg-deso-light dark:hover:bg-deso-dodger dark:shadow-[0_8px_24px_rgba(100,190,255,0.5)] dark:hover:shadow-[0_12px_32px_rgba(100,190,255,0.6)]'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
            >
              <FontAwesomeIcon icon={faUserPlus} className='mr-2' />
              {isFormValid ? 'Let\'s Create Your Account' : 'Please Acknowledge the Seed Phrase Notice'}
            </button>

            {/* Sign In Link */}
            <p className='text-center text-gray-600 dark:text-gray-300 mt-6'>
              Already have an account?{' '}
              <Link to='/signin' className='text-deso-primary dark:text-deso-light hover:underline font-semibold'>
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Benefits Section */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='text-center'>
            <div className='inline-block p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full mb-4'>
              <FontAwesomeIcon icon={faWallet} className='text-2xl text-deso-primary dark:text-deso-light' />
            </div>
            <h3 className='text-lg font-semibold text-deso-primary dark:text-white mb-2'>Easy to Use</h3>
            <p className='text-gray-600 dark:text-gray-300'>Simple and secure access to the DeSo ecosystem</p>
          </div>
          <div className='text-center'>
            <div className='inline-block p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full mb-4'>
              <FontAwesomeIcon icon={faKey} className='text-2xl text-deso-primary dark:text-deso-light' />
            </div>
            <h3 className='text-lg font-semibold text-deso-primary dark:text-white mb-2'>You're in Control</h3>
            <p className='text-gray-600 dark:text-gray-300'>Your account, your keys, your data - always</p>
          </div>
          <div className='text-center'>
            <div className='inline-block p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full mb-4'>
              <FontAwesomeIcon icon={faShieldHalved} className='text-2xl text-deso-primary dark:text-deso-light' />
            </div>
            <h3 className='text-lg font-semibold text-deso-primary dark:text-white mb-2'>Always Secure</h3>
            <p className='text-gray-600 dark:text-gray-300'>Built with the highest security standards</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default SignUp 
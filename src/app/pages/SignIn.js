import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWallet,
  faShieldHalved,
  faKey
} from '@fortawesome/free-solid-svg-icons'
import PageLayout from '../components/Layout/PageLayout'

const SignIn = () => {
  const handleSignIn = () => {
    // Handle DeSo sign in logic here
  }

  return (
    <PageLayout>
      <div className='container-padded py-16 max-w-3xl mx-auto'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <h1 className='mb-6 text-4xl font-bold tracking-tight text-deso-primary dark:text-white drop-shadow-[0_8px_16px_rgba(19,66,146,0.5)] dark:drop-shadow-[0_8px_16px_rgba(255,127,80,0.5)]'>
            Welcome Back to DeSoOps
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Sign in with your DeSo account to access your dashboard and manage your operations.
          </p>
        </div>

        {/* Main Sign In Section */}
        <div className='backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-8 
          shadow-[0_12px_32px_rgba(19,66,146,0.25)]
          dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)]'>
          
          {/* Security Notice */}
          <div className='mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded'>
            <div className='flex items-start'>
              <FontAwesomeIcon icon={faShieldHalved} className='text-blue-500 text-xl mt-1 mr-4' />
              <div>
                <h3 className='text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2'>
                  Secure Sign In with DeSo
                </h3>
                <p className='text-blue-700 dark:text-blue-100'>
                  Sign in securely using your DeSo wallet. Your keys, your control - always.
                </p>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className='w-full flex justify-center items-center px-6 py-4 rounded-lg text-lg font-semibold
              bg-gradient-to-r from-deso-primary via-deso-blue to-deso-accent text-white
              transition-all duration-200 transform hover:scale-105 
              shadow-[0_8px_24px_rgba(19,66,146,0.5)] hover:shadow-[0_12px_32px_rgba(19,66,146,0.6)]
              dark:from-deso-light dark:via-deso-dodger dark:to-deso-accent
              dark:shadow-[0_8px_24px_rgba(100,190,255,0.5)] dark:hover:shadow-[0_12px_32px_rgba(100,190,255,0.6)]
              relative overflow-hidden group'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
              translate-x-[-100%] animate-shimmer group-hover:translate-x-[100%] transition-transform duration-1000' />
            <FontAwesomeIcon icon={faWallet} className='mr-2 relative' />
            <span className='relative'>Sign In with DeSo</span>
          </button>

          {/* Sign Up Link */}
          <p className='text-center text-gray-600 dark:text-gray-300 mt-6'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-deso-primary dark:text-deso-light hover:underline font-semibold'>
              Create Account
            </Link>
          </p>
        </div>

        {/* Benefits Section */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='text-center'>
            <div className='inline-block p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full mb-4'>
              <FontAwesomeIcon icon={faWallet} className='text-2xl text-deso-primary dark:text-deso-light' />
            </div>
            <h3 className='text-lg font-semibold text-deso-primary dark:text-white mb-2'>One-Click Access</h3>
            <p className='text-gray-600 dark:text-gray-300'>Sign in securely with your DeSo wallet in just one click</p>
          </div>
          <div className='text-center'>
            <div className='inline-block p-3 bg-deso-primary/10 dark:bg-deso-light/10 rounded-full mb-4'>
              <FontAwesomeIcon icon={faKey} className='text-2xl text-deso-primary dark:text-deso-light' />
            </div>
            <h3 className='text-lg font-semibold text-deso-primary dark:text-white mb-2'>Your Keys, Your Control</h3>
            <p className='text-gray-600 dark:text-gray-300'>Maintain complete control over your account and assets</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default SignIn 
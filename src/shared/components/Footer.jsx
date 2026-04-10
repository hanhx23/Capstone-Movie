import React from 'react'

export const Footer = () => {
  return (
    <footer className='flex items-center justify-center p-5 bg-black text-white text-lg text-center'>
      <div className='container mx-auto'>
        @{new Date().getFullYear()} Movie - All rights reserved
      </div>
    </footer>
  )
}

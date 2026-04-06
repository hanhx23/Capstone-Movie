import React from 'react'

export const Footer = () => {
  return (
    <footer className='p-5 bg-black text-white text-lg'>
    <div className='container mx-auto'>
      @{new Date().getFullYear()} Movie - All rights reserved
    </div>
    </footer>
  )
}

import React from 'react'

const Footer = () => {
  return (
    
      <footer className=' bg-gray-900 md:px-36 text-left w-full mt-10'>
        <div className='flex flex-col md:flex-row items-start px-8 
        md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
          <div className='flex flex-col md:items-start items-center w-full'>
          <p  className='text-white w-28 lg:w-32 font-extrabold text-xl cursor-pointer'>Logo Here</p>
          <p className='mt-6 text-center md:text-left text-sm text-white/80'> some footer notes</p>        
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div >
        <div className='hidden md:flex flex-col items-start w-full'>
         <h2 className='font-semibold text-white mb-5'>Subscibe to our newsletter</h2>
         <p className='text-sm text-white/80'>The latest news, articles, and resources, sent to your inbox weekly.</p>
         <div className='flex items-center gap-2 pt-4 '>
          <input className='border border-gray-500/80 bg-gray-800 
          text-gray-500 outline-none w-64 h-9 rounded px-2 text sm' type="email" placeholder='Enter your email'/>
          <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
         </div>
        </div>
        </div>
        <p className='py-4 text-center text-sm text-white/80'>Copyright 2025 @FreeCourses. All Right Reserved</p>
      </footer>
    
  )
}

export default Footer
import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
<footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left
                    w-full px-8 border-t'>
          {/* left footer */}
         <div className='flex items-center gap-4'>

         
         <p  className='text-blue-500 w-28 lg:w-32 font-extrabold text-xl cursor-pointer'>Logo Here</p>
          <div className='hidden md:block h-7 w-px bg-gray-500/60'>

           </div>
               <p className='py-4 text-center text-xs md:text-am text-gray-500'>
                Copyright 2025 © FreeCourse. All Right Reserved.
               </p>
          </div>  
          {/* right footer */}
          <div className='flex items-center gap-3 max-md:mt-4'>
            <a href="#">
              <img src={assets.facebook_icon} alt="facebook_icon" />
            </a>
            <a href="#">
              <img src={assets.twitter_icon} alt="twitter_icon" />
            </a>
            <a href="#">
              <img src={assets.instagram_icon} alt="instagram_icon" />
            </a>
          </div>
          <div></div>           

</footer>
  )
}

export default Footer

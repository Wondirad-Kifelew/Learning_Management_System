import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link, Navigate } from 'react-router-dom'

const NavBar = () => {
  const educatorData = dummyEducatorData
  const {user} = useUser()


  return (
    <div className='flex items-center 
    justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
    <Link to='/'>
      
      <p onClick={()=>Navigate('/')} className='text-blue-500 w-28 lg:w-32 font-extrabold text-xl cursor-pointer'>Logo Here</p>
      </Link>

      <div className='flex items-center gap-5 text-gray-500 relative'>
      <p>Hi! {user?  user.fullName: 'Developers'} </p>  
      {user?  <UserButton/>: <img className='max-w-8' src={assets.profile_img}/>}
        </div>
    </div>
  )
}

export default NavBar
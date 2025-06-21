import React, { useContext} from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContextHelper'
import { assets } from '../../assets/assets'

const NavBar = () => {
  
  const {navigate} = useNavigate()
   const {loggedUser, handleLogout} = useContext(AppContext)
   
  return (
    <div className='flex items-center 
    justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
    <Link to='/'>
      
      <p onClick={()=>navigate('/')} className='text-blue-500 w-28 lg:w-32 font-extrabold text-xl cursor-pointer'>Logo Here</p>
      </Link>

      <div className='flex items-center gap-5 text-gray-500 relative'>
      <p>Hi! <span className='text-blue-600'>{loggedUser?  loggedUser: 'Users'}</span> </p>  
      {loggedUser?  <button onClick={(e)=>handleLogout(e)} className='bg-blue-600 text-white px-5 py-2
           rounded-full'>Logout</button>
           : <img className='max-w-8' src={assets.profile_img}/>}
        </div>
    </div>
  )
}

export default NavBar
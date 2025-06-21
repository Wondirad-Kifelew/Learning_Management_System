import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
// import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContextHelper'
import { Link } from 'react-router-dom'
import axios from '../../axiosInstance'
import { toast } from 'react-toastify'

const Navbar = () => {
  const isCourseListPage = location.pathname.includes('course-list')
  const {navigate, isEducator, userName, setUserName,
         email, setEmail, password, setPassword
        } = useContext(AppContext)
//   const {openSignIn}= useClerk()
//   const {user} = useUser()
// console.log("user", user)
    const {loggedUser, setLoggedUser} = useContext(AppContext)
    const [loginClicked, setLoginClicked] = useState(false)
    const [haveAccount, setHaveAccount] = useState(true)
    // const [userName, setUserName] = useState('')
    // const [password, setPassword] = useState('')
    // const [email, setEmail] = useState('')
    const [seePassword, SetSeePassword] = useState(false)
    const [lostPassBtn, setLostPassBtn] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [loading, setLoading] = useState(false)

console.log("username: ", userName, password, email)
    const handleLogin = async (e)=>{
        e.preventDefault()
        const credentials = {
            username: userName,
            password,
        }
        try {
            const response = await axios.post('/api/login', credentials)
            const loginResponse = response.data
            
            if(loginResponse){
                setLoggedUser(loginResponse.username)
                setLoginClicked(false)
                toast.success(`${loginResponse.username} successfully logged in!`)
               }
              } catch (error) {
          console.log("Error signining in: ", error.response.data.error)
          toast.error(error.response.data.error)
        }     
    }
    
    const handleLogout= async (e)=>{
        e.preventDefault()
        //there is a global axios config to send with credentials
        try {
        const response = await axios.post('/api/logout')
        console.log("Logout response: ", response.data.message)    
        } catch (error) {
        console.log("Logout error: ", error.response.data.error)    
        }
        setLoggedUser(null)
        setUserName('')
        setPassword('')
        setEmail('')
    }

    const handleRegister= async (e)=>{
        e.preventDefault()
    const userInfo = {
    username: userName,
    email,
    password 
    }
   try {
        const response = await axios.post('/api/signup', userInfo)
        const signupResponse = response.data

        if(signupResponse){
            setLoggedUser(signupResponse.username)
            setLoginClicked(false)
            toast.success(`${signupResponse.username} successfully Signed up`)
        }
    } catch (error) {
        console.log("Error signing up: ", error.response)
        if(error?.response?.data?.error?.includes("is shorter than the minimum allowed length"))
        {
                toast.error("Username must be atleast 3 charachters long")
        }else if(error?.response?.data?.error === "password must be at least 8 characters long")
            {
                toast.error(error.response.data.error)
        }
    }}

    const handleLostPass = ()=>{
      setLoginClicked(false)
      setLostPassBtn(true)
    }
    const handlePasswordReset = async (e)=>{
        e.preventDefault()
try {
    setLoading(true) 
    const response = await axios.post('/api/forgot-password', {resetEmail})
     console.log("pass reset resonse: ", response)
     toast.success("Email sent. Please check your inbox!")
    
} catch (error) {
    toast.error(error.response.data.error)
} finally{
    setLoading(false)
}
    }
    // on every refresh user should stay logged in 
    useEffect(() => {
    const fetchUser = async ()=>{
        try {
        const response = await axios.post('/api/me')
        console.log("me response: ", response)
        if(response.data.username){
            setLoggedUser(response.data.username)
        }    
        } catch (error) {
            console.log("error: ", error.response)
            setLoggedUser(null)
        }
    }
    fetchUser()
  }, [])

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 
    lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage? 'bg-white': 'bg-cyan-100/70'}`}>
      
      {/* signin/signup popup */}
                {loginClicked && <div className='fixed inset-0 z-50 flex items-center justify-center
                bg-gray-100/80'>

              <div className='p-4 rounded bg-white text-gray-700 relative max-w-80 mx-5 w-full'>
                <div>
                    <h2 className='text-2xl font-semibold mb-4 border-b py-5'>
                    
                    {haveAccount? "Login": "SignUp"}
                    </h2>

                    <form onSubmit={haveAccount? handleLogin: handleRegister}>
                    <div className={` flex justify-center items-center bg-gray-200 rounded mt-3`}>
                        <img src={assets.user_icon} alt="user icon" className='ml-2 w-4 h-4'/>
                    <input value={userName} onChange={(e)=>setUserName(e.target.value)} type="text" placeholder='Username' 
                    className=' w-full outline-none  rounded py-4 px-2 ' required/>
                    </div>
                    <div className={`${haveAccount? "hidden": "flex"} justify-center items-center bg-gray-200 rounded mt-3`}>
                        <img src={assets.email} alt="user icon" className='ml-2 w-4 h-4'/>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email'
                    className=' w-full outline-none  rounded py-4 px-2'
                    required={!haveAccount}/>
                    </div>
                    <div className='flex justify-center items-center bg-gray-200 rounded mt-3 relative'>
                        <img src={assets.password} alt="user icon" className='ml-2 w-4 h-4'/>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} 
                    type={`${seePassword? "text": "password"}`} placeholder='Password'
                    className='truncate overflow-hidden w-full outline-none  rounded py-4 pl-2 pr-7' required/>
                    <img src={seePassword?assets.eye:assets.eye_closed} 
                    alt="eye_icon" 
                    onClick={()=>SetSeePassword(!seePassword)}
                    className="absolute w-5 h-5 right-2"/>
                    </div>
                    <div className={`flex-row mt-2 text-xs`}>
                        {haveAccount?
                        <p>Dont have an account? <span onClick={()=>setHaveAccount(false)} 
                            className='text-blue-500 cursor-pointer'>Sign Up</span></p>:
                        <p>Have an account? <span onClick={()=>setHaveAccount(true)} 
                            className='text-blue-500 cursor-pointer'>Login</span></p>}

                        <p className={`${haveAccount?"flex": "hidden"} items-start`}>Lost password? 
                            <span
                            className='text-blue-500 cursor-pointer mx-1'
                            onClick={()=>handleLostPass()}>click here!</span></p>

                    </div>

                    {/* btns */}
                    <div className='text-center mt-4' >
                    {haveAccount? <button type="submit"  
                    className='text-white bg-blue-600 rounded  py-1 px-7 cursor-pointer'>Login</button>
                    : <button type="submit"
                    className='text-white bg-blue-600 rounded  py-1 px-7 cursor-pointer'>SignUp</button>
                    
                    }
                        
                    </div>
                    </form>
                </div>

                    <img src={assets.cross_icon} alt="cross icon"  
                    onClick={()=>{setLoginClicked(false), setHaveAccount(true), setEmail(''), setUserName(''), setPassword('')}}
                    className='absolute top-4 right-4 w-4 curson-pointer'/>
                    </div>
                </div>}
                {/* pass reset popup */}
                  {lostPassBtn && 
                  <div className='fixed inset-0 z-50 flex items-center justify-center
                bg-gray-100/80'>
                      
                    <div 
                    className='p-4 rounded bg-white text-gray-700 relative max-w-80 mx-5 w-full flex-col'>
                        <h1 className='text-2xl font-semibold mb-4 border-b py-5'>
                            Forgot Your Password?</h1>
                        
                            <p className='text-center'>
                                Please enter the email address you used to register.</p>
                        <form onSubmit={(e)=>handlePasswordReset(e)}>
                            <div className={`flex justify-center items-center bg-gray-200 rounded mt-3`}>
                                <img src={assets.email} alt="email icon" className='ml-2 w-4 h-4'/>
                            <input value={resetEmail} onChange={(e)=>setResetEmail(e.target.value)} type="email" placeholder='Email'
                            className=' w-full outline-none  rounded py-4 px-2'
                            required/>
                            </div>
                            <div className='text-center mt-4'>
                           <button type="submit"  
                    className='text-white bg-blue-600 rounded  py-1 px-7 cursor-pointer'>Email me</button>
                    {loading && 
                            <p className='text-center'>
                            Email will be sent shortly...</p>
                    }
                    </div>
                        </form>
                        <img src={assets.cross_icon} alt="cross icon"  
                    onClick={()=>{setLostPassBtn(false), setResetEmail('')}}
                    className='absolute top-4 right-4 w-4 curson-pointer'/>
                        </div>
                            </div>}
      <p onClick={()=>navigate('/')} className='text-blue-500 w-28 lg:w-32 font-extrabold text-xl cursor-pointer'>Logo Here</p>
      <div className='hidden md:flex  items-center gap-5 text-gray-500 '> 
           <div className='flex items-center gap-5'> 
            {loggedUser && <>
              <button onClick={()=>navigate('/educator')}>{isEducator? 'Educator Dashboard':'Become Educator'}</button>
            | <Link to='/my-enrollments'>My Enrollments </Link></>}
           </div>
           {loggedUser? <button onClick={(e)=>handleLogout(e)} className='bg-blue-600 text-white px-5 py-2
           rounded-full'>Logout</button>
            :<button onClick={()=>setLoginClicked(true)} className='bg-blue-600 text-white px-5 py-2
           rounded-full'>Login</button>}
      </div>
      {/* for phone screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {loggedUser && <>
          <button>{isEducator? 'Educator Dashboard':'Become Educator'}</button>
            | <Link to='/my-enrollments'>My Enrollments </Link></>}
        </div>
        { loggedUser? <button onClick={(e)=>handleLogout(e)} className='bg-blue-600 text-white px-3 py-1
           text-sm rounded-full'>Logout</button>
        :<button onClick={()=>setLoginClicked(true)}><img src={assets.user_icon} alt="user-icon" /></button>}
      </div>
    </div>
  )
}

export default Navbar
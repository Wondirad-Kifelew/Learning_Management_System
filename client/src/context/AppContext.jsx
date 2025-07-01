import { useEffect, useState } from "react";
import { AppContext } from "./AppContextHelper";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "../axiosInstance";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

export const AppContextProvider = (props)=>{
    const currency = import.meta.env.VITE_CURRENCY
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [loggedUser, setLoggedUser] = useState(null)
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')    
    const [userData, setUserData] = useState(null)
    const navigate  = useNavigate()



    //fetch all courses
    const fetchAllCourses = async ()=>{
        
        try {//add 
         const {data} = await axiosInstance.get('/api/course/all')

         if(data.success){
            setAllCourses(data.courses)
         }else{
            toast.error(data.message)
         }
        } catch (error) {
            toast.error(error.message)
        }

    }

    // fetchUserData
    const fetchUserData = async()=> {
     try {
        const {data} = await axiosInstance.get('/api/user/data')
      if(data.success){
            setUserData(data.user)
            // update educator
            if(data.user.role==='educator'){
                setIsEducator(true)
            }else{
                setIsEducator(false)
            }
         }else{
            toast.error(data.message)
         }
     } catch (error) {
        toast.error(error.message)
     }
    }
    
    // calculate the average rating of course
    const calculateRating =(course)=>{
        if(course.courseRatings.length == 0){
            return 0
        }
        const totalRating = course.courseRatings.reduce((sum, r)=>r.rating+sum, 0)
        return Math.floor(totalRating/course.courseRatings.length)
    } 
    // calculate course chapter duraion
    const calculateChapterTime = (chapter)=>{
        let time = 0
    
    chapter.chapterContent.forEach(lecture => time+=lecture.lectureDuration)
    
    return humanizeDuration(time *60*1000, {units: ['h', 'm']})
    }
    // calculate course duration
    
    const calculateCourseDuration = (course)=>{
      let time = 0
     course.courseContent.forEach(chapter=> 
        chapter.chapterContent.forEach(lecture=> time+=lecture.lectureDuration))
        
    return humanizeDuration(time*60*1000, {units: ['h', 'm']})
    }

   // calculate number of lectures in the course
   const calculateNumberOfLectures = (course)=>{
    let lectureCount = 0

    course.courseContent.forEach(chapter=>{
        if (Array.isArray(chapter.chapterContent)){
          lectureCount+= chapter.chapterContent.length 
        } 
    })
    return lectureCount
   }

   // user enrolled courses
   const fetchUserEnrolledCourses = async ()=>{
     try {
        const {data} = await axiosInstance.get('/api/user/enrolled-courses')
        if(data.success){
            setEnrolledCourses(data.userEnrolledCourses.reverse())
        }else{
            toast.error(data.message)
        }
     } catch (error) {
        toast.error(error.message)
     }
   }
    //login from the main page but logout from any where
    const handleLogout= async (e)=>{
        e.preventDefault()
        //there is a global axios config to send with credentials
        try {
        const response = await axiosInstance.post('/api/logout')
        console.log("Logout response: ", response.data.message)    
        } catch (error) {
        console.log("Logout error: ", error.response.data.error)    
        }
        setLoggedUser(null)
        setUserName('')
        setPassword('')
        setEmail('')
        navigate('/')
    }    

    useEffect((()=>{
        fetchAllCourses()
    }), [])

    useEffect(()=>{
      if(loggedUser){
        fetchUserData()
        fetchUserEnrolledCourses()
      }
    }, [loggedUser])
    // values i want to use everywhere
    const value = {currency, allCourses, navigate, 
        calculateRating, isEducator, setIsEducator,
        calculateChapterTime, calculateCourseDuration,
        calculateNumberOfLectures, enrolledCourses,
        fetchUserEnrolledCourses, loggedUser, setLoggedUser,
        handleLogout, userName, setUserName, password, setPassword,
        email, setEmail, userData, setUserData, fetchAllCourses}
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


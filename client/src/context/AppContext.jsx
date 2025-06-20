import { useEffect, useState } from "react";
import { AppContext } from "./AppContextHelper";
import { dummyCourses  } from "../assets/assets";
import { Navigate, useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "../axiosInstance";

export const AppContextProvider = (props)=>{
    const currency = import.meta.env.VITE_CURRENCY
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])
   const [loggedUser, setLoggedUser] = useState(null)
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')    
    const navigate  = useNavigate()


    //fetch all courses
    const fetchAllCourses = ()=>{
        setAllCourses(dummyCourses)
    }
    
    // calculate the average rating of course
    const calculateRating =(course)=>{
        if(course.courseRatings.length == 0){
            return 0
        }
        const totalRating = course.courseRatings.reduce((sum, r)=>r.rating+sum, 0)
        return totalRating/course.courseRatings.length
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
     await setEnrolledCourses(dummyCourses)
   }
    //login from the main page but logout from any where
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
        Navigate('/')
    }    

    useEffect((()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }), [])
    // values i want to use everywhere
    const value = {currency, allCourses, navigate, 
        calculateRating, isEducator, setIsEducator,
        calculateChapterTime, calculateCourseDuration,
        calculateNumberOfLectures, enrolledCourses,
        fetchUserEnrolledCourses, loggedUser, setLoggedUser,
        handleLogout, userName, setUserName, password, setPassword,
        email, setEmail}
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContextHelper'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Loading from '../../components/student/Loading'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import axios from '../../axiosInstance'
import { toast } from 'react-toastify'
import axiosInstance from '../../axiosInstance'

const Player = () => {
     const {enrolledCourses, calculateChapterTime, userData,
      fetchUserEnrolledCourses
      } = useContext(AppContext)

     
     const {courseId} = useParams()
     const [courseData, setCourseData] = useState(null)
     const [openSection, setOpenSection] = useState({})
     const [playerData, setPlayerData] =useState({})
     const [progressData, setProgressData] = useState(null)
     const [initialRating, setInitialRating] = useState(0)

     const getCourseData = ()=>{
     
      const course = enrolledCourses.find(course=>course._id===courseId)
      if(course){
      setCourseData(course)
      const userRating = course.courseRatings.find(rate=>rate.userId ===userData._id)
       if(userRating) setInitialRating(userRating)
      }
     }

       const toggleSection = (index)=>{
            setOpenSection((prev)=>(
          {...prev, [index]:!prev[index],}
            ))
            }

     useEffect(()=>{
       if(enrolledCourses.length > 0 ){
        getCourseData()
       }
     }, [enrolledCourses])
     
     const markLectureAsCompleted = async (lectureId)=>{
      try {
         const {data} = await axiosInstance.post('/api/user/update-user-progress', 
          {courseId, lectureId})
        if(data.success){
         toast.success(data.message)
         getCourseProgress()
        } else{
         toast.error(data.message)
        }        
      } catch (error) {
         toast.error(error.message)
      }
     }
     const getCourseProgress = async ()=>{
      try {
        const {data} = await axiosInstance.post('/api/user/get-course-progress', 
          {courseId})

        if(data.success){
         setProgressData(data.progressData)
        } else{
         toast.error(data.message)
        }
      } catch (error) {
         toast.error(error.message)
      }
     }
     const handleRate = async (rating)=>{
      try {
        const {data} = await axiosInstance.post('/api/user/add-rating', 
          {courseId, rating})
         
          if(data.success){
         toast.success(data.message)
         fetchUserEnrolledCourses()
        } else{
         toast.error(data.message)
        }           
      } catch (error) {
         toast.error(error.message)
      }
     }
     useEffect(()=>{
      getCourseProgress()
     },[])
     return courseData? (
    <>
    <div className='p-2 sm:p-10 flex-col-reverse md:grid md:grid-cols-2 gap-10
    md:px-36'>
      {/* left column */}
   <div className='text-gray-800'>
    <h2 className='text-xl font-semibold'>Course Structure</h2>

     <div className='pt-5'>{
        courseData && courseData.courseContent.map((chapter, ind)=>(
          <div key={ind} className='border border-gray-300 bg-white mb-2 rounded'>
            <div className='flex items-center justify-between px-4 py-3
              cursor-pointer select-none ' onClick={()=>toggleSection(ind)}>
                {/*  */}
              <div className='flex items-center gap-2'>
                <img  className={`transform transition-transform ${openSection[ind]? 
                  'rotate-180':''}`}
                src={assets.down_arrow_icon} alt="arrow icon" />
                <p className='font-medium text-sm md:text-base'>{chapter.chapterTitle}</p>
              </div>
              <div className='text-sm md:text-[15px] md:leading-[21px]'>{chapter.chapterContent.length}{' '}
                {chapter.chapterContent.length >1? 'lectures':'lecture'}
                {' - '}{calculateChapterTime(chapter)}
              </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300
            ${openSection[ind]? 'max-h-96': 'max-h-0'}`}>
              <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600
              border-t border-gray-300'>{
                chapter.chapterContent.map((lecture, i)=>(
                  <li key={i} className='flex items-start gap-2 py-1 '>  
                    
                    <img src={progressData && 
                    progressData.lectureCompleted.includes(lecture.lectureId)?
                    assets.blue_tick_icon:assets.play_icon} alt="play_icon" className='w-4
                    h-4 mt-1'/>

                    <div className='flex items-center justify-between w-full
                    text-gray-800 text-xs md:text-[15px] md:leading-[21px]'>
                      <p>{lecture.lectureTitle}</p>
                      <div className='flex gap-2'>{lecture.lectureUrl && 
                        <p onClick={()=>setPlayerData({
                          ...lecture, chapter: ind +1, lecture:i+1
                        })} className='text-blue-500 cursor-pointer'>Watch</p>}
                      <p>{humanizeDuration(lecture.lectureDuration *60*1000, 
                        {units: ['h', 'm']}
                      )}</p>
                      </div>
                    </div>
                  </li>
                ))
              }</ul>
            </div>
          </div>
        ))
         }</div>
    <div className='flex items-center gap-2 py-3 mt-10'>
      <h1 className='text-xl font-bold'>Rate this course: </h1>
      <Rating initialRating={initialRating} onRate={handleRate}/>
    </div>
   </div>

      {/* right column */}
   <div className='md:mt-10 '>
    {
      playerData && Object.keys(playerData).length > 0? (
        <div>
           <YouTube videoId={playerData.lectureUrl.split('/').pop()}
          iframeClassName='w-full aspect-video'/>
          <div className='flex justify-between items-center mt-1'>
            <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
            <button onClick={()=>markLectureAsCompleted(playerData.lectureId)}
            className='text-blue-600'>{progressData && 
              progressData.lectureCompleted.includes(playerData.lectureId)
            ?'Completed':'Mark complete' }</button>
          </div>
        </div> 
      ) : <img src={courseData? courseData.courseThumbnail: ""} alt="" />
      
    }
   </div>

    </div>
    <Footer/>
    </>

  ): <Loading/>
}

export default Player

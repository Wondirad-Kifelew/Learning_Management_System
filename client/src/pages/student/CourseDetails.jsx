import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContextHelper'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'
import axios from '../../axiosInstance'
import { toast } from 'react-toastify'
import axiosInstance from '../../axiosInstance'

const CourseDetails = () => {
   const {id} = useParams()
   
  const [courseData, setCourseData] = useState(null)
  const [openSection, setOpenSection] = useState({})
  const [playerData, setPlayerData] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)

  const {calculateRating, 
        calculateChapterTime, calculateCourseDuration,
        calculateNumberOfLectures, currency, userData } = useContext(AppContext)
      
  const toggleSection = (index)=>{
  setOpenSection((prev)=>(
{...prev, [index]:!prev[index],}
  ))
  }

  const fetchedCourseData = async()=>{
    try {
      const {data} = await axiosInstance.get('/api/course/'+ id)
       if(data.success){
        setCourseData(data.courseData)
       }else{
        toast.error(data.message)
       }
    } catch (error) {
      toast.error(error.message)
    }
  }
const enrollCourse =async()=>{
  try {
    if(!userData){
      toast.warn('Login to enroll!')
    }if(isAlreadyEnrolled){
      toast.warn('Already enrolled to the course!')
    }
    const {data} = await axiosInstance.post('/api/user/purchase' , {courseId:courseData._id})
  if(data.success){
   const {session_url} = data
   window.location.replace(session_url)

  }else{
    toast.error(data.message)
  }
  } catch (error) {
      toast.error(error.message)  }
}
  useEffect(()=>{
    const fetchData = async()=>{
      await fetchedCourseData()
    }
    fetchData()

  },[])
  useEffect(()=>{
    if(userData && courseData){
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  
  },[userData, courseData])
  
  return courseData? (
<>    
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start 
    justify-between md:px-36 px-8 md:pt-30 pt-20  text-left h-min-h-screen'>
      
     
{/* Left column */}
<div className='max-w-xl z-10 text-gray-500'>
  <h1 className='md:text-[36px] text-[26px] leading-[36px] font-semi-bold text-gray-800'> 
    {courseData.courseTitle}</h1>
  <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{__html:courseData.courseDescription.slice(0, 200)}}></p>
  {/* review and rating */}
  <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
              <p>{calculateRating(courseData)}</p>
              <div className='flex'>
                {[...Array(5)].map((_,i)=>(<img key={i} 
                src={calculateRating(courseData) > i? assets.star:assets.star_blank} alt='rating' className='w-3.5 h-3.5'/>))}
  
              </div>
              <p className='text-gray-500'>({courseData.courseRatings.length>1? 
              courseData.courseRatings.length + ' ratings':courseData.courseRatings.length + ' rating'})</p>
              <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length>1?  
              ' students enrolled':  ' student enrolled'}</p>
            </div>
            <p className=' text-sm'>Course by  <span className='text-blue-600 underline'>{courseData.educator.username}</span></p>
     <div className='pt-8 text-gray-800'>
      <h2 className=' text-xl font-semi-bold'>Course Structure</h2>

     <div className='pt-5'>{
        courseData.courseContent.map((chapter, i)=>(
          <div key={i} className='border border-gray-300 bg-white mb-2 rounded'>
            <div className='flex items-center justify-between px-4 py-3
              cursor-pointer select-none ' onClick={()=>toggleSection(i)}>
                {/*  */}
              <div className='flex items-center gap-2'>
                <img  className={`transform transition-transform ${openSection[i]? 
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
            ${openSection[i]? 'max-h-96': 'max-h-0'}`}>
              <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600
              border-t border-gray-300'>{
                chapter.chapterContent.map((lecture, i)=>(
                  <li key={i} className='flex items-start gap-2 py-1 '>  
                    <img src={assets.play_icon} alt="play_icon" className='w-4
                    h-4 mt-1'/>
                    <div className='flex items-center justify-between w-full
                    text-gray-800 text-xs md:text-[15px] md:leading-[21px]'>
                      <p>{lecture.lectureTitle}</p>
                      <div className='flex gap-2'>{lecture.isPreviewFree && 
                        <p onClick={()=>setPlayerData({
                          videoId: lecture.lectureUrl.split('/').pop()
                        })} className='text-blue-500 cursor-pointer'>Preview</p>}
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

      </div> 
      
<div className='py-20 text-sm md:text-[15px] md:leading-[21px]'>
  <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
  <p className='pt-3 rich-text' dangerouslySetInnerHTML={{__html:courseData.courseDescription}}></p>
</div>
</div>
{/* Right column */}
<div className='max-w-[424px] z-10 shadow-[0_4px_15px_2px_rgba(0,0,0,0.1)] rounded-t 
md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
  {playerData?
<YouTube videoId={playerData.videoId} obts={ {playerVars:{
  autoPlay:1}}} iframeClassName='w-full aspect-video'/>

:<img src={courseData.courseThumbnail} alt="course thumbnail" /> }

<div className='p-5'>
  <div className='flex gap-2 items-center'>

    <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock icon" />
    <p className='text-red-500'> <span className='font-medium'>5 days</span> left at this price</p>
  </div>

  <div className='flex gap-2 items-center pt-2'>
    <p className='text-2xl md:text-4xl text-gray-800 font-semibold'>{currency}{(courseData.coursePrice - courseData.discount*courseData.coursePrice/100).toFixed(2)}</p>
    <p className='md:text-lg line-through text-gray-500'>{currency}{courseData.coursePrice}</p>
    <p className='md:text-lg text-gray-500'>{courseData.discount}% off </p>
  </div>
  <div className='flex items-center text-sm md:text-[21px] md:leading-[21px] 
  gap-4 pt-2 md:pt-4 text-gray-500'>
    <div className='flex text-[15px] items-center gap-1'>
      <img src={assets.star} alt="star icon" />
      <p>{calculateRating(courseData)}</p>
    </div>
<div className='h-4 w-px bg-gray-500/40'></div>

   <div className='flex text-[15px] items-center gap-1'>
      <img src={assets.time_clock_icon} alt="time clock icon" />
      <p>{calculateCourseDuration(courseData)}</p>
    </div>

<div className='h-4 w-px bg-gray-500/40'></div>
  
<div className='flex text-[15px] items-center gap-1'>
      <img src={assets.lesson_icon} alt="lesson icon" />
      <p>{calculateNumberOfLectures(courseData)} Lessons  </p>
    </div>

  </div>

<button className='bg-blue-600 text-white font-medium flex items-center justify-center  py-3
md:mt-6 mt-4 rounded w-full cursor-pointer' onClick={enrollCourse}>{isAlreadyEnrolled? 'Already enrolled': 'Enroll now'}
</button>
</div>
<p>What's in the course?</p>
<ul className='ml-7 pt-2 text-sm md:text-[16px] list-disc text-gray-500' >
  <li>Lifetime access with free updates.</li>
  <li>Step-by-step, hands-on project guidance.</li>
  <li>Downloadable resources and source code.</li>
  <li>Quizses to test your knowledge.</li>
  <li>Certificate of completion.</li>
</ul>
</div>
    </div>  
<Footer/>
    </>
  ):
  <Loading/>
}

export default CourseDetails
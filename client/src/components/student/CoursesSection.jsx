import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContextHelper'
import CourseCard from './CourseCard'

const CoursesSection = () => {
  const {allCourses} = useContext(AppContext)
  // console.log("x in course section and curr", x, currency)

  return (
    <div className='py-16 md: px:40 px-8'>
      <h2 className='text-3x1 md:text-[30px] text-[18px] text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3 '>
        Discover our top-rated courses across various catagories. From coding an design to <br/> 
        business and wellness,
        our courses are crated to deliver results.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4'>
        {allCourses.slice(0,4).map((course,i)=><CourseCard course = {course} key={i}/>)} 
      </div>
      <Link to={'/course-list'} onClick={scrollTo(0,0)} 
      className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded'>Show all courses</Link>
    </div>
  )
}

export default CoursesSection

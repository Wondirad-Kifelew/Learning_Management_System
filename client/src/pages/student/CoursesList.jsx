import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContextHelper'
import SearchBar from '../../components/student/SearchBar'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CoursesList = () => {
  const {navigate, allCourses} =useContext(AppContext)
  const {input} = useParams()
console.log("input params", input)
  const [filteredCourses, setFilteredCourses] = useState([])
  
  useEffect(() => {
  const tempCourses = allCourses.slice()

  input?
   setFilteredCourses(tempCourses.filter(c=>c.courseTitle.toLowerCase().includes(input.toLowerCase())))
  :setFilteredCourses(tempCourses)
}, [allCourses, input]);

console.log("allcourses", allCourses)
console.log("input", input)
console.log("filteredSearch", filteredCourses)
  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        <div className='flex flex-col md:flex-row gap-6 items-start justify-between w-full'>
          <div >
          <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
            <span onClick={()=>navigate('/')} className='text-blue-600 cursor-pointer'>
            Home</span> / <span>Course List</span></p>
          </div>

          <SearchBar data = {input}/>
        </div>
        
        {
          input && <div className='inline-flex items-center gap-4 border px-4 py-2 mt-8 -mb-8
          text-gray-600'>
           <p>{input}</p>
           <img src={assets.cross_icon} alt="cross_icon" className='cursor-pointer'
            onClick={()=>navigate('/course-list')}/>
          </div>
        }
       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2 md:px-0 md:my-16 my-10 gap-3'>
        {filteredCourses.map((course, i)=><CourseCard course = {course} key={i}/>)}
       </div>
        </div>
      
<Footer/>      
    </>
  )
}

export default CoursesList

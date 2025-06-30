import User from "../models/user.js"
import Stripe from "stripe"
import Course from "../models/Course.js"
import Purchase from "../models/Purchase.js"
import CourseProgress from "../models/CourseProgress.js"

// get all users
export const getUserData = async(req, res)=>{
try {
    const userId = req.user.id
    
    const user = await User.findById(userId).select(['-passwordHash'])
    
    if(!user){
      return  res.status(404).json({success:false, message:'user not found!'})
    }

    res.json({success:true, user})
} catch (error) {
    res.json({success:false, message:error.message})
 }
}

// user enrolled courses with lecture links
export const userEnrolledCourses = async(req, res)=>{
    try {
       const userId = req.user.id
       const userData = await User.findById(userId).select(['-passwordash']).
       populate({path:'enrolledCourses'})
       
       res.json({success:true, userEnrolledCourses:userData.enrolledCourses})
    } catch (error) {
       res.json({success:false, message:error.message})      
  }
}

// purchase course
export const purchaseCourse = async (req, res)=>{
try {
    const userId = req.user.id
    
    const {courseId} = req.body
    const {origin} = req.headers

    const userData = await User.findById(userId)
    const courseData = await Course.findById(courseId)

    if(!userData || !courseData){
        return res.json({success: false, message:'Data not found!'})
    }
    const purchaseData = {
        courseId:courseData._id,
        userId,
        amount:(courseData.coursePrice - (courseData.discount/100)
        *courseData.coursePrice).toFixed(2),
    }
    const newpurchase = await Purchase.create(purchaseData)
    
    // stripe gateway instance
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const currency = process.env.CURRENCY.toLocaleLowerCase()

    // creating line items for stripe
    const lineItems = [{
        price_data:{
        currency,
        product_data:{
            name:courseData.courseTitle
        },
        unit_amount: Math.floor(newpurchase.amount)*100
        },
        quantity:1
    }]
    const session = await stripeInstance.checkout.sessions.create({
        success_url:`${origin}/my-enrollments`,
        cancel_url: `${origin}/`,
        line_items: lineItems,
        mode: 'payment',
        metadata:{
            purchaseId:newpurchase._id.toString()
        }
    })

    res.json({success:true, session_url:session.url})
} catch (error) {
    res.json({success:false, message:error.message})
}
}

// update user Course Progress
export const updateUserCourseProgress = async (req, res)=>{
try {
  const userId = req.user.id
  const {courseId, lectureId} = req.body
  const progressData = await CourseProgress.findOne({userId, courseId})

  if(progressData){
    if(progressData.lectureCompleted.includes(lectureId)){
        res.json({success:true, message:'Lecture Already Completed'})
    }
    progressData.lectureCompleted.push(lectureId)
    await progressData.save()
  }else{
    await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted:[lectureId]
    })
  }
  res.json({success:true, message: 'Progress Updated'})

} catch (error) {
  res.json({success:false, message: error.message})
}
}
// get user course progress
export const getUserCourseprogress = async(req, res)=>{
    try {
  const userId = req.user.id
  const {courseId} = req.body
  const progressData = await CourseProgress.findOne({userId, courseId})    
  res.json({success:true, progressData})
    } catch (error) {
  res.json({success:false, message: error.message})       
    }
}
// add user rating to course

export const addUserRating = async(req, res)=>{
  const userId = req.user.id
  const {courseId, rating} = req.body

  if(!userId || !courseId || !rating || rating < 1 || rating > 5){
  return res.json({success:false, message:'Invalid Details'})
  }
  
  try {
    const course = await Course.findById(courseId)
     if(!course){
        res.json({success:false, message:'Course not found!'})
     }
     const user = await User.findById(userId)
     if(!user || !user.enrolledCourses.includes(courseId)){
        res.json({success:false, message:'User has not purchased the course'})
     }
     const existingCourseRating = course.courseRatings.some(rating=>rating.userId === userId)    
     if(existingCourseRating){
        course.courseRatings.forEach(ratingObj=>{
            if(ratingObj.userId === userId){
                ratingObj.rating = rating
            }
        })
     }else{
        course.courseRatings.push({//rating id (optionAL)
            userId, rating
        })
     }
   await course.save()
   return res.json({success:true, message: 'Rating added!'})

  } catch (error) {
   return res.json({success:false, message: error.message}) 
  }
}
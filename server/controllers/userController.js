import User from "../models/user.js"
import Stripe from "stripe"
import Course from "../models/Course.js"
import Purchase from "../models/Purchase.js"

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
        success_url:`${origin}/loading/my-enrollments`,
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
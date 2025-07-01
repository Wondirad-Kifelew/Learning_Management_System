import Course from '../models/Course.js'
import Purchase from '../models/Purchase.js'
import User from '../models/user.js'


// becomming an educator
export const becomeEducator = async(req, res)=>{
    const userId = req.user.id
    try {
    const user = await User.findById(userId)
    user.role = 'educator'    
    await user.save()

    return res.json({
        success:true, 
        message:'You have become an educator. You can now publish a course'
    })
    } catch (error) {
     return res.json({success:false, message:error.message})   
    }
}
//adding course
export const addCourse = async(req, res)=>{
try {
    const {courseData} = req.body
    // const parsedCourseData = JSON.parse(courseData) removed for test
    // console.log("parsedcourseData: ", parsedCourseData)
       
    const newCourse = await Course.create(courseData)
    const educatorId = req.user.id
    newCourse.educator = educatorId

    await newCourse.save()
 
    res.json({success:true, message: 'Course added successfully!'})
} catch (error) {
    res.json({success:false, message: error.message})
  }
}
// get educator courses
export const getEducatorCourses = async(req, res)=>{
    try {
        const educatorId = req.user.id
        const educatorCourses = await Course.find({educator: educatorId})
        // empty arr if the id is not matched...fix that
        res.status(200).json({success:true, courses:educatorCourses})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// get educator dashboard data (tot earning, enrolled students and number of courses)
export const educatorDashboardData = async(req, res)=>{
    try {
        const educatorId = req.user.id
        const courses = await Course.find({educator: educatorId})
        
        const totalCourses = courses.length()

        // calculating total earnings
        const courseIds = courses.map(course => course._id)
        const purchases = await Purchase.find({
            courseId: {$in:courseIds},
            status:'completed'
        }) 

        const totalEarnings = purchases.reduce((sum, purchase) => sum+purchase.amount, 0)

        // collect enrolled students from each educator course
        const enrolledStudentsData =[]

        for(const course of courses){
          const students = User.find({
            _id: {$in: course.enrolledStudents}
          }, 'username')//add a name in the schema and make this a name 

          students.forEach(student=>
            enrolledStudentsData.push({
                courseTitle: course.courseTitle,
                student
            })
          )
        }
     res.json({success:true, dashboardData:{
        totalEarnings, enrolledStudentsData, totalCourses 
     }})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// get enrolled students data with purchase data
export const getEnrolledStudentData = async (req, res)=>{
    try {
        const educator = req.user.id
        const courses = await Course.find({educator})

        const courseIds = courses.map(course => course._id)
        
        const purchases = await Purchase.find({
            courseId: {$in:courseIds},
            status:'completed'
        }).populate('userId', 'name').populate('courseId', 'courseTitle') 

        const enrolledStudents = purchases.map(purchase=>({
         student:purchase.userId,
         courseTitle: purchase.courseId.courseTitle,
         purchaseDate: purchase.createdAt
        }))

     res.json({success:true, enrolledStudents})

    } catch (error) {
     res.json({success:false, message:error.message})    
    }
}
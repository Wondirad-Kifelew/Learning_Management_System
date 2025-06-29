import Course from "../models/Course.js"

// get all courses
export const getAllCourses = async (req, res)=>{
    try {
        const courses = await Course.find({isPublished:true}).select
        (['-courseContent', '-enrolledStudents']).populate({path:'educator'})
         
        res.json({success:true, courses})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//  getCourse by id
export const getCourseId = async (req, res)=>{
    const {id} = req.params
    try {
        const courseData = await Course.findById(id).populate({path: 'educator'})

        // remove lectureUrl if isPreview is false
        courseData.courseContent.forEach(chapter=>{
            chapter.chapterContent.forEach(lecture=>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl=''
                }
            })
        })
        res.json({success:true, courseData})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
// export const purchaseCourse = async (req, res)=>{
// try {
    
//     const userId = req.user.id 
//     const {courseId} = req.body
//     const {origin} = req.headers

//     const userData = await User.findById(userId)
//     const courseData = await Course.findById(courseId)

//     if(!userData || !courseData){
//         return res.json({success: false, message:'Data not found!'})
//     }
//     const purchaseData = {
//         courseId:courseData._id,
//         userId,
//         amount:(courseData.coursePrice - (courseData.discount/100)
//         *courseData.coursePrice).toFixed(2),
//     }
//     const newpurchase = await Purchase.create(purchaseData)

// } catch (error) {
    
// }
// }
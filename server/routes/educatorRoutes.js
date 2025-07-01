import express from 'express'
const educatorRouter = express.Router()
import { addCourse, becomeEducator, educatorDashboardData, getEducatorCourses, getEnrolledStudentData } from '../controllers/educatorControllers.js'
import authMiddleware from '../middlewares/authMiddleware.js'
// import authMiddleware from '../middlewares/authMiddleware'

// update role here or use other method
educatorRouter.post('/update-role', becomeEducator)
educatorRouter.post('/add-course', authMiddleware.authorizeRole('educator'), addCourse)
educatorRouter.get('/courses', authMiddleware.authorizeRole('educator'), getEducatorCourses)
educatorRouter.get('/dashboard', authMiddleware.authorizeRole('educator'), educatorDashboardData)
educatorRouter.get('/enrolled-students', authMiddleware.authorizeRole('educator'), getEnrolledStudentData)

export default educatorRouter
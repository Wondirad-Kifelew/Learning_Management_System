import 'dotenv/config'
import express, { application } from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
// import { clerkWebHooks } from './controllers/webhooks.js'
import { registerHandler, loginHandler, logoutHandler, 
         forgotPasswordHandler, passwordResetHandler} 
         from './controllers/authControllers.js'
import authMiddleware from './middlewares/authMiddleware.js'  
import cookieParser from 'cookie-parser'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoute.js'
import { stripeWebhooks } from './controllers/webhooks.js'


const app = express()
app.use(cors({
  origin: 'https://lms-lilac-nine.vercel.app',//change in production 
  credentials: true 
}))
await connectDB()

app.use(express.json())
app.use(cookieParser())

app.use(authMiddleware.userExtractor)//non-blocking (a unprotected route)...available for public

//routes  
app.get('/', (_, res)=> res.json("Api is working"))//public routes
//routes: auth
app.post('/api/signup', registerHandler)
app.post('/api/login', loginHandler)
app.post('/api/forgot-password', forgotPasswordHandler)
app.post('/api/logout', authMiddleware.requireToken, logoutHandler)//blocking (a protected route)
app.post('/api/me', authMiddleware.requireToken, (req, res)=>{
  res.json({username: req.user.username})
})//blocking (a protected route)

//routes: non-auth
app.use('/api/educator', express.json(), educatorRouter) 
app.use('/api/course', express.json(), courseRouter) 
app.use('/api/user', express.json(), userRouter) 
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)
// app.use()

app.post('/api/reset-password', authMiddleware.userExtractorForPassReset,
  authMiddleware.requireToken, passwordResetHandler)

app.use(authMiddleware.errorHandler)

const port = process.env.PORT || 5000

app.listen(port, ()=>console.log(`server is running on port ${port}`))
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
// import { clerkWebHooks } from './controllers/webhooks.js'
import User from './models/user.js'

const app = express()

await connectDB()

app.use(cors())


//routes  
app.get('/', (req, res)=>res.send("API is working"))
// app.post('/clerk', express.raw({ type: '*/*' }), clerkWebHooks)
app.use(express.json())

app.post('/api/users', async (req, res)=>{
    
    const body = req.body
    console.log("body", body)
    const newUser={
     _id: body.id,
     name: body.first_name,
     email: body.email_addresses[0].email_address,
    imageUrl: body.image_Url
}
await User.create(newUser)
res.status(201).json({ message: 'User created', user: newUser });
    // console.log("req body id: ", req.body.data.id)
    
})
const port = process.env.PORT || 5000

app.listen(port, ()=>console.log(`server is running on port ${port}`))
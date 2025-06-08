import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebHooks } from './controllers/webhooks.js'

const app = express()

await connectDB()

app.use(cors())

//routes  
app.get('/', (req, res)=>res.send("API is working"))
// app.post('/clerk', express.json(), clerkWebHooks)
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebHooks);

const port = process.env.PORT || 5000

app.listen(port, ()=>console.log(`server is running on port ${port}`))
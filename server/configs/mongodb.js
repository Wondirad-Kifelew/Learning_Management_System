import mongoose from "mongoose";

console.log("bef connect line")

const connectDB = async () => {
    try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("passed connect line")
    mongoose.connection.on('connected', ()=>{
        console.log('Database connected')
    })}catch(err){
        console.log("Error connecting to DB: ", err.message)
    }
}

export default connectDB
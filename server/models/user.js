import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // _id:{type:String, required:true},
    username: {type:String, required:true, unique:true, minLength: 4},//changed from user to username
    email:{type:String, required:true},
    imageUrl: {type:String, required:false},//set to not required
    passwordHash: String,//added since were using our own auth
    enolledCourses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
}, {timestamps: true})

const User = mongoose.model('User', userSchema)


export default User
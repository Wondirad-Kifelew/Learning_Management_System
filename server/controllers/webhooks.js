import pkg from 'svix';
const { Webhook } = pkg;
import User from "../models/user.js"



//API controller function to manage clerk user with database
export const clerkWebHooks = async (req, res)=>{
try{
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    console.log("req body in webhooks.js: ", req.body)
     
    await whook.verify(req.body, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp":req.headers["svix-timestamp"],
        "svix-signature":req.headers["svix-signature"]
    })
    const {data, type} = req.body
console.log("data created from clerk:", data)
    switch (type) {
        case 'user.created':{
           const userData={
                _id: data.id,
                email: data.email_addresses[0].email_address,
                name: data.first_name+' '+ data.last_name,
                imageUrl: data.image_url, 
           }
           await User.create(userData)
           res.json({})
           break;
        }
        case 'user.updated':{
           const userData={
                email: data.email_addresses[0].email_address,
                name: data.first_name+' '+ data.last_name,
                imageUrl: data.image_url, 
           }
           await User.findByIdAndUpdate(data.id, userData)
           res.json({})
           break;
        }
        case 'user.deleted':{
           await User.findByIdAndDelete(data.id)
           res.status(200).json({})
           return
        }
        default:
            break;
    }
}catch(error){
    res.json({success:false, message:error.message })
}
}
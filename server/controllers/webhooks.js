import Stripe from "stripe"
import User from "../models/user.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks =async (request, response)=>{
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
        {
        const paymentIntent = event.data.object;
        
        const session = await stripeInstance.checkout.sessions.list({
            payment_intent:paymentIntent.id
        })

        const {purchaseId} = session.data[0].metadata

        const purchaseData = await Purchase.findById(purchaseId)
        const userData = await User.findById(purchaseData.userId)
        const courseData = await Course.findById(purchaseData.courseId.toString())
        
        userData.enrolledCourses.push(courseData._id)
        await userData.save()
        courseData.enrolledStudents.push(userData._id)//chek this they're different from the vid
        await courseData.save()

        purchaseData.status = 'completed'
        await purchaseData.save()
        
        console.log('PaymentIntent was successful!');
        break;
        }
    case 'payment_intent.payment_failed':{
        const paymentIntent = event.data.object;
        
        const session = await stripeInstance.checkout.sessions.list({
            payment_intent:paymentIntent.id
        })

        const {purchaseId} = session.data[0].metadata
        const purchaseData = await Purchase.findById(purchaseId)
        purchaseData.status = 'failed'
        await purchaseData.save()

        break;
    }
      
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a response to acknowledge receipt of the event
  response.json({received: true});

}


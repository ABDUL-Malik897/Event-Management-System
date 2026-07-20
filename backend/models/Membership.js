import mongoose from "mongoose"

const membershipSchema = new mongoose.Schema(
    {
        organizer : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
            unique : true
        },
        plan : {
            type : String,
            enum : ["Monthly","Yearly"],
            required : true
        },
        amount : {
            type : Number,
            required : true
        },
        paymentStatus : {
            type : String,
            enum : ["Pending","Paid"],
            default : "Pending"
        },
        // razorpayPaymentId : {
        //     type : String,
        //     default : ""
        // },
        startDate : {
            type : Date,
            default : null
        },
        expiryDate : {
            type : Date,
            default : null
        }
    },
    {
        timestamps : true 
    }
)

const Membership = mongoose.model("Membership", membershipSchema)

export default Membership

import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        qrCode : {
            type : String,
            default : ""
        },
        checkedIn : {
            type : Boolean,
            default : false
        },
        seatNumber : {
            type : String,
            default : ""
        },
    },{
        _id : false
    }
)

const bookingSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        event : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Event",
            required : true
        },
        tickets : {
            type : [ticketSchema],
            required : true,
        },
        totalAmount : {
            type : Number,
            required : true
        },
        bookingStatus : {
            type : String,
            enum : ["Booked" , "Cancelled"],
            default : "Booked"
        },
        paymentStatus : {
            type : String,
            enum : ["Pending" , "Paid" , "Failed"],
            default : "Pending"
        },
    },
    {
        timestamps : true
    }
)

const Booking = mongoose.model("Booking" ,bookingSchema)

export default Booking;
import mongoose from "mongoose";

const organizerReqSchema = new mongoose.Schema(
    {
        user: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
            unique : true
        },
        businessName : {
            type : String,
            required : true,
            trim : true
        },
        organizationName : {
            type : String,
            required : true,
            trim : true
        },
        Phone : {
            type : Number,
            default : ""
        },
        address : {
            type : String,
            required : true,
            trim : true
        },
        governmentId : {
            type : String,
            required : true,
            trim : true
        },
        reason : {
            type : String,
            required : true,
            trim : true
        },
        status : {
            type : String,
            enum : ["Pending", "Approved", "Rejected"],
            default : "Pending"
        },
        adminRemark : {
            type : String,
            default : ""
        }
    },
    {
        timestamps : true
    }
)

const OrganizerReq = mongoose.model("OrganizerReq", organizerReqSchema)

export default OrganizerReq
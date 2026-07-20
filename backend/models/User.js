import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : [true, "Username is required"],
            trim : true,
            minLength : 3,
            maxLength : 30
        },
        email : {
            type : String,
            required : [true, "Email is required"],
            unique : true,
            lowercase : true,
            trim : true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password : {
            type : String,
            required : [true, "Password is required"],
            minLength : 6,
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },

        isPhoneVerified: {
            type: Boolean,
            default: false
        },

        otp: {
            type: String,
            default: null
        },

        otpExpiry: {
            type: Date,
            default: null
        },

        otpPurpose: {
            type: String,
            enum: [
                "signup",
                "login",
                "forgot-password",
                "reset-password",
                null
            ],
            default: null
        },
        otpLastSentAt: {
            type: Date,
            default: null
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        role : {
            type : String,
            enum : ["user","organizer","admin"],
            default : "user"
        },
        organizerStatus : {
            type : String,
            enum : ["none" ,'pending' , "approved","rejected"],
            default : "none" 
        },
        membershipStatus : {
            type : String,
            enum : ["inactive", "active"],
            default : "inactive"
        },
        membershipExpiry : {
            type : Date,
            default : null
        },
        profilePic : {
            type : String,
            default : ""
        }       
    },
    {
        timestamps : true
    }
)

const User = mongoose.model("User", userSchema)

export default User
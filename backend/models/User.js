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
        password : {
            type : String,
            required : [true, "Password is required"],
            minLength : 6,
        },
        role : {
            type : String,
            enum : ["user", "organizer","admin"],
            default : "user"
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
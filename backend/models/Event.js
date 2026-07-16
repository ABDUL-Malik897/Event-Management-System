import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : [true , "Event title is required"],
            trim : true
        },
        description : {
            type : String,
            required : [true, "Description is required"]
        },
        category : {
            type : String,
            enum : ["Music", "Sports", "Workshop", "Conference", "Festival", "College", "Other"],
            default : "Other"
        },
        date : {
            type : Date,
            required : true
        },
        time : {
            type : String,
            required : true
        },
        venue : {
            type : String,
            required : true 
        },
        city : {
            type : String,
            required : true 
        },
        banner : {
            type : String,
            default : ""
        },
        ticketPrice : {
            type : String,
            required : true,
            min : 0
        },
        totalSeats : {
            type : Number,
            required : true,
            min : 1
        },
        availableSeats : {
            type : Number,
            required : true
        },
        organizer : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    },
    {
        timestamps : true
    }
)

const Event = mongoose.model("Event", eventSchema)

export default Event
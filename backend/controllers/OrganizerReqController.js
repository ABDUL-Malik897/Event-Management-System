import OrganizerReq from '../models/OrganizerReq.js'
import User from '../models/User.js'

export const applyOrganizer = async (req ,res) => {
    try {
        const { businessName,organizationName,phone,address,governmentId,reason } = req.body
        if (!businessName || !organizationName || !phone || !address || !governmentId || !reason) {
            return res.status(400).json({
                success : false,
                message : "Please fill all fields"
            })
        }

        const existing = await OrganizerReq.findOne({
            user : req.user._id
        })
        if (existing) {
            return res.status(400).json({
                success : false,
                message : "You have already submiited an application"
            })
        }

        const request = await OrganizerReq.create({
            user : req.user._id,businessName,organizationName,phone,address,governmentId,reason
        })
        await User.findByIdAndUpdate(req.user._id, {
            organizerStatus: "pending",
        });
        res.status(201).json({
            success : true,
            message : "Organizer application submitted successfully",
            request
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const getMyApplication = async (req ,res) => {
    try {
        const request = await OrganizerReq.findOne({ user : req.user._id })
        if (!request) {
            return res.status(404).json({
                success : false,
                message : "No organizer application found."
            })
        }
        res.status(200).json({
            success : true,
            request
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const getPendingReq = async (req ,res) => {
    try {
        const requests = await OrganizerReq.find({ status  : "Pending"}).populate("user" , "username email")
        
        res.status(200).json({
            success : true,
            count : requests.length,
            requests
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    } 
};

export const approveOrganizer = async (req ,res) => { 
    try {
        const request = await OrganizerReq.findById(req.params.id)
        if (!request) {
            return res.status(404).json({
                success : false,
                message : "Application Not Found."
            })
        }
        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "This application has already been processed."
            });
        }
        request.status = "Approved";
        await request.save();
        await User.findByIdAndUpdate(request.user, {
            role: "organizer",
            organizerStatus: "approved"
        });
        res.status(200).json({
            success: true,
            message: "Organizer approved successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const rejectOrganizer = async (req ,res) => { 
    try {
        const { adminRemark = "" } = req.body || {}
        const request = await OrganizerReq.findById(req.params.id)
        if (!request) {
            return res.status(404).json({
                success : false,
                message : "Application Not Found."
            })
        }
        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "This application has already been processed."
            });
        }
        request.status = "Rejected";
        request.adminRemark = adminRemark || ""
        await request.save();
        await User.findByIdAndUpdate(request.user, {
            organizerStatus: "rejected"
        });
        res.status(200).json({
            success: true,
            message: "Application rejected successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};
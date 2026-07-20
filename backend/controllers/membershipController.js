import Membership from '../models/Membership.js';
import User from "../models/User.js"

export const createMembership = async (req ,res) => {
    try {
        const { plan } = req.body
        if (!plan) {
            return res.status(400).json({
                success : false,
                message : "Please select a membership plan."
            })
        }
        if (req.user.role !== "organizer" || req.user.organizerStatus !== "approved") {
            return res.status(403).json({
                success : false,
                message : "You are not an approved organizer"
            })
        }

        const existing = await Membership.findOne({
            organizer : req.user._id,
            paymentStatus : "Paid"
        })
        if (existing && existing.expiryDate > new Date()) {
            return res.status(400).json({
                success : false,
                message : "Membership is already active"
            })
        }

        let amount = 0
        let expiryDate = new Date()
        if (plan === "Monthly") {
            amount = 299
            expiryDate.setDate(expiryDate.getDate() +30)
        } else if (plan === "Yearly") {
            amount = 1999
            expiryDate.setFullYear(expiryDate.getFullYear() + 1)
        } else {
            return res.status(400).json({
                success : false,
                message : "Invalid membership plan."
            })
        }

        const membership = await Membership.create({
            organizer: req.user._id,
            plan,
            amount,
            paymentStatus: "Paid",
            startDate: new Date(),
            expiryDate
        });

        await User.findByIdAndUpdate(req.user._id, {
            membershipStatus: "active",
            membershipExpiry: expiryDate
        });

        res.status(201).json({
            success: true,
            message: "Membership activated successfully.",
            membership
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getMembership = async (req, res) => {
    try {
        const membership = await Membership.findOne({
            organizer: req.user._id
        });
        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "No membership found."
            });
        }
        res.status(200).json({
            success: true,
            membership
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
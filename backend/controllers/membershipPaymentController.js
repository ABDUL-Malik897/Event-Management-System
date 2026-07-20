import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import User from "../models/User.js";
import MembershipPayment from "../models/MembershipPayment.js";
import Event from "../models/Event.js";


const membershipPlans = {
    Monthly: {
        amount: 2999,
        duration: 30
    },
    Yearly: {
        amount: 19990,
        duration: 365
    }
};

export const createMembershipOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Please select a membership plan"
            });
        }

        const selectedPlan =  membershipPlans[plan];
        if (!selectedPlan) {
            return res.status(400).json({
                success: false,
                message: "Invalid membership plan"
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message: "Only organizers can purchase membership"
            });
        }

        const amount = selectedPlan.amount * 100;

        const options = {
            amount,
            currency: "INR",
            receipt: `membership_${Date.now()}`,
            notes: {
                userId:
                    req.user._id.toString(),
                plan,
                duration: selectedPlan.duration.toString()
            }
        };

        const order =  await razorpay.orders.create(options);

        await MembershipPayment.create({
            user: req.user._id,
            razorpayOrderId: order.id,
            plan,
            amount: selectedPlan.amount,
            duration: selectedPlan.duration,
            paymentStatus: "Created"
        });

        return res.status(200).json({
            success: true,
            message: "Membership payment order created",
            order,
            key: process.env.RAZORPAY_KEY_ID,
            plan: {
                name: plan,
                amount: selectedPlan.amount,
                duration: selectedPlan.duration
            }
        });
    } catch (error) {
        console.log("Create Membership Order Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create membership payment order"
        });
    }
};

export const verifyMembershipPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;


        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature 
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification details"
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message: "Only organizers can activate membership"
            });
        }

        const paymentRecord =  await MembershipPayment.findOne({
                razorpayOrderId: razorpay_order_id,
                user: req.user._id
            });
        if (!paymentRecord) {
            return res.status(404).json({
                success: false,
                message: "Membership payment order not found"
            });
        }

        if (paymentRecord.paymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "This payment has already been processed"
            });
        }
        const plan = paymentRecord.plan;
        const selectedPlan = {
            amount: paymentRecord.amount,
            duration: paymentRecord.duration
        };

        const body = razorpay_order_id +"|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const now = new Date();
        let membershipStartDate = now;

        if (
            user.membershipStatus ===
                "active" &&
            user.membershipExpiry &&
            new Date(
                user.membershipExpiry
            ) > now
        ) {
            membershipStartDate = new Date(user.membershipExpiry);
        }
        const membershipExpiry = new Date(membershipStartDate);
        membershipExpiry.setDate(
            membershipExpiry.getDate() +
            selectedPlan.duration
        );
        user.membershipStatus = "active";
        user.membershipExpiry = membershipExpiry;
        await user.save();
        paymentRecord.razorpayPaymentId = razorpay_payment_id;
        paymentRecord.paymentStatus = "Paid";
        paymentRecord.membershipStartDate = membershipStartDate;
        paymentRecord.membershipExpiryDate = membershipExpiry;
        paymentRecord.paidAt = new Date();

        await paymentRecord.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified and membership activated successfully",
            membership: {
                status:user.membershipStatus,
                plan,
                expiryDate: user.membershipExpiry,
                duration: selectedPlan.duration
            },
            payment: {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                amount: selectedPlan.amount
            }
        });
    } catch (error) {
        console.log("Verify Membership Payment Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to verify payment and activate membership"
        });
    }
};

export const getMembershipPaymentHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        if (req.user.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message:
                    "Only organizers can view membership payment history"
            });
        }

        const payments = await MembershipPayment.find({user: req.user._id}).sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        console.log("Membership Payment History Error:",error);
        return res.status(500).json({
            success: false,
            message: "Unable to load membership payment history"
        });
    }
};

export const getCurrentMembership = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message:
                    "Only organizers can access membership details"
            });
        }

        const user = await User.findById(
            req.user._id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (
            user.membershipStatus === "active" &&
            user.membershipExpiry &&
            new Date(user.membershipExpiry) <=
                new Date()
        ) {
            user.membershipStatus =
                "inactive";
            await user.save();
        }

        if (
            user.membershipStatus !== "active" ||
            !user.membershipExpiry
        ) {

            return res.status(200).json({
                success: true,
                hasMembership: false,
                membership: null,
                events: []
            });
        }

        const payment = await MembershipPayment.findOne({user: req.user._id, paymentStatus: "Paid"}).sort({ paidAt: -1 });
        let events = [];
        if (payment?.membershipStartDate) {
            events = await Event.find({
                organizer: req.user._id,
                createdAt: {
                    $gte: payment.membershipStartDate,
                    $lte: user.membershipExpiry
                }
            })
            .select("title date venue city banner createdAt")
            .sort({createdAt: -1});
        }

        const now = new Date();

        const expiry = new Date(user.membershipExpiry);
        const millisecondsLeft = expiry.getTime() - now.getTime();
        const daysLeft = Math.max( 0,Math.ceil(millisecondsLeft /(1000 * 60 * 60 * 24)));
        return res.status(200).json({
            success: true,
            hasMembership: true,
            membership: {
                status: user.membershipStatus,
                plan: payment?.plan || null,
                amount: payment?.amount || null,
                startDate: payment?.membershipStartDate || null,
                expiryDate: user.membershipExpiry,
                daysLeft,
                paymentId: payment?.razorpayPaymentId || null
            },
            events
        });
    } catch (error) {
        console.log("Get Current Membership Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load membership details"
        });
    }
};
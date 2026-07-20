import User from "../models/User.js";

const checkMembership = async (req, res, next) => {

    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
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

        if (user.role !== "organizer") {
            return res.status(403).json({
                success: false,
                message: "Only organizers can access this feature"
            });
        }

        if (
            user.membershipStatus !== "active" ||
            !user.membershipExpiry
        ) {
            return res.status(403).json({
                success: false,
                membershipExpired: true,
                message:
                    "Active membership is required. Please purchase a membership."
            });
        }
        const now = new Date();
        const expiryDate = new Date(user.membershipExpiry);
        if (expiryDate <= now) {
            user.membershipStatus = "inactive";
            await user.save();
            return res.status(403).json({
                success: false,
                membershipExpired: true,
                message: "Your membership has expired. Please renew your membership."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Check Membership Error:", error);
        return res.status(500).json({
            success: false,
            message:"Unable to verify membership"
        });
    }
};


export default checkMembership;
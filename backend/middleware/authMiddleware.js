import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req ,res ,next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1]
        }
        if (!token) {
            return res.status(401).json({
                success : false,
                message : "Not Authorized. No Token"
            })
        }

        const decode = jwt.verify(token, process.env.SECRET)
        req.user = await User.findById(decode.id).select("-password")
        if (!req.user) {
            return res.status(401).json({
                success : false,
                message : "User not found"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success : false,
            message : "Invalid Token"
        })
    }
};

export default protect
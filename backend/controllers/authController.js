import User from "../models/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import genToken from "../utils/Token.js";
import { json } from "express";

export const signup = async (req ,res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success : false,
                message : "Please fill all fields"
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success : false,
                message : "Invalid Email",
            })
        }

        const exists = await User.findOne({ email })
        if (exists) {
            return res.status(400).json({
                success : false,
                message : "Email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)

        const user = await User.create({
            username , email , password : hashed
        })
        const token =  genToken(user._id)

        res.status(201).json({
            success : true,
            message : "Account Created Successfully",
            token,
            user : {
                _id : user._id,
                username : user.username,
                email : user.email,
                role : user.role,
                profilePic : user.profilePic
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const login = async (req ,res) => {
    try {

        const { email , password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success : false,
                message : "Please fill all fields"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }

        const isMatch = await bcrypt.compare(password , user.password)
        if (!isMatch) {
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }

        const token = genToken(user._id)
        res.status(200).json({
            success : true,
            message : "Login Successfully",
            token,
            user : {
                _id : user._id,
                username : user.username,
                email : user.email,
                role : user.role,
                profilePic : user.profilePic,
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const getMe = async (req ,res) => {
    try {
        res.status(200).json({
            success : true,
            user : req.user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message :"Server Error"
        })
    }
}
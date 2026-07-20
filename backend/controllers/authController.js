import User from "../models/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import genToken from "../utils/Token.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {

    try {
        const { username, email, phone, password, confirmPassword } = req.body;
        if (!username || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const existingEmail = await User.findOne({email: email.toLowerCase()})
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const existingPhone = await User.findOne({phone});
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is already registered"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            isEmailVerified: false,
            isPhoneVerified: false,
            otp,
            otpExpiry,
            otpPurpose: "signup",
            otpLastSentAt : new Date()
        });

        try {
            await sendEmail(
                email,
                "Verify Your EventHub Account",
                `
                    <h2>EventHub Email Verification</h2>
                    <p>Your OTP is:</p>
                    <h1>${otp}</h1>
                    <p>
                        This OTP expires in 5 minutes.
                    </p>
                `
            );
        } catch (emailError) {
            console.log("OTP Email Error:", emailError);

            await User.findByIdAndDelete(user._id);
            return res.status(500).json({
                success: false,
                message: "Unable to send OTP. Please try signing up again."
            });
        }

        return res.status(201).json({
            success: true,
            message: "OTP sent to your email. Please verify your account.",
            email: user.email
        });
    } catch (error) {
        console.log("Signup Error:",error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating your account"
        });
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
                organizerStatus: user.organizerStatus,
                membershipStatus: user.membershipStatus,
                membershipExpiry: user.membershipExpiry
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
};

export const verifySignupOTP = async (req, res) => {

    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({email: email.toLowerCase()});
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "Account is already verified"
            });
        }

        if (user.otp !== otp.toString()) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP."
            });
        }

        if (user.otpPurpose && user.otpPurpose !== "signup") {
            return res.status(400).json({
                message: "Invalid OTP request"
            });
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        user.otpPurpose = null;

        await user.save();

        const token = genToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Account verified successfully",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                organizerStatus:
                    user.organizerStatus,
                membershipStatus:
                    user.membershipStatus,
                membershipExpiry:
                    user.membershipExpiry,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        console.log("Verify Signup OTP Error:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const resendSignupOTP = async (req, res) => {

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({email: email.toLowerCase()});

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "Account is already verified"
            });
        }
        if (user.otpLastSentAt) {
            const timeDifference = Date.now() - new Date(user.otpLastSentAt).getTime();
            const sixtySeconds = 60 * 1000;
            if (timeDifference < sixtySeconds) {
                const remainingSeconds = Math.ceil((sixtySeconds - timeDifference) / 1000);
                return res.status(429).json({
                    message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
                    remainingSeconds
                });
            }
        }
        const otp = Math.floor(100000 +  Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry =  new Date(Date.now() +   10 * 60 * 1000);
        user.otpPurpose = "signup";
        user.otpLastSentAt = new Date();

        await user.save();
        await sendEmail(
            user.email,
            "EventHub - New Verification OTP",
            `
                <div
                    style="
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    "
                >
                    <h2>
                        EventHub Email Verification
                    </h2>
                    <p>
                        Hello ${user.username},
                    </p>
                    <p>
                        Your new OTP is:
                    </p>
                    <h1
                        style="
                            color: #6c5ce7;
                            letter-spacing: 5px;
                        "
                    >
                        ${otp}
                    </h1>
                    <p>
                        This OTP will expire
                        in 10 minutes.
                    </p>
                    <p>
                        If you did not request
                        this OTP, please ignore
                        this email.
                    </p>
                </div>
            `
        );

        return res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email."
        })
    } catch (error) {
        console.log("Resend Signup OTP Error:", error);
        return res.status(500).json({
            message: "Unable to resend OTP"
        });
    }
};

export const sendLoginOTP = async (req, res) => {

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({email: email.toLowerCase()});
        if (!user) {
            return res.status(404).json({
                message: "No account found with this email"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your account before logging in"
            });
        }

        if (user.otpLastSentAt) {
            const difference = Date.now() - new Date(user.otpLastSentAt).getTime();
            const cooldown = 60 * 1000;
            if (difference < cooldown) {
                const remainingSeconds = Math.ceil((cooldown - difference) / 1000);
                return res.status(429).json({
                    message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
                    remainingSeconds
                });
            }
        }
        const otp =Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otpPurpose = "login";
        user.otpLastSentAt = new Date();

        await user.save();

        await sendEmail(
            user.email,
            "EventHub Login OTP",
            `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>
                        EventHub Login Verification
                    </h2>
                    <p>
                        Hello ${user.username},
                    </p>
                    <p>
                        Your login OTP is:
                    </p>
                    <h1
                        style="
                            color: #6c5ce7;
                            letter-spacing: 5px;
                        "
                    >
                        ${otp}
                    </h1>
                    <p>
                        This OTP is valid for
                        10 minutes.
                    </p>
                    <p>
                        If you did not try to
                        log in to EventHub,
                        please ignore this email.
                    </p>
                </div>
            `
        );
        return res.status(200).json({
            success: true,
            message: "Login OTP sent successfully"
        });
    } catch (error) {
        console.log("Send Login OTP Error:", error);
        return res.status(500).json({
            message: "Unable to send login OTP"
        });
    }
};

export const verifyLoginOTP = async (req, res) => {

    try {
        const { email,otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message:
                    "Email and OTP are required"
            });
        }

        const user = await User.findOne({email:email.toLowerCase()});
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user.otpPurpose !== "login") {
            return res.status(400).json({
                message: "Invalid OTP request"
            });
        }

        if (user.otp !== otp.toString()) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP."
            });
        }
        user.otp = null;
        user.otpExpiry = null;
        user.otpPurpose = null;

        await user.save();

        const token =  genToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                organizerStatus: user.organizerStatus,
                membershipStatus: user.membershipStatus,
                membershipExpiry: user.membershipExpiry
            },
            token
        })
    } catch (error) {
        console.log("Verify Login OTP Error:", error);
        return res.status(500).json({
            message: "Unable to verify login OTP"
        });
    }
};

export const sendForgotPasswordOTP = async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your account first"
            });
        }

        if (user.otpLastSentAt) {
            const difference = Date.now() - new Date(user.otpLastSentAt).getTime();
            const cooldown = 60 * 1000;
            if (difference < cooldown) {
                const remainingSeconds = Math.ceil((cooldown - difference) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
                    remainingSeconds
                });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otpPurpose = "forgot-password";
        user.otpLastSentAt = new Date();

        await user.save();
        await sendEmail(
            user.email,
            "EventHub Password Reset OTP",
            `
                <div
                    style="
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    "
                >
                    <h2>
                        EventHub Password Reset
                    </h2>
                    <p>
                        Hello ${user.username},
                    </p>
                    <p>
                        We received a request to reset
                        your EventHub account password.
                    </p>
                    <p>
                        Your password reset OTP is:
                    </p>
                    <h1
                        style="
                            color: #6c5ce7;
                            letter-spacing: 5px;
                        "
                    >
                        ${otp}
                    </h1>
                    <p>
                        This OTP is valid for
                        10 minutes.
                    </p>
                    <p>
                        If you did not request a
                        password reset, please ignore
                        this email.
                    </p>
                    <p>
                        Never share this OTP
                        with anyone.
                    </p>
                </div>
            `
        )

        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully",
            email: user.email
        });
    } catch (error) {
        console.log("Send Forgot Password OTP Error:",error);
        return res.status(500).json({
            success: false,
            message: "Unable to send password reset OTP"
        })
    }
};

export const verifyForgotPasswordOTP = async (req, res) => {

    try {
        const {email, otp} = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.otpPurpose !== "forgot-password") {
            return res.status(400).json({
                success: false,
                message: "Invalid password reset request"
            });
        }
        if (user.otp !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP."
            });
        }
        user.otp = null;
        user.otpPurpose = "reset-password";
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password."
        })
    } catch (error) {
        console.log("Verify Forgot Password OTP Error:", error);
        return res.status(500).json({
            success: false,
            message:  "Unable to verify password reset OTP"
        });
    }
};

export const resetPassword = async (req, res) => {

    try {
        const {email, newPassword, confirmPassword} = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.otpPurpose !== "reset-password") {
            return res.status(403).json({
                success: false,
                message: "Please verify OTP before resetting password"
            })
        }
        if (!user.otpExpiry || user.otpExpiry < new Date()) {

            user.otp = null;
            user.otpExpiry = null;
            user.otpPurpose = null;
            await user.save();
            return res.status(400).json({
                success: false,
                message: "Password reset session has expired. Please request a new OTP."
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        user.otpPurpose = null;
        user.otpLastSentAt = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login with your new password."
        });
    } catch (error) {
        console.log("Reset Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to reset password"
        });
    }
};

export const uploadProfilePic = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a profile picture"
            });
        }

        const uploadResult =
            await new Promise(
                (resolve, reject) => {
                    const uploadStream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder:
                                    "eventhub/profile-pictures",
                                resource_type:
                                    "image",
                                transformation: [
                                    {
                                        width: 500,
                                        height: 500,
                                        crop: "fill",
                                        gravity: "face"
                                    }
                                ]
                            },
                            (
                                error,
                                result
                            ) => {
                                if (error) {
                                    reject(
                                        error
                                    );
                                } else {
                                    resolve(
                                        result
                                    );
                                }
                            }
                        );
                    uploadStream.end(
                        req.file.buffer
                    );
                }
            );
        const user =
            await User.findByIdAndUpdate(
                req.user._id,
                {
                    profilePic:
                        uploadResult.secure_url
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select(
                "-password"
            );
        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profilePic: user.profilePic,
            user
        });
    } catch (error) {
        console.error(
            "Profile Picture Upload Error:",
            error
        );
        return res.status(500).json({
            success: false,
            message:
                "Unable to upload profile picture"
        });
    }
};

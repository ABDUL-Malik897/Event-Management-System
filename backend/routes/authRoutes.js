import express from "express"
import { getMe, login, resendSignupOTP, resetPassword, sendForgotPasswordOTP, sendLoginOTP, signup, verifyForgotPasswordOTP, verifyLoginOTP, verifySignupOTP } from "../controllers/authController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/me", protect , getMe)
router.post("/verify-signup-otp", verifySignupOTP)
router.post("/resend-signup-otp", resendSignupOTP)
router.post("/send-login-otp", sendLoginOTP);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/forgot-password/send-otp",sendForgotPasswordOTP);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOTP);
router.post("/forgot-password/reset", resetPassword);

export default router;
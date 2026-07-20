import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import "./ForgetPassword.css";

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        const trimmedEmail = email.trim();


        if (!trimmedEmail) {

            toast.error(
                "Please enter your email address"
            );

            return;

        }


        if (loading) {
            return;
        }


        try {

            setLoading(true);


            const response = await API.post(
                "/auth/forgot-password/send-otp",
                {
                    email: trimmedEmail
                }
            );


            // Save email temporarily
            // for OTP verification

            sessionStorage.setItem(
                "forgotPasswordEmail",
                trimmedEmail
            );


            toast.success(
                response.data.message ||
                "Password reset OTP sent successfully"
            );


            // Go to OTP verification page

            navigate(
                "/forgot-password/verify-otp"
            );


        } catch (error) {

            console.error(
                "Forgot Password Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to send password reset OTP"
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="forgot-password-page">


            <div className="forgot-password-card">


                {/* ICON */}

                <div className="forgot-password-icon">

                    🔐

                </div>


                {/* HEADER */}

                <div className="forgot-password-header">

                    <span className="forgot-password-badge">

                        ACCOUNT RECOVERY

                    </span>


                    <h1>

                        Forgot Password?

                    </h1>


                    <p>

                        No worries! Enter the email
                        address associated with your
                        EventHub account and we'll send
                        you an OTP to reset your password.

                    </p>

                </div>


                {/* FORM */}

                <form
                    className="forgot-password-form"
                    onSubmit={handleSubmit}
                >


                    <div className="forgot-password-input-group">

                        <label htmlFor="forgot-password-email">

                            Email Address

                        </label>


                        <input

                            id="forgot-password-email"

                            type="email"

                            placeholder="Enter your registered email"

                            value={email}

                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }

                            autoComplete="email"

                            disabled={loading}

                            required

                        />

                    </div>


                    <button

                        type="submit"

                        className="forgot-password-submit-btn"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Sending OTP..."

                                : "Send Reset OTP"

                        }

                    </button>


                </form>


                {/* SECURITY MESSAGE */}

                <div className="forgot-password-security">

                    <span>
                        🛡️
                    </span>

                    <p>

                        For your security, the OTP
                        will expire after 10 minutes.

                    </p>

                </div>


                {/* BACK TO LOGIN */}

                <Link
                    to="/login"
                    className="forgot-password-back"
                >

                    ← Back to Login

                </Link>


            </div>


        </div>

    );

};


export default ForgotPassword;
import React, {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/api";

import "./ResetPassword.css";


const ResetPassword = () => {

    const navigate = useNavigate();


    const [formData, setFormData] =
        useState({

            newPassword: "",

            confirmPassword: ""

        });


    const [loading, setLoading] =
        useState(false);


    const [showPassword, setShowPassword] =
        useState(false);


    const email =
        sessionStorage.getItem(
            "forgotPasswordEmail"
        );


    // =====================================
    // CHECK RESET SESSION
    // =====================================

    useEffect(() => {

        if (!email) {

            toast.error(
                "Password reset session not found. Please try again."
            );


            navigate(
                "/forgot-password",
                {
                    replace: true
                }
            );

        }

    }, [email, navigate]);


    // =====================================
    // HANDLE INPUT
    // =====================================

    const handleChange = (e) => {

        setFormData(
            (prev) => ({

                ...prev,

                [e.target.name]:
                    e.target.value

            })
        );

    };


    // =====================================
    // RESET PASSWORD
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }


        if (!email) {

            toast.error(
                "Password reset session not found."
            );

            navigate(
                "/forgot-password",
                {
                    replace: true
                }
            );

            return;

        }


        if (
            !formData.newPassword ||
            !formData.confirmPassword
        ) {

            toast.error(
                "Please enter and confirm your new password"
            );

            return;

        }


        if (
            formData.newPassword.length < 6
        ) {

            toast.error(
                "Password must be at least 6 characters"
            );

            return;

        }


        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            toast.error(
                "New password and confirm password do not match"
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await API.post(

                    "/auth/forgot-password/reset",

                    {

                        email,

                        newPassword:
                            formData.newPassword,

                        confirmPassword:
                            formData.confirmPassword

                    }

                );


            toast.success(
                response.data.message || "Password reset successfully"
            );


            // Reset process is complete.
            // Remove temporary email.

            sessionStorage.removeItem(
                "forgotPasswordEmail"
            );


            // Redirect to login

            navigate(
                "/login",
                {
                    replace: true
                }
            );


        } catch (error) {

            console.error(
                "Reset Password Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to reset password"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="reset-password-page">


            <div className="reset-password-card">


                {/* ICON */}

                <div className="reset-password-icon">

                    🔒

                </div>


                {/* HEADER */}

                <div className="reset-password-header">


                    <span className="reset-password-badge">

                        SECURE YOUR ACCOUNT

                    </span>


                    <h1>

                        Create New Password

                    </h1>


                    <p>

                        Your OTP has been verified.
                        Create a new password for your
                        EventHub account.

                    </p>


                    <strong className="reset-password-email">

                        {email}

                    </strong>


                </div>


                {/* FORM */}

                <form

                    className="reset-password-form"

                    onSubmit={handleSubmit}

                >


                    {/* NEW PASSWORD */}

                    <div className="reset-password-input-group">


                        <label>

                            New Password

                        </label>


                        <input

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            name="newPassword"

                            placeholder=
                                "Enter your new password"

                            value={
                                formData.newPassword
                            }

                            onChange={
                                handleChange
                            }

                            minLength="6"

                            required

                        />


                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="reset-password-input-group">


                        <label>

                            Confirm New Password

                        </label>


                        <input

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            name="confirmPassword"

                            placeholder=
                                "Confirm your new password"

                            value={
                                formData.confirmPassword
                            }

                            onChange={
                                handleChange
                            }

                            minLength="6"

                            required

                        />


                    </div>


                    {/* SHOW PASSWORD */}

                    <label className="reset-password-show">


                        <input

                            type="checkbox"

                            checked={
                                showPassword
                            }

                            onChange={(e) =>

                                setShowPassword(
                                    e.target.checked
                                )

                            }

                        />


                        <span>

                            Show passwords

                        </span>


                    </label>


                    {/* PASSWORD INFO */}

                    <div className="reset-password-requirement">


                        <span>

                            💡

                        </span>


                        <p>

                            Your password must contain
                            at least 6 characters.

                        </p>


                    </div>


                    {/* SUBMIT */}

                    <button

                        type="submit"

                        className="reset-password-submit-btn"

                        disabled={loading}

                    >


                        {

                            loading

                                ? "Resetting Password..."

                                : "Reset Password"

                        }


                    </button>


                </form>


                {/* SECURITY */}

                <div className="reset-password-security">


                    <span>

                        🛡️

                    </span>


                    <p>

                        After resetting your password,
                        use your new password the next
                        time you log in.

                    </p>


                </div>


                <Link

                    to="/login"

                    className="reset-password-back"

                >

                    ← Back to Login

                </Link>


            </div>


        </div>

    );

};


export default ResetPassword;
import React, {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api/api";

import useAuthContext
    from "../hooks/useAuthContext";

import "./Login.css";


const Login = () => {

    const navigate =
        useNavigate();

    const { dispatch } =
        useAuthContext();


    const [loginMode, setLoginMode] =
        useState("password");


    const [formData, setFormData] =
        useState({

            email: "",

            password: ""

        });


    const [loading, setLoading] =
        useState(false);


    const handleChange = (e) => {

        setFormData(
            (prev) => ({

                ...prev,

                [e.target.name]:
                    e.target.value

            })
        );

    };


    // ============================
    // PASSWORD LOGIN
    // ============================

    const handlePasswordLogin = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        const email = formData.email.trim();

        if (!email || !formData.password) {

            toast.error(
                "Please enter your email and password"
            );

            return;

        }

        try {

            setLoading(true);

            const response = await API.post(
                "/auth/login",
                {
                    email,
                    password: formData.password
                }
            );

            const authData = {
                ...response.data.user,
                token: response.data.token
            };

            localStorage.setItem(
                "user",
                JSON.stringify(authData)
            );

            dispatch({
                type: "LOGIN",
                payload: authData
            });

            toast.success(
                response.data.message ||
                "Logged in successfully"
            );

            navigate(
                "/",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================
    // SEND LOGIN OTP
    // ============================

    const handleOTPLogin = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        const email = formData.email.trim();

        if (!email) {

            toast.error(
                "Please enter your email"
            );

            return;

        }

        try {

            setLoading(true);

            const response = await API.post(
                "/auth/send-login-otp",
                {
                    email
                }
            );

            sessionStorage.setItem(
                "LoginEmail",
                email
            );

            toast.success(
                response.data.message ||
                "Login OTP sent successfully"
            );

            navigate(
                "/verify-login-otp",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                "Send Login OTP Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to send login OTP"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">


            {/* LEFT SIDE */}

            <div className="login-hero">

                <div className="login-hero-content">

                    <Link
                        to="/"
                        className="login-logo"
                    >
                        EventHub
                    </Link>


                    <div className="login-hero-text">

                        <span className="login-tag">

                            DISCOVER • BOOK • EXPERIENCE

                        </span>


                        <h1>

                            Your next great
                            experience is waiting.

                        </h1>


                        <p>

                            Discover exciting events,
                            book your tickets securely
                            and access your digital QR
                            tickets — all in one place.

                        </p>


                        <div className="login-features">

                            <div>
                                <span>🎟️</span>
                                <p>
                                    Easy Event Booking
                                </p>
                            </div>


                            <div>
                                <span>🔒</span>
                                <p>
                                    Secure Payments
                                </p>
                            </div>


                            <div>
                                <span>📱</span>
                                <p>
                                    Digital QR Tickets
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="login-form-section">

                <div className="login-form-container">


                    <div className="login-heading">

                        <p className="login-small-title">
                            WELCOME BACK
                        </p>

                        <h1>
                            Login to EventHub
                        </h1>

                        <p>
                            Choose how you want
                            to login to your account.
                        </p>

                    </div>


                    {/* LOGIN MODE */}

                    <div className="login-mode-switch">


                        <button

                            type="button"

                            className={
                                loginMode ===
                                "password"

                                    ? "login-mode-active"

                                    : ""
                            }

                            onClick={() =>
                                setLoginMode(
                                    "password"
                                )
                            }

                        >

                            Password

                        </button>


                        <button

                            type="button"

                            className={
                                loginMode ===
                                "otp"

                                    ? "login-mode-active"

                                    : ""
                            }

                            onClick={() =>
                                setLoginMode(
                                    "otp"
                                )
                            }

                        >

                            Login with OTP

                        </button>


                    </div>


                    <form

                        className="login-form"

                        onSubmit={

                            loginMode ===
                            "password"

                                ? handlePasswordLogin

                                : handleOTPLogin

                        }

                    >


                        <div className="login-input-group">

                            <label>
                                Email Address
                            </label>


                            <input

                                type="email"

                                name="email"

                                placeholder=
                                    "Enter your email"

                                value={
                                    formData.email
                                }

                                onChange={
                                    handleChange
                                }

                                required

                            />

                        </div>


                        {

                            loginMode ===
                            "password" && (

                                <div className="login-input-group">

                                    <label>
                                        Password
                                    </label>


                                    <input

                                        type="password"

                                        name="password"

                                        placeholder=
                                            "Enter your password"

                                        value={
                                            formData.password
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        required

                                    />


                                    <div className="login-forgot-password">

                                        <Link to="/forgot-password">

                                            Forgot Password?

                                        </Link>

                                    </div>


                                </div>

                            )

                        }


                        <button

                            type="submit"

                            className="login-submit-btn"

                            disabled={
                                loading
                            }

                        >

                            {

                                loading

                                    ? "Please wait..."

                                    : loginMode ===
                                      "password"

                                    ? "Login"

                                    : "Send Login OTP"

                            }

                        </button>


                    </form>


                    <div className="login-divider">

                        <span>
                            New to EventHub?
                        </span>

                    </div>


                    <p className="login-signup-text">

                        Don't have an account?{" "}

                        <Link to="/signup">
                            Create Account
                        </Link>

                    </p>


                    <Link
                        to="/"
                        className="login-back-home"
                    >

                        ← Back to Home

                    </Link>


                </div>

            </div>

        </div>

    );

};


export default Login;
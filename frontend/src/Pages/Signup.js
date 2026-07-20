import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Signup.css";

const Signup = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        const username =
            formData.username.trim();

        const email =
            formData.email.trim();

        const phone =
            formData.phone.trim();


        if (
            !username ||
            !email ||
            !phone ||
            !formData.password ||
            !formData.confirmPassword
        ) {

            toast.error(
                "Please fill in all fields"
            );

            return;

        }


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            toast.error(
                "Password and Confirm Password do not match"
            );

            return;

        }


        try {

            setLoading(true);


            const response = await API.post(
                "/auth/signup",
                {
                    ...formData,
                    username,
                    email,
                    phone
                }
            );


            sessionStorage.setItem(
                "signupEmail",
                email
            );


            toast.success(
                response.data.message ||
                "OTP sent successfully"
            );


            navigate(
                "/verify-signup-otp",
                {
                    replace: true
                }
            );


        } catch (error) {

            console.error(
                "Signup Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to create account"
            );


        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="signup-page">

            {/* ========================= */}
            {/* LEFT SIDE - FORM */}
            {/* ========================= */}

            <section className="signup-form-section">

                <div className="signup-form-container">

                    <div className="signup-heading">

                        <p className="signup-small-title">
                            JOIN EVENTHUB
                        </p>

                        <h1>
                            Create Your Account
                        </h1>

                        <p>
                            Discover events, book tickets,
                            and enjoy unforgettable experiences.
                        </p>

                    </div>


                    <form
                        className="signup-form"
                        onSubmit={handleSubmit}
                    >

                        {/* FULL NAME */}

                        <div className="signup-input-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your full name"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="signup-input-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* PHONE */}

                        <div className="signup-input-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="signup-input-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="signup-input-group">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="signup-submit-btn"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? "Creating Account..."
                                    : "Create Account"
                            }

                        </button>

                    </form>


                    <div className="signup-divider">

                        <span>
                            Already a member?
                        </span>

                    </div>


                    <p className="signup-login-text">

                        Already have an account?{" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </p>


                    <Link
                        to="/"
                        className="signup-back-home"
                    >
                        ← Back to Home
                    </Link>

                </div>

            </section>


            {/* ========================= */}
            {/* RIGHT SIDE - HERO */}
            {/* ========================= */}

            <section className="signup-hero">

                <div className="signup-hero-content">

                    <Link
                        to="/"
                        className="signup-logo"
                    >
                        EventHub
                    </Link>


                    <div className="signup-hero-text">

                        <span className="signup-tag">
                            DISCOVER • BOOK • EXPERIENCE
                        </span>


                        <h1>
                            Your next great experience starts here.
                        </h1>


                        <p>
                            Create your EventHub account and discover
                            amazing events, book tickets securely,
                            and access your digital QR tickets —
                            all in one place.
                        </p>


                        <div className="signup-benefits">

                            <div className="signup-benefit">

                                <span>🎟️</span>

                                <div>
                                    <h3>
                                        Easy Event Booking
                                    </h3>

                                    <p>
                                        Discover and book your
                                        favourite events.
                                    </p>
                                </div>

                            </div>


                            <div className="signup-benefit">

                                <span>🔐</span>

                                <div>
                                    <h3>
                                        Secure Account
                                    </h3>

                                    <p>
                                        OTP verification keeps
                                        your account protected.
                                    </p>
                                </div>

                            </div>


                            <div className="signup-benefit">

                                <span>📱</span>

                                <div>
                                    <h3>
                                        Digital QR Tickets
                                    </h3>

                                    <p>
                                        Access your event tickets
                                        anytime from your account.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>

    );

};

export default Signup;
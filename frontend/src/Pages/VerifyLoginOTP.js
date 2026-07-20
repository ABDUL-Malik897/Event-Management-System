import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/api";

import useAuthContext
    from "../hooks/useAuthContext";

import "./VerifySignupOTP.css";


const VerifyLoginOTP = () => {

    const navigate =
        useNavigate();

    const { dispatch } =
        useAuthContext();


    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [
        resendLoading,
        setResendLoading
    ] = useState(false);

    const [timer, setTimer] =
        useState(60);


    const email =
        sessionStorage.getItem(
            "LoginEmail"
        );


    // ============================
    // COUNTDOWN TIMER
    // ============================

    useEffect(() => {

        if (timer <= 0) {
            return;
        }


        const interval =
            setInterval(() => {

                setTimer(
                    (prev) =>
                        prev - 1
                );

            }, 1000);


        return () => {

            clearInterval(
                interval
            );

        };

    }, [timer]);


    // ============================
    // VERIFY OTP
    // ============================

    const handleSubmit =
        async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }


        if (!email) {

            toast.error(
                "Login session not found. Please login again."
            );

            navigate(
                "/login",
                {
                    replace: true
                }
            );

            return;
        }


        if (otp.length !== 6) {

            toast.error(
                "Please enter a valid 6-digit OTP"
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await API.post(

                    "/auth/verify-login-otp",

                    {
                        email,
                        otp
                    }

                );


            const authData = {

                ...response.data.user,

                token : response.data.token,

            };


            localStorage.setItem(

                "user",

                JSON.stringify(
                    authData
                )

            );


            dispatch({

                type: "LOGIN",

                payload:
                    authData

            });


            sessionStorage.removeItem(
                "LoginEmail"
            );


            toast.success(
                response.data.message ||
                "OTP sent successfully"
            );


            navigate(
                "/",
                {
                    replace: true
                }
            );


        } catch (error) {

            console.error(
                "OTP Verification Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "OTP verification failed"
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================
    // RESEND OTP
    // ============================

    const handleResendOTP =
        async () => {


        if (timer > 0 || resendLoading) {
            return;
        }


        if (!email) {

            toast.error(
                "Login session not found. Please login again."
            );

            navigate(
                "/login",
                {
                    replace: true
                }
            );

            return;
        }


        try {

            setResendLoading(
                true
            );


            const response =
                await API.post(

                    "/auth/send-login-otp",

                    {
                        email
                    }

                );


            toast.success(
                response.data.message ||
                "Logged in successfully"
            );


            // Clear previous OTP

            setOtp("");


            // Restart countdown

            setTimer(60);


        } catch (error) {

            console.error(

                "Resend OTP Error:",

                error

            );


            toast.error(
                error.response?.data?.message ||
                "Unable to resend OTP"
            );


            // If backend provides
            // remaining seconds

            if (
                error.response
                    ?.data
                    ?.remainingSeconds
            ) {

                setTimer(

                    error.response
                        .data
                        .remainingSeconds

                );

            }


        } finally {

            setResendLoading(
                false
            );

        }

    };


    // ============================
    // OTP INPUT
    // ============================

    const handleOTPChange =
        (e) => {


        const value =
            e.target.value.replace(
                /\D/g,
                ""
            );


        if (
            value.length <= 6
        ) {

            setOtp(
                value
            );

        }

    };


    return (

        <div
            className="verify-otp-page"
        >


            <div
                className="verify-otp-card"
            >


                <div
                    className="verify-otp-icon"
                >

                    ✉️

                </div>


                <p
                    className="verify-otp-badge"
                >

                    LOGIN VERIFICATION

                </p>


                <h1>

                    Verify Login OTP

                </h1>


                <p
                    className="verify-otp-description"
                >

                    We've sent a
                    6-digit verification
                    code to

                </p>


                <p
                    className="verify-otp-email"
                >

                    {
                        email ||
                        "your email"
                    }

                </p>


                <form

                    onSubmit={
                        handleSubmit
                    }

                    className="verify-otp-form"

                >


                    <label>

                        Enter OTP

                    </label>


                    <input

                        type="text"

                        inputMode="numeric"

                        maxLength="6"

                        placeholder="000000"

                        value={otp}

                        onChange={
                            handleOTPChange
                        }

                        autoFocus

                        required

                    />


                    <button

                        type="submit"

                        disabled={

                            loading ||

                            otp.length !== 6

                        }

                    >

                        {

                            loading

                                ? "Verifying..."

                                : "Verify Account"

                        }

                    </button>


                </form>


                {/* RESEND SECTION */}


                <div
                    className="verify-otp-help"
                >


                    <p>

                        Didn't receive
                        the OTP?

                    </p>


                    {

                        timer > 0

                            ? (

                                <p
                                    className="verify-otp-timer"
                                >

                                    Resend OTP in{" "}

                                    <strong>

                                        {timer}s

                                    </strong>

                                </p>

                            )

                            : (

                                <button

                                    type="button"

                                    className="verify-otp-resend-btn"

                                    onClick={
                                        handleResendOTP
                                    }

                                    disabled={
                                        resendLoading
                                    }

                                >

                                    {

                                        resendLoading

                                            ? "Sending..."

                                            : "Resend OTP"

                                    }

                                </button>

                            )

                    }


                </div>


                <Link

                    to="/login"

                    className="verify-otp-back"

                >

                    ← Back to Login

                </Link>


            </div>


        </div>

    );

};


export default VerifyLoginOTP;
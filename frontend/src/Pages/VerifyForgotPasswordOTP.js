import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import "./VerifyForgotPasswordOTP.css";

const VerifyForgotPasswordOTP = () => {

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const email = sessionStorage.getItem("forgotPasswordEmail");

    useEffect(() => {
        if (!email) {
        toast.error("Password reset session not found. Please try again.");
        navigate("/forgot-password", {
            replace: true,
        });
        }
    }, [email, navigate]);
        useEffect(() => {
        if (timer <= 0) {
        return;
        }
        const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleOTPChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
        setOtp(value.slice(0, 6));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) {
        return;
        }
        if (!email) {
        toast.error("Password reset session not found.");
        navigate("/forgot-password", {
            replace: true,
        });
        return;
        }
        if (otp.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
        }
        try {
        setLoading(true);
        const response = await API.post(
            "/auth/forgot-password/verify-otp",
            {
            email,
            otp,
            },
        );

        toast.success(response.data.message || "OTP verified successfully");
        navigate("/reset-password", {
            replace: true,
        });
        } catch (error) {
        console.error("Verify Forgot Password OTP Error:", error);
        toast.error(error.response?.data?.message || "Unable to verify OTP");
        } finally {
        setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (timer > 0 || resendLoading) {
        return;
        }
        if (!email) {
        toast.error("Password reset session not found.");
        return;
        }
        try {
        setResendLoading(true);
        const response = await API.post(
            "/auth/forgot-password/send-otp",
            {
            email,
            },
        );
        toast.success(response.data.message || "OTP sent successfully");
        setTimer(60);
        } catch (error) {
        console.error("Resend Forgot Password OTP Error:", error);
        if (error.response?.data?.remainingSeconds) {
            setTimer(error.response.data.remainingSeconds);
        }
        toast.error(error.response?.data?.message || "Unable to resend OTP");
        } finally {
        setResendLoading(false);
        }
    };

    return (
        <div className="verify-forgot-page">
        <div className="verify-forgot-card">
            <div className="verify-forgot-icon">🔑</div>
            <div className="verify-forgot-header">
            <span className="verify-forgot-badge">PASSWORD RECOVERY</span>
            <h1>Verify Your OTP</h1>
            <p>We've sent a 6-digit password reset OTP to</p>
            <strong className="verify-forgot-email">{email}</strong>
            </div>
            <form className="verify-forgot-form" onSubmit={handleSubmit}>
            <div className="verify-forgot-input-group">
                <label>Enter OTP</label>
                <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={handleOTPChange}
                maxLength="6"
                autoComplete="one-time-code"
                required
                />
            </div>
            <button
                type="submit"
                className="verify-forgot-submit-btn"
                disabled={loading || otp.length !== 6}
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
            </form>
            <div className="verify-forgot-resend">
            {timer > 0 ? (
                <p>
                Didn't receive the OTP?
                <br />
                Resend available in <strong>{timer}s</strong>
                </p>
            ) : (
                <>
                <p>Didn't receive the OTP?</p>
                <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                >
                    {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
                </>
            )}
            </div>
            <div className="verify-forgot-security">
            <span>🛡️</span>
            <p>
                Your OTP is valid for 10 minutes. Never share this code with anyone.
            </p>
            </div>
            <Link to="/forgot-password" className="verify-forgot-back">
            ← Change Email
            </Link>
        </div>
        </div>
    );
};

export default VerifyForgotPasswordOTP;

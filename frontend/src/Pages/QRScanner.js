import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import API from "../api/api";
import "./QRScanner.css";

const QRScanner = () => {

    const [scanned, setScanned] = useState(false);

    const [ticket, setTicket] = useState(null);

    const [message, setMessage] = useState("");

    const [status, setStatus] = useState("");

    const [scannerKey, setScannerKey] = useState(0);


    // =========================================
    // QR SCANNER
    // =========================================

    useEffect(() => {

        if (scanned) return;


        const scanner = new Html5QrcodeScanner(

            "reader",

            {
                fps: 10,

                qrbox: {
                    width: 250,
                    height: 250
                },

                rememberLastUsedCamera: true
            },

            false

        );


        // =====================================
        // SCAN SUCCESS
        // =====================================

        const onScanSuccess = async (decodedText) => {

            try {

                // Stop multiple scans

                setScanned(true);


                // Convert QR string into object

                const qrData =
                    JSON.parse(decodedText);

                if (!qrData?.ticketId) {
                    throw new Error(
                        "Invalid ticket QR code"
                    );
                }


                // Verify ticket from backend

                const res =
                    await API.post(
                        "/qr/verify",
                        {
                            ticketId:
                                qrData.ticketId
                        }
                    );


                // Save ticket details

                setTicket(
                    res.data.ticket
                );


                setMessage(

                    res.data.message ||
                    "Ticket Verified Successfully"

                );


                setStatus("success");


                // Stop camera

                await scanner
                    .clear()
                    .catch(() => {});


            } catch (error) {

                console.error(
                    "QR Verification Error:",
                    error
                );


                setTicket(null);


                setMessage(
                    error.response?.data?.message ||
                    error.message ||
                    "Invalid QR Code"
                );


                setStatus("error");


                await scanner
                    .clear()
                    .catch(() => {});

            }

        };


        // =====================================
        // SCAN FAILURE
        // =====================================

        const onScanFailure = () => {

            // Ignore normal scanning failures.
            // Scanner continuously searches
            // until a valid QR is detected.

        };


        scanner.render(

            onScanSuccess,

            onScanFailure

        );


        // =====================================
        // CLEANUP
        // =====================================

        return () => {

            scanner
                .clear()
                .catch(() => {});

        };


    }, [scanned, scannerKey]);


    // =========================================
    // SCAN ANOTHER TICKET
    // =========================================

    const handleScanAnother = () => {

        setScanned(false);

        setTicket(null);

        setMessage("");

        setStatus("");

        setScannerKey(
            (prev) => prev + 1
        );

    };


    return (

        <div className="qr-scanner-page">


            {/* =========================================
                HERO
            ========================================== */}

            <section className="qr-scanner-hero">


                <div>

                    <p className="qr-scanner-label">

                        EVENT CHECK-IN

                    </p>


                    <h1>

                        QR Ticket Scanner

                    </h1>


                    <p className="qr-scanner-description">

                        Scan attendee QR tickets to verify
                        their booking and check them into
                        the event instantly.

                    </p>


                    <div className="qr-scanner-live">

                        <span className="qr-live-dot">
                        </span>

                        Scanner Ready

                    </div>

                </div>


                <div className="qr-scanner-hero-icon">

                    📷

                </div>


            </section>


            {/* =========================================
                SCANNER SECTION
            ========================================== */}

            <section className="qr-scanner-section">


                <div className="qr-scanner-header">


                    <p>

                        TICKET VERIFICATION

                    </p>


                    <h2>

                        Scan Event Ticket

                    </h2>


                    <span>

                        Position the attendee's QR code
                        inside the scanner area.

                    </span>


                </div>


                <div className="qr-scanner-container">


                    {/* =================================
                        CAMERA
                    ================================== */}

                    {!scanned && (

                        <div className="qr-camera-card">


                            <div className="qr-camera-title">


                                <div>

                                    📱

                                </div>


                                <span>

                                    <strong>

                                        Camera Scanner

                                    </strong>


                                    <small>

                                        Allow camera access
                                        when prompted.

                                    </small>

                                </span>


                            </div>


                            <div className="qr-reader-wrapper">

                                <div
                                    id="reader"
                                    key={scannerKey}
                                >
                                </div>

                            </div>


                            <div className="qr-scanner-tip">

                                <span>

                                    💡

                                </span>


                                <p>

                                    Hold the QR code steady
                                    and make sure it is clearly
                                    visible inside the scanning
                                    area.

                                </p>

                            </div>


                        </div>

                    )}


                    {/* =================================
                        SUCCESS RESULT
                    ================================== */}

                    {scanned &&
                        status === "success" && (

                        <div className="qr-result-card qr-success-card">


                            <div className="qr-result-icon qr-success-icon">

                                ✓

                            </div>


                            <p className="qr-result-label">

                                VERIFICATION SUCCESSFUL

                            </p>


                            <h2>

                                {message}

                            </h2>


                            <p className="qr-result-description">

                                The ticket is valid and the
                                attendee has been successfully
                                verified.

                            </p>


                            {ticket && (

                                <div className="qr-ticket-details">


                                    <div className="qr-ticket-row">

                                        <span>

                                            Ticket ID

                                        </span>

                                        <strong>

                                            {
                                                ticket.ticketId
                                            }

                                        </strong>

                                    </div>


                                    <div className="qr-ticket-row">

                                        <span>

                                            Seat Number

                                        </span>

                                        <strong>

                                            {
                                                ticket.seatNumber ||
                                                "Not Assigned"
                                            }

                                        </strong>

                                    </div>


                                    <div className="qr-ticket-row">

                                        <span>

                                            Check-In Status

                                        </span>


                                        <strong className="qr-checked-badge">

                                            {
                                                ticket.checkedIn
                                                    ? "✓ Checked In"
                                                    : "Not Checked In"
                                            }

                                        </strong>

                                    </div>


                                </div>

                            )}


                            <button
                                type="button"
                                className="qr-retry-button"
                                onClick={handleScanAnother}
                            >
                                Scan Again
                            </button>


                        </div>

                    )}


                    {/* =================================
                        ERROR RESULT
                    ================================== */}

                    {scanned &&
                        status === "error" && (

                        <div className="qr-result-card qr-error-card">


                            <div className="qr-result-icon qr-error-icon">

                                ✕

                            </div>


                            <p className="qr-error-label">

                                VERIFICATION FAILED

                            </p>


                            <h2>

                                {message}

                            </h2>


                            <p className="qr-result-description">

                                This ticket could not be
                                verified. Please check the
                                QR code and try again.

                            </p>


                            <button
                                className="qr-retry-button"
                                onClick={handleScanAnother}
                            >

                                Scan Again

                            </button>


                        </div>

                    )}


                </div>


            </section>


        </div>

    );

};


export default QRScanner;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import NotFound from "./Pages/NotFound";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifySignupOTP from "./Pages/VerifySignupOTP";

import CreateEvent from "./Pages/CreateEvent";
import AllEvents from "./Pages/AllEvents";
import EventDetails from "./Pages/EventDetails";

import MyBooking from "./Pages/MyBooking";
import TicketDetails from "./Pages/TicketDetails";
import PaymentHistory from "./Pages/PaymentHistory";

import BecomeOrganizer from "./Pages/BecomeOrganizer";
import ApplicationStatus from "./Pages/ApplicationStatus";
import Membership from "./Pages/Membership";

import OrganizerDashboard from "./Pages/OrganizerDashboard";
import EditEvent from "./Pages/EditEvent";
import ViewAttendees from "./Pages/ViewAttendees";
import Analytics from "./Pages/Analytics";
import QRScanner from "./Pages/QRScanner";
import AttendanceDashboard from "./Pages/AttendanceDasboard";

import AdminReqs from "./Pages/AdminReqs";
import AdminHome from "./Pages/AdminHome";
import AdminDashboard from "./Pages/AdminDashboard";

import Navbar from "./components/Navbar";

import ProtectedRoutes from "./components/ProtectedRoutes";
import RoleRoute from "./components/RoleRoutes";
import GuestRoute from "./components/GuestRoute";

import HomeRoute from "./components/HomeRoute";
import VerifyLoginOTP  from "./Pages/VerifyLoginOTP";
import ForgotPassword from "./Pages/ForgetPassword";
import VerifyForgotPasswordOTP from "./Pages/VerifyForgotPasswordOTP";
import ResetPassword from "./Pages/ResetPassword";
import MembershipHistory from "./Pages/MembershipHistory";
import MembershipRoute from "./components/MembershipRoute";


function App() {


    return (

        <BrowserRouter>

        <Toaster position="top-right" toastOptions={{ duration : 3000 }}/>

            <Navbar />

            <Routes>


                {/* ================================= */}
                {/* HOME */}
                {/* ================================= */}

                <Route
                    path="/"
                    element={<HomeRoute />}
                />


                {/* ================================= */}
                {/* GUEST ONLY ROUTES */}
                {/* ================================= */}

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />


                <Route
                    path="/signup"
                    element={
                        <GuestRoute>
                            <Signup />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/verify-signup-otp"
                    element={<VerifySignupOTP />}
                />


                <Route
                    path="/verify-login-otp"
                    element={
                        <VerifyLoginOTP />
                    }
                />


                <Route
                    path="/forgot-password"
                    element={
                        <GuestRoute>
                            <ForgotPassword />
                        </GuestRoute>
                    }
                />


                <Route
                    path="/forgot-password/verify-otp"
                    element={
                        <GuestRoute>
                            <VerifyForgotPasswordOTP />
                        </GuestRoute>
                    }
                />


                <Route
                    path="/reset-password"
                    element={
                        <GuestRoute>
                            <ResetPassword />
                        </GuestRoute>
                    }
                />


                {/* ================================= */}
                {/* PUBLIC EVENT ROUTES */}
                {/* ================================= */}

                <Route
                    path="/events"
                    element={<AllEvents />}
                />


                <Route
                    path="/events/:id"
                    element={<EventDetails />}
                />


                {/* ================================= */}
                {/* LOGGED-IN USER ROUTES */}
                {/* ================================= */}

                <Route
                    path="/my-booking"
                    element={
                        <ProtectedRoutes>
                            <MyBooking />
                        </ProtectedRoutes>
                    }
                />


                <Route
                    path="/ticket/:bookingid"
                    element={
                        <ProtectedRoutes>
                            <TicketDetails />
                        </ProtectedRoutes>
                    }
                />


                <Route
                    path="/payment-history"
                    element={
                        <ProtectedRoutes>
                            <PaymentHistory />
                        </ProtectedRoutes>
                    }
                />


                <Route
                    path="/become-organizer"
                    element={
                        <ProtectedRoutes>
                            <BecomeOrganizer />
                        </ProtectedRoutes>
                    }
                />


                <Route
                    path="/application-status"
                    element={
                        <ProtectedRoutes>
                            <ApplicationStatus />
                        </ProtectedRoutes>
                    }
                />


                {/* ================================= */}
                {/* ORGANIZER MEMBERSHIP */}
                {/* ================================= */}

                <Route
                    path="/membership"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <Membership />
                        </RoleRoute>
                    }
                />


                {/* ================================= */}
                {/* ORGANIZER ONLY ROUTES */}
                {/* ================================= */}

                <Route
                    path="/organizer-dashboard"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <OrganizerDashboard />
                        </RoleRoute>
                    }
                />


                <Route
                    path="/create-event"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <MembershipRoute>
                            <CreateEvent />
                            </MembershipRoute>
                        </RoleRoute>
                    }
                />


                <Route
                    path="/edit-event/:id"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <EditEvent />
                        </RoleRoute>
                    }
                />


                <Route
                    path="/attendees/:eventId"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <ViewAttendees />
                        </RoleRoute>
                    }
                />


                <Route
                    path="/analytics"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <Analytics />
                        </RoleRoute>
                    }
                />


                <Route
                    path="/scanner"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <QRScanner />
                        </RoleRoute>
                    }
                />


                <Route
                    path="/attendance/:eventId"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <AttendanceDashboard />
                        </RoleRoute>
                    }
                />


                <Route
                    path="/membership-history"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "organizer"
                            ]}
                        >
                            <MembershipHistory />
                        </RoleRoute>
                    }
                />


                {/* ================================= */}
                {/* ADMIN ONLY ROUTES */}
                {/* ================================= */}

                <Route
                    path="/admin/requests"
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "admin"
                            ]}
                        >
                            <AdminReqs />
                        </RoleRoute>
                    }
                />


                <Route
                    path="/admin"
                    element={
                        <RoleRoute allowedRoles={["admin"]}>
                            <AdminHome />
                        </RoleRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <RoleRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </RoleRoute>
                    }
                />


                {/* ================================= */}
                {/* 404 */}
                {/* ================================= */}

                <Route
                    path="*"
                    element={<NotFound />}
                />


            </Routes>

        </BrowserRouter>

    );

}


export default App;
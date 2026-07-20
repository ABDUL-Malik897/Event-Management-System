import User from "../models/User.js";
import Event from "../models/Event.js";
import OrganizerReq from "../models/OrganizerReq.js";


export const getAdminDashboard = async (req, res) => {

    try {
        const totalUsers = await User.countDocuments({role: "user"});
        const totalOrganizers = await User.countDocuments({role: "organizer"});
        const totalAdmins = await User.countDocuments({role: "admin"});
        const totalEvents = await Event.countDocuments();
        const pendingRequests = await OrganizerReq.countDocuments({status: "Pending"});
        const currentDate = new Date();
        const upcomingEvents = await Event.countDocuments({date: {$gte: currentDate}});
        const completedEvents = await Event.countDocuments({date: {$lt: currentDate}});
        const eventCategories = await Event.aggregate([
                {
                    $group: {
                        _id: "$category",
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]);

        const recentEvents =  await Event.find().populate("organizer","username email").sort({ createdAt: -1 }).limit(5);
        const recentRequests = await OrganizerReq.find().populate("user", "username email").sort({createdAt: -1}).limit(5);
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        const eventGrowth = await Event.aggregate([
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                        "_id.month": 1
                    }
                }
            ]);

        res.status(200).json({
            success: true,
            dashboard: {
                stats: {
                    totalUsers,
                    totalOrganizers,
                    totalAdmins,
                    totalEvents,
                    pendingRequests,
                    upcomingEvents,
                    completedEvents
                },
                eventCategories,
                userGrowth,
                eventGrowth,
                recentEvents,
                recentRequests
            }
        })
    } catch (error) {
        console.log("Admin Dashboard Error:",error);
        res.status(500).json({
            success: false,
            message:"Failed to fetch admin dashboard"
        });
    }
};
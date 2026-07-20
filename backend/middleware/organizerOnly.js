const organizerOnly = (req ,res, next) => {
    if (req.user.role !== "organizer") {
        return res.status(403).json({
            success : false,
            message : "Organizer access only"
        })
    }

    if (req.user.membershipStatus !== "active") {
        return res.status(403).json({
            success : false,
            message : "Please activate your orgainzer membership"
        })
    }
    next()
} 

export default organizerOnly
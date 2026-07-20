const adminOnly = (req ,res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success : false,
            message : "admin access only"
        })
    }
    next()
} 

export default adminOnly
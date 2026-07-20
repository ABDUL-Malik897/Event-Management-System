import { Navigate } from "react-router-dom";
import useAuthContext  from "../hooks/useAuthContext";

const RoleRoute = ({ children, allowedRoles }) => {

    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleRoute;
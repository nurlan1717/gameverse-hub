import { Navigate, Outlet } from "react-router-dom";
import { getToken, getRole } from "../utils/authService";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const token = getToken(); 
    const role = getRole();   

    if (!token) {
        return <Navigate to="/login" replace />; 
    }

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />; 
    }

    return <Outlet />;
};

export default ProtectedRoute;

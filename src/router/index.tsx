import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/NotFound/NotFound";
import Unauthorized from "../components/Unauthorized/Unauthorized";
import ClientLayouts from "../layouts/ClientLayouts/ClientLayouts";
import AdminLayouts from "../layouts/AdminLayouts/AdminLayouts";
import DevLayouts from "../layouts/DevLayouts/DevLayouts";
import Login from "../layouts/public/Login/Login";



const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* User Routes */}
                <Route element={<ProtectedRoute allowedRoles={["user", "developer", "admin"]} />}>
                    <Route element={<ClientLayouts />}>
                        {/* <Route path="/" element={<ClientPage />} />
                        <Route path="/profile" element={<ProfilePage />} /> */}
                    </Route>
                </Route>

                {/* Developer Routes */}
                <Route element={<ProtectedRoute allowedRoles={["developer", "admin"]} />}>
                    <Route element={<DevLayouts />}>
                        {/* <Route path="/developer" element={<DeveloperPage />} />
                        <Route path="/dev-tools" element={<DevToolsPage />} /> */}
                    </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route element={<AdminLayouts />}>
                        {/* <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin/users" element={<UserManagementPage />} /> */}
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;

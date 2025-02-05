import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/NotFound/NotFound";
import Unauthorized from "../components/Unauthorized/Unauthorized";

import ClientLayouts from "../layouts/ClientLayouts/ClientLayouts";
import AdminLayouts from "../layouts/AdminLayouts/AdminLayouts";
import DevLayouts from "../layouts/DevLayouts/DevLayouts";

import Login from "../layouts/public/Login/Login";
import AdminLogin from "../pages/Admin/AdminLogin/AdminLogin";

import Games from "../pages/Client/Games/Games";
import Details from "../pages/Client/Details/Details";
import Home from "../pages/Client/Home/Home";

import AdminPage from "../pages/Admin/AdminPage/AdminPage";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";

import Register from "../layouts/public/Register/Register";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/admin" element={<AdminLogin />} />

                {/* Client Routes */}
                <Route element={<ProtectedRoute allowedRoles={["user", "developer", "admin"]} />}>
                    <Route element={<ClientLayouts />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/games/:id" element={<Details />} />
                    </Route>
                </Route>

                {/* Developer Routes */}
                <Route element={<ProtectedRoute allowedRoles={["developer", "admin"]} />}>
                    <Route element={<DevLayouts />}>
                    </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin/*" element={<AdminLayouts />}>
                        <Route path="home" element={<AdminPage />} />
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;

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

import Dashboard from "../pages/Admin/Dashboard/Dashboard";

import Register from "../layouts/public/Register/Register";
import RegisterChoice from "../layouts/public/RegisterChoice/RegisterChoice.jsx";
import DeveloperRegister from "../layouts/public/RegisterDev/RegisterDev.jsx";
import WishlistPage from "../pages/Client/Wishlist/WishlistPage.js";
import BasketPage from "../pages/Client/Basket/Basket.js";
import UserProfilePage from "../pages/UserProfile/UserProfilePage.js";
import Teams from "../pages/Client/Teams/Teams.js";
import ProfileLayouts from "../layouts/UserProfile/ProfileLayouts.js";
import Chat from "../components/Chat/Chat.js";
import DashboardDev from "../pages/Dev/DashboardDev/DashboardDev.js";
import Stats from "../pages/Dev/stats/Stats.js";
import GamesDev from "../pages/Dev/Games/Games.js";
import UserEmailPage from "../pages/UserProfile/UserEmailPage.js";
import UserPayment from "../pages/UserProfile/UserPayment.js";
import UserLibrary from "../pages/UserProfile/UserLibrary.js";
import News from "../pages/Client/News/News.js";
import Tournaments from "../pages/Client/Tournament/Tournaments.js";
import About from "../pages/Client/About/About.js";
import UserPassword from "../pages/UserProfile/UserPassword.js";


const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route element={<ClientLayouts />}>
                    <Route index element={<Home />} />
                    <Route path="/team" element={<Teams />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/games/:id" element={<Details />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/tournament" element={<Tournaments />} />
                    <Route path="/about" element={<About />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["user", "developer", "admin"]} />}>
                    <Route path="/profile" element={<ProfileLayouts />}>
                        <Route index element={<UserProfilePage />} />
                        <Route path="email" element={<UserEmailPage />} />
                        <Route path="payment" element={<UserPayment />} />
                        <Route path="library" element={<UserLibrary />} />
                        <Route path="security" element={<UserPassword />} />
                    </Route>
                </Route>

                <Route path="/reg" element={<RegisterChoice />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/developer" element={<DeveloperRegister />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/admin" element={<AdminLogin />} />

                {/* Client Routes */}
                <Route element={<ProtectedRoute allowedRoles={["user", "developer", "admin"]} />}>
                    <Route element={<ClientLayouts />}>
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/basket" element={<BasketPage />} />
                    </Route>
                </Route>

                {/* Developer Routes */}
                <Route element={<ProtectedRoute allowedRoles={["developer", "admin"]} />}>
                    <Route path="/dev" element={<DevLayouts />}>
                        <Route index element={<DashboardDev />} />
                        <Route path="stats" element={<Stats />} />
                        <Route path="games" element={<GamesDev />} />
                    </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin/*" element={<AdminLayouts />}>
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;

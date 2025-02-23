import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useLogoutMutation } from '../../features/oauth/oauth';
import Cookies from "js-cookie";
import gameverselogo from "../../assets/images/statics/gameverse.png";
import {
    Heart,
    ShoppingCart,
    Menu,
    X,
    LogOut,
    ChevronDown,
    User,
    Settings,
    HelpCircle
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useGetBasketQuery } from '../../features/user/usersSlice';

const AdminHeader = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const { data: basket } = useGetBasketQuery()
    const userData = useSelector((state: RootState) => state.auth.user?.data);
    const role = Cookies.get("role");
    const token = Cookies.get("token");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("id");
        Cookies.remove("role");
        Cookies.remove("connect.sid");
        logout();
        window.location.reload();
        navigate("/");
    };

    const menuItems = [
        { path: '/', label: 'Home' },
        { path: '/games', label: 'Games' },
        { path: '/team', label: 'Teams' },
        { path: '/tournament', label: 'Tournaments' },
        { path: '/chat', label: 'Chat' },
        { path: '/about', label: 'About' },
    ];

    return (
        <>
            <motion.div
                className='fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#121216]/95 border-b border-gray-800'
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex items-center">
                                <img
                                    src={gameverselogo}
                                    alt="GameVerse"
                                    className="h-4 w-auto"
                                />
                            </Link>

                            <nav className="hidden lg:flex items-center space-x-6">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `text-sm font-medium transition-all duration-200 ${isActive
                                                ? "text-[#26bbff] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#26bbff] after:rounded-full"
                                                : "text-gray-400 hover:text-white"
                                            }`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>

                                ))}
                                {role === "developer" && (
                                    <NavLink
                                        to="/dev"
                                        className={({ isActive }) =>
                                            `text-sm font-medium transition-all duration-200 ${isActive
                                                ? "text-[#26bbff] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#26bbff] after:rounded-full"
                                                : "text-gray-400 hover:text-white"
                                            }`
                                        }
                                    >
                                        Panel
                                    </NavLink>
                                )}
                                {role === "admin" && (
                                    <NavLink
                                        to="/admin/dashboard"
                                        className={({ isActive }) =>
                                            `text-sm font-medium transition-all duration-200 ${isActive
                                                ? "text-[#26bbff] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#26bbff] after:rounded-full"
                                                : "text-gray-400 hover:text-white"
                                            }`
                                        }
                                    >
                                        Admin
                                    </NavLink>
                                )}
                            </nav>
                        </div>

                        <div className="flex items-center gap-6">
                            {token ? (
                                <>
                                    <div className="hidden sm:flex items-center gap-4">
                                        <Link
                                            to="/basket"
                                            className="text-gray-400 hover:text-white transition-colors relative group"
                                        >
                                            <ShoppingCart className="h-5 w-5" />
                                            <span className="absolute -top-2 -right-2 bg-[#26bbff] text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                                {basket?.data?.length}
                                            </span>
                                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Cart
                                            </span>
                                        </Link>

                                        <Link
                                            to="/wishlist"
                                            className="text-gray-400 hover:text-white transition-colors relative group"
                                        >
                                            <Heart className="h-5 w-5" />
                                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Wishlist
                                            </span>
                                        </Link>
                                    </div>

                                    <div className="relative" ref={profileRef}>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 hover:bg-gray-800 rounded-full p-1 transition-colors"
                                        >
                                            <img
                                                src={userData?.profileImage}
                                                alt="Profile"
                                                className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-[#26bbff] transition-colors"
                                            />
                                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isProfileOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-2 w-48 bg-[#1a1a1f] rounded-lg shadow-lg py-1 border border-gray-800"
                                                >
                                                    <div className="px-4 py-2 border-b border-gray-800">
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {userData?.username}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            Balance: ${userData?.balance}
                                                        </p>
                                                    </div>

                                                    <Link
                                                        to="/profile"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                                    >
                                                        <User className="h-4 w-4" />
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        to="/profile"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        Settings
                                                    </Link>
                                                    <Link
                                                        to="/help"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                                    >
                                                        <HelpCircle className="h-4 w-4" />
                                                        Help Center
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-gray-800 transition-colors w-full"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Logout
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to="/reg"
                                    className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Join Us
                                </Link>
                            )}

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden text-gray-400 hover:text-white transition-colors"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.nav
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="lg:hidden mt-4 space-y-2 overflow-hidden"
                            >
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `block py-2 px-4 text-sm font-medium rounded-lg transition-colors ${isActive
                                                ? "bg-[#26bbff]/10 text-[#26bbff]"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                            }`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </motion.nav>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
};

export default AdminHeader;
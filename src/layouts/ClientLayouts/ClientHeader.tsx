import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useLogoutMutation } from '../../features/oauth/oauth';
import Cookies from "js-cookie";
import gameverselogo from "../../assets/images/statics/gameverse.png";
import { Heart, ShoppingCart, Menu, X, Search } from 'lucide-react';
import React from 'react';
import { motion } from "framer-motion";

const ClientHeader = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const userData = useSelector((state: RootState) => state.auth.user?.data);
    const token = Cookies.get("token");
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const role = Cookies.get("role");

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("id");
        Cookies.remove("role");
        Cookies.remove("connect.sid");
        logout();
        window.location.reload();
        navigate("/");
    };

    return (
        <>
            <motion.div className='fixed top-0 left-0 w-full z-50'
                initial={{ scale: 0.5, filter: "blur(10px)", opacity: 0 }}
                animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ backgroundColor: "#121216" }}>
                <div className="container mx-auto px-6 py-6 flex items-center gap-3 justify-between flex-wrap">
                    <div className="flex items-center sm:w-auto sm:mb-0">
                        <img
                            src={gameverselogo}
                            alt="Client Logo"
                            className="h-5 w-4/6 mr-3"
                        />
                    </div>

                    <div className="sm:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                        </button>
                    </div>

                    <nav className="hidden sm:flex space-x-8 w-full sm:w-auto justify-center sm:justify-end mb-4 sm:mb-0">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-blue-500 drop-shadow-lg font-bold" : "text-gray-200 hover:text-blue-500"
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/games"
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-blue-500 drop-shadow-lg font-bold" : "text-gray-200 hover:text-blue-500"
                                }`
                            }
                        >
                            Games
                        </NavLink>
                        <NavLink
                            to="/tournament"
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-blue-500 drop-shadow-lg font-bold" : "text-gray-200 hover:text-blue-500"
                                }`
                            }
                        >
                            Tournaments
                        </NavLink>
                        <NavLink
                            to="/chat"
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-blue-500 drop-shadow-lg font-bold" : "text-gray-200 hover:text-blue-500"
                                }`
                            }
                        >
                            Chat
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? "text-blue-500 drop-shadow-lg font-bold" : "text-gray-200 hover:text-blue-500"
                                }`
                            }
                        >
                            About
                        </NavLink>
                        {role === "developer" && (
                            <NavLink
                                to="/dev"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-blue-500 drop-shadow-lg font-bold" : "text-gray-200 hover:text-blue-500"
                                    }`
                                }
                            >
                                Panel
                            </NavLink>
                        )}
                    </nav>

                    <nav className={`sm:hidden w-full ${isMenuOpen ? 'block' : 'hidden'} space-y-4 text-center`}>
                        <Link to="/" className="text-gray-200 hover:text-white transition-colors block">
                            Home
                        </Link>
                        <Link to="/games" className="text-gray-200 hover:text-white transition-colors block">
                            Games
                        </Link>
                        <Link to="/tournament" className="text-gray-200 hover:text-white transition-colors block">
                            Tournaments
                        </Link>
                        <Link to="/chat" className="text-gray-200 hover:text-white transition-colors block">
                            Chat
                        </Link>
                        <Link to="/about" className="text-gray-200 hover:text-white transition-colors block">
                            About
                        </Link>
                        {role === "developer" && (
                            <NavLink
                                to="/dev"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-blue-500 drop-shadow-lg font-bold" : "text-gray-200 hover:text-blue-500"
                                    }`
                                }
                            >
                                Panel
                            </NavLink>
                        )}
                    </nav>

                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end">
                        {token ? (
                            <>
                                <Link to="/basket" className="text-gray-200 hover:text-white transition-colors">
                                    <ShoppingCart className="h-6 w-6" />
                                </Link>

                                <Link to="/wishlist" className="text-gray-200 hover:text-white transition-colors">
                                    <Heart className="h-6 w-6" />
                                </Link>

                                <Link to="/profile" className="text-gray-200 hover:text-white transition-colors">
                                    <img
                                        src={userData?.profileImage}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full"
                                    />
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="bg-[#26bbff] hover:bg-blue-400 rounded-xl text-black text-sm transition duration-300 cursor-pointer py-2 px-4"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/reg"
                                className="bg-[#353539] hover:bg-blue-400 rounded-xl text-white text-sm transition duration-300 cursor-pointer py-2 px-4"
                            >
                                Join Us
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
            <div className='bg-[#101014]'>
                <div className="container mx-auto px-4 pt-26">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search store"
                                className="bg-[#202024] text-white px-4 py-2 rounded-full pl-10 outline-none w-full md:w-60"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Search size={18} />
                            </span>
                        </div>
                        <nav className="flex gap-4 text-white">
                            <div className='flex gap-2'>
                                <h1 className="font-semibold">Balance:</h1>
                                <p className="font-bold">${userData?.balance}</p>

                            </div>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-white hover:text-white" : "text-gray-400 hover:text-white"
                                    }`
                                }
                            >
                                Discover
                            </NavLink>
                            <NavLink
                                to="/browse"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-white hover:text-white" : "text-gray-400 hover:text-white"
                                    }`
                                }
                            >
                                Browse
                            </NavLink>
                            <NavLink
                                to="/news"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? "text-white hover:text-white" : "text-gray-400 hover:text-white"
                                    }`
                                }
                            >
                                News
                            </NavLink>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientHeader;

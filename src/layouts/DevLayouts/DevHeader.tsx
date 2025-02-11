import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useLogoutMutation } from '../../features/oauth/oauth';
import Cookies from "js-cookie";
import gameverselogo from "../../assets/images/statics/gameverse.png";
import { Heart, ShoppingCart, Menu, X, Search } from 'lucide-react';
import React from 'react';
import { motion } from "framer-motion";

const DevHeader = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const userData = useSelector((state: RootState) => state.auth.user?.data);
  const token = Cookies.get("token");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
            <NavLink
              to="/dev"
              className={({ isActive }) =>
                `transition-colors ${isActive ? "text-blue-500 drop-shadow-lg font-bold" : "text-gray-200 hover:text-blue-500"
                }`
              }
            >
              Panel
            </NavLink>
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
            <Link to="/dev" className="text-gray-200 hover:text-white transition-colors block">
              Panel
            </Link>
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
    </>
  );
};

export default DevHeader;

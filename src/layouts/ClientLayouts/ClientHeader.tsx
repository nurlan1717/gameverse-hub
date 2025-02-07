import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useLogoutMutation } from '../../features/oauth/oauth';
import Cookies from "js-cookie";
import gameverselogo from "../../assets/images/statics/gameverse.png";
import { Heart, ShoppingCart } from 'lucide-react';

const ClientHeader = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const userData = useSelector((state: RootState) => state.auth.user?.data);
    const token = Cookies.get("token");

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("id");
        Cookies.remove("role");
        Cookies.remove("connect.sid");
        logout();
        navigate("/");
    };

    return (
        <header style={{ backgroundColor: "#121216" }}>
            <div className="container mx-auto px-6 py-6 flex items-center justify-between flex-wrap">
                <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                        src={gameverselogo}
                        alt="Client Logo"
                        className="h-5 w-4/6 mr-3"
                    />
                </div>

                <nav className="flex space-x-8 w-full sm:w-auto justify-center sm:justify-end mb-4 sm:mb-0">
                    <Link to="/" className="text-gray-200 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link to="/games" className="text-gray-200 hover:text-white transition-colors">
                        Games
                    </Link>
                    <Link to="/tournament" className="text-gray-200 hover:text-white transition-colors">
                        Tournaments
                    </Link>
                    <Link to="/about" className="text-gray-200 hover:text-white transition-colors">
                        About
                    </Link>
                </nav>

                <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end">
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


                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="bg-[#26bbff] hover:bg-blue-400 rounded-xl text-black text-sm transition duration-300 cursor-pointer py-2 px-4"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-[#353539] hover:bg-blue-400 rounded-xl text-white text-sm transition duration-300 cursor-pointer py-2 px-4"
                        >
                            Join Us
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ClientHeader;
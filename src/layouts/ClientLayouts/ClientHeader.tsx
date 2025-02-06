import { Link, useNavigate } from 'react-router-dom';
import gameverselogo from "../../assets/images/statics/gameverse.png";
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useLogoutMutation } from '../../features/oauth/oauth';
import Cookies from "js-cookie";

const ClientHeader = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const userData = useSelector((state: RootState) => state.auth.user?.data);
    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("id");
        Cookies.remove("role");
        Cookies.remove("connect.sid");
        logout();
        navigate("/");
    }

    return (
        <header style={{ backgroundColor: "#070320" }}>
            <div className="container mx-auto px-6 py-6 flex items-center justify-between flex-wrap">
                <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                        src={gameverselogo}
                        alt="Client Logo"
                        className="h-4 w-4/5 mr-3"
                    />
                </div>

                <nav className="flex space-x-8 w-full sm:w-auto justify-center sm:justify-end mb-4 sm:mb-0">
                    <Link to="/" className="text-gray-200 hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <Link to="games" className="text-gray-200 hover:text-blue-600 transition-colors">
                        Games
                    </Link>
                    <Link to="/tournament" className="text-gray-200 hover:text-blue-600 transition-colors">
                        Tournaments
                    </Link>
                    <Link to="/about" className="text-gray-200 hover:text-blue-600 transition-colors">
                        About
                    </Link>
                </nav>

                <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end">
                    <img
                        src={userData?.profileImage}
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                    />

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold transition duration-300 cursor-pointe py-3 px-5"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>

    );
};

export default ClientHeader;

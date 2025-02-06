import { Link } from 'react-router-dom';
import gameverselogo from "../../assets/images/statics/gameverse.png";

const ClientHeader = () => {
    return (
        <header style={{ backgroundColor: "#070320" }}>
            <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={gameverselogo}
                        alt="Client Logo"
                        className="h-4 w-4/5 mr-3"
                    />
                </div>

                <nav className="flex space-x-24">
                    <Link to="/" className="text-gray-200 hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <Link to="/about" className="text-gray-200 hover:text-blue-600 transition-colors">
                        About
                    </Link>
                    <Link to="/services" className="text-gray-200 hover:text-blue-600 transition-colors">
                        Services
                    </Link>
                    <Link to="/contact" className="text-gray-200 hover:text-blue-600 transition-colors">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <img
                        src=""
                        alt="Profile"
                        className="h-10 w-10 rounded-full border-" 
                    />

                    <button className="bg-violet-600 cursor-pointer text-white hover:bg-blue-500 py-2 px-4 rounded-lg transition-colors">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ClientHeader;

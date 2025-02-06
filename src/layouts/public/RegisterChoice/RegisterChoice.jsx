import { useNavigate } from "react-router-dom";
import { User, Code, LogIn } from "lucide-react";
import { useEffect } from "react";
import Cookies from "js-cookie";

const RegisterChoice = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get("token")) {
            navigate("/home");
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 border border-gray-700">
                <h2 className="text-white text-3xl font-semibold text-center mb-6">Choose Registration Type</h2>
                <p className="text-gray-400 text-center mb-4">Select the type of account you want to create.</p>

                <button
                    onClick={() => navigate("/register/developer")}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg transition duration-300 font-semibold shadow-md shadow-purple-800 flex items-center justify-center gap-2 mb-4"
                >
                    <Code size={20} /> Register as Developer
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition duration-300 font-semibold shadow-md shadow-blue-800 flex items-center justify-center gap-2 mb-4"
                >
                    <User size={20} /> Register as User
                </button>

                <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition duration-300 font-semibold shadow-md flex items-center justify-center gap-2"
                >
                    <LogIn size={20} /> Login
                </button>
            </div>
        </div>
    );
};

export default RegisterChoice;

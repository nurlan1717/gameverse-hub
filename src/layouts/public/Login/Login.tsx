import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { User, Lock } from "lucide-react";
import { BASE_URL } from "../../../constants/api";
import { toast, ToastContainer } from "react-toastify"

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${BASE_URL}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error("Login failed");
            Cookies.set("token", data.token, { expires: 7 });
            Cookies.set("role", data.data.role, { expires: 7 });
            navigate("/");
            toast.success("Login Successfully");
            console.log(data);
        } catch (err: any) {
            console.log(err);
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 border border-gray-700">
                <h2 className="text-white text-3xl font-semibold text-center mb-6">Welcome Back</h2>

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}

                <div className="mb-4 relative">
                    <label className="text-gray-300 block mb-2">Username</label>
                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                        <User className="text-gray-400 mx-2" size={20} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-transparent text-white outline-none px-2"
                            placeholder="Enter your username"
                        />
                    </div>
                </div>

                <div className="mb-4 relative">
                    <label className="text-gray-300 block mb-2">Password</label>
                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                        <Lock className="text-gray-400 mx-2" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent text-white outline-none px-2"
                            placeholder="Enter your password"
                        />
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition duration-300 font-semibold shadow-md shadow-blue-800"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Login"}
                </button>

                <p className="text-gray-400 text-center mt-4 text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 cursor-pointer">Sign up</Link>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;

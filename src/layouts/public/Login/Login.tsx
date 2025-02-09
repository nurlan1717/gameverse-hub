import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { User, Lock, Facebook, Chrome } from "lucide-react";
import { ADMIN_URL_BASE } from "../../../constants/api";
import { toast, ToastContainer } from "react-toastify";
import { useLoginUserMutation } from "../../../features/user/usersSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setCredentials } from "../../../features/auth/authSlice";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loginUser] = useLoginUserMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Username and password are required.");
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await loginUser({ username, password }).unwrap();
            dispatch(setCredentials(response.data));

            if (!response.data.isVerified || !response.data.isVerifiedByAdmin) {
                setError("Please verify your email and wait for admin approval!.");
                toast.error("Please verify your email and wait for admin approval!.");
                return;
            }
            Cookies.set("token", response.token, { expires: 7, path: "/", secure: true, sameSite: "Lax" });
            Cookies.set("role", response.data.role, { expires: 7, path: "/", secure: true, sameSite: "Lax" });
            Cookies.set("id", response.data.id, { expires: 7, path: "/", secure: true, sameSite: "Lax" });

            navigate("/");
            window.location.reload();
            toast.success("Login Successfully");
        } catch (err: any) {
            console.error("Login error:", err);

            if (err) {
                setError(err.data.message || "Invalid username or password.");
                toast.error(err.data.message || "Login failed. Please try again.");
            } else {
                setError("Network error. Please check your connection.");
                toast.error("Network error.");
            }
        } finally {
            setLoading(false);
        }
    };



    const handleSocialLogin = async (provider: "google" | "facebook") => {
        try {
            window.location.href = `${ADMIN_URL_BASE}auth/${provider}`;
        } catch (err: any) {
            console.error("Social login error:", err);
            setError("Social login failed. Please try again.");
            toast.error("Social login failed.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (Cookies.get("token")) {
            navigate("/");
        }
    }, []);

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

                <div className="flex justify-center gap-4 mt-4">
                    <button onClick={() => handleSocialLogin("google")} className="text-white bg-red-600 p-2 rounded-full">
                        <Chrome size={24} />
                    </button>
                    <button onClick={() => handleSocialLogin("facebook")} className="text-white bg-blue-600 p-2 rounded-full">
                        <Facebook size={24} />
                    </button>
                </div>

                <p className="text-gray-400 text-center mt-4 text-sm">
                    Don't have an account?{" "}
                    <Link to="/reg" className="text-blue-400 hover:text-blue-300 cursor-pointer">Sign up</Link>
                </p>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                toastStyle={{ backgroundColor: '#1F1F23', color: 'white' }}
            />
        </div>
    );
};

export default Login;

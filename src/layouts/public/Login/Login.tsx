import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { User, Lock, Facebook, Chrome, Sparkles, LogIn } from "lucide-react";
import { ADMIN_URL_BASE } from "../../../constants/api";
import { toast } from "react-toastify";
import { useLoginUserMutation } from "../../../features/user/usersSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setCredentials } from "../../../features/auth/authSlice";
import { Helmet } from "react-helmet-async";

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
                setError("Please verify your email and wait for admin approval!");
                toast.error("Please verify your email and wait for admin approval!");
                return;
            }
            Cookies.set("token", response.token, { expires: 1, path: "/", secure: true, sameSite: "Lax" });
            Cookies.set("role", response.data.role, { expires: 1, path: "/", secure: true, sameSite: "Lax" });
            Cookies.set("id", response.data.id, { expires: 1, path: "/", secure: true, sameSite: "Lax" });

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
        }
    };

    useEffect(() => {
        if (Cookies.get("token")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <Helmet>
                <title>Login</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to your account</p>
                    </div>

                    <div className="bg-[#1E293B] rounded-xl shadow-xl p-6 backdrop-blur-lg border border-gray-700/50">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-gray-300 text-sm font-medium mb-1 block">
                                    Username
                                </label>
                                <div className="flex items-center bg-[#2D3B4F] rounded-lg p-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/50">
                                    <span className="text-gray-400 mx-2 group-focus-within:text-blue-400">
                                        <User size={20} />
                                    </span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-transparent text-white outline-none px-2 py-1.5"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-gray-300 text-sm font-medium mb-1 block">
                                    Password
                                </label>
                                <div className="flex items-center bg-[#2D3B4F] rounded-lg p-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/50">
                                    <span className="text-gray-400 mx-2 group-focus-within:text-blue-400">
                                        <Lock size={20} />
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent text-white outline-none px-2 py-1.5"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className={`
                                w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg
                                ${loading
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-blue-500/20'
                                    }
                                text-white flex items-center justify-center gap-2
                            `}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700/50"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#1E293B] px-2 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                className="flex-1 bg-[#2D3B4F] hover:bg-[#374151] text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-lg"
                                onClick={() => handleSocialLogin("google")}
                            >
                                <Chrome className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                                <span className="font-medium">Google</span>
                            </button>
                            <button
                                className="flex-1 bg-[#2D3B4F] hover:bg-[#374151] text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-lg"
                                onClick={() => handleSocialLogin("facebook")}
                            >
                                <Facebook className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                                <span className="font-medium">Facebook</span>
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Don't have an account?{" "}
                                <Link
                                    to="/reg"
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
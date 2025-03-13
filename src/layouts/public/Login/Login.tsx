import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { User, Lock, Facebook, Chrome, Sparkles, LogIn, X, Key, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { ADMIN_URL_BASE } from "../../../constants/api";
import { toast, ToastContainer } from "react-toastify";
import { useForgotPasswordMutation, useLoginUserMutation, useResetPasswordMutation } from "../../../features/user/usersSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setCredentials } from "../../../features/auth/authSlice";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('');
    const [Lpassword, setLpassword] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [loginUser] = useLoginUserMutation();
    const [forgotPassword] = useForgotPasswordMutation();
    const [resetPassword] = useResetPasswordMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const slideVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    };

    const handleLogin = async () => {
        if (!username || !Lpassword) {
            setError("Username and password are required.");
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await loginUser({ username, password: Lpassword }).unwrap();
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

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await forgotPassword({ email });
            if ('data' in response && response.data?.message) {
                toast.success(response.data.message);
                setStep(2);
            }
        } catch (error) {
            toast.error('Failed to send reset password email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        console.log(token, password);
        if (!token || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await resetPassword({ token, password });
            console.log(response);
            if ('data' in response && response.data?.message) {
                toast.success('Password reset successfully!');
                setShowForgotPassword(false);
                setStep(1);
                setToken('');
                setPassword('');
                setEmail('');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowForgotPassword(false);
        setStep(1);
        setToken('');
        setPassword('');
        setEmail('');
    };

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
                                        value={Lpassword}
                                        onChange={(e) => setLpassword(e.target.value)}
                                        className="w-full bg-transparent text-white outline-none px-2 py-1.5"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-sm text-blue-400 cursor-pointer hover:text-blue-300 transition-colors duration-200"
                                >
                                    Forgot Password?
                                </button>
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
                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </div>
            </div>

            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1E293B] rounded-xl shadow-xl p-6 max-w-md w-full relative border border-gray-700/50">
                        <button
                            onClick={handleModalClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-4 cursor-pointer">
                            {step === 1 ? 'Forgot Password' : 'Reset Password'}
                        </h2>
                        <p className="text-gray-400 mb-6">
                            {step === 1
                                ? "Enter your email address and we'll send you a reset token."
                                : "Enter the token from your email and your new password."
                            }
                        </p>

                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial="enter"
                                animate="center"
                                exit="exit"
                                variants={slideVariants}
                                transition={{ type: "tween", duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="group">
                                    <label className="text-gray-300 text-sm font-medium mb-1 block">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#2D3B4F] text-white rounded-lg p-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/50"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleForgotPassword}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <ClipLoader size={20} color="#ffffff" /> : 'Send Reset Token'}
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial="enter"
                                animate="center"
                                exit="exit"
                                variants={slideVariants}
                                transition={{ type: "tween", duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter reset token"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            className="pl-10 w-full px-4 py-3 bg-[#2D3B4F] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 w-full px-4 py-3 bg-[#2D3B4F] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleResetPassword}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <ClipLoader size={20} color="#ffffff" /> : (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2" />
                                            Reset Password
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
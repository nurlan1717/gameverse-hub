import { useNavigate } from "react-router-dom";
import { User, Code, LogIn, Sparkles } from "lucide-react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";

const RegisterChoice = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get("token")) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");
        const role = queryParams.get("role");
        const id = queryParams.get("id");

        if (token && role) {
            Cookies.set("token", token, { expires: 1, path: "/", secure: true, sameSite: "Lax" });
            Cookies.set("role", role, { expires: 1, path: "/", secure: true, sameSite: "Lax" });
            if (id) Cookies.set("id", id, { expires: 1, path: "/", secure: true, sameSite: "Lax" });

            navigate("/");
            toast.success("Login Successfully");
        }
    }, [navigate]);

    return (
        <>
            <Helmet>
                <title>Register Choice</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Welcome!</h1>
                        <p className="text-gray-400">Choose how you want to join our platform</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate("/register/developer")}
                            className="w-full group relative"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                            <div className="relative flex items-center gap-4 bg-[#1E293B] px-6 py-4 rounded-lg transition-all duration-200 hover:translate-y-[-2px]">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20">
                                    <Code className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-white">Developer Account</h3>
                                    <p className="text-gray-400 text-sm">Create and publish amazing projects</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="w-full group relative"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                            <div className="relative flex items-center gap-4 bg-[#1E293B] px-6 py-4 rounded-lg transition-all duration-200 hover:translate-y-[-2px]">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20">
                                    <User className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-white">User Account</h3>
                                    <p className="text-gray-400 text-sm">Discover and interact with projects</p>
                                </div>
                            </div>
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 text-gray-500 bg-[#0F172A]">Already have an account?</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-[#1E293B] hover:bg-[#2D3B4F] text-white px-6 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                        >
                            <LogIn className="w-5 h-5" />
                            <span>Sign in to your account</span>
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default RegisterChoice;
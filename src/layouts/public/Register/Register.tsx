import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, ShieldCheck, Facebook, Chrome, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterUserMutation } from "../../../features/user/usersSlice";
import { ADMIN_URL_BASE } from "../../../constants/api";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [register] = useRegisterUserMutation();

    const formik = useFormik({
        initialValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required("Full name is required"),
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("Confirm password is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const { confirmPassword, ...postData } = values;
                await register(postData).unwrap();
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success("Registered successfully! Please verify your email.");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } catch (err: any) {
                if (err?.data?.message) {
                    toast.error(err.data.message);
                } else {
                    toast.error("Registration failed. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (Cookies.get("token")) {
            navigate("/");
        }
    }, [navigate]);

    const formFields = [
        { name: "fullName", label: "Full Name", icon: <ShieldCheck size={20} /> },
        { name: "username", label: "Username", icon: <User size={20} /> },
        { name: "email", label: "Email", icon: <Mail size={20} />, type: "email" },
        { name: "password", label: "Password", icon: <Lock size={20} />, type: "password" },
        { name: "confirmPassword", label: "Confirm Password", icon: <Lock size={20} />, type: "password" },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join our amazing community</p>
                </div>

                <div className="bg-[#1E293B] rounded-xl shadow-xl p-6 backdrop-blur-lg border border-gray-700/50">
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {formFields.map(({ name, label, icon, type = "text" }) => (
                            <div key={name} className="group">
                                <label className="text-gray-300 text-sm font-medium mb-1 block">
                                    {label}
                                </label>
                                <div className={`
                                    flex items-center bg-[#2D3B4F] rounded-lg p-2 transition-all duration-200
                                    ${formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors] ? 'ring-2 ring-red-500/50' : 'focus-within:ring-2 focus-within:ring-blue-500/50'}
                                `}>
                                    <span className="text-gray-400 mx-2 group-focus-within:text-blue-400">
                                        {icon}
                                    </span>
                                    <input
                                        type={type}
                                        {...formik.getFieldProps(name)}
                                        className="w-full bg-transparent text-white outline-none px-2 py-1.5"
                                        placeholder={`Enter your ${label.toLowerCase()}`}
                                    />
                                </div>
                                {formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors] && (
                                    <p className="text-red-400 text-sm mt-1 ml-1">{formik.errors[name as keyof typeof formik.errors]}</p>
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg
                                ${loading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/20'
                                }
                                text-white flex items-center justify-center gap-2
                            `}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <User className="w-5 h-5" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700/50"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#1E293B] px-2 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
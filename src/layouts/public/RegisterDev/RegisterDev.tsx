import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, ShieldCheck, Building, Globe, CheckCircle, LogIn, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterDeveloperMutation } from "../../../features/user/usersSlice";
import { Helmet } from "react-helmet-async";


const DeveloperRegister = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [registerDeveloper] = useRegisterDeveloperMutation()
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            companyName: "",
            website: "",
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required("Full name is required"),
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("Confirm password is required"),
            companyName: Yup.string().required("Company name is required"),
            website: Yup.string().url("Invalid website URL").required("Website is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const { confirmPassword, ...postData } = values;
                await registerDeveloper(postData).unwrap();
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success("Registered successfully! Check your email for verification and wait for admin approval.");
                setSuccess(true);
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
        { name: "companyName", label: "Company Name", icon: <Building size={20} /> },
        { name: "website", label: "Website", icon: <Globe size={20} />, type: "url" },
    ];

    return (
        <>
            <Helmet>
                <title>Register Developer</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Developer Registration</h1>
                        <p className="text-gray-400">Join our platform as a developer</p>
                    </div>

                    <div className="bg-[#1E293B] rounded-xl shadow-xl p-6 backdrop-blur-lg border border-gray-700/50">
                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-semibold text-white mb-3">Registration Successful!</h2>
                                <p className="text-gray-400 mb-6">
                                    Please check your email for verification and wait for admin approval.
                                </p>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg transition duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Proceed to Login</span>
                                </button>
                            </div>
                        ) : (
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
                                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-blue-500/20'
                                        }
                                    text-white flex items-center justify-center gap-2
                                `}
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <User className="w-5 h-5" />
                                            Register as Developer
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

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
        </>
    );
};

export default DeveloperRegister;
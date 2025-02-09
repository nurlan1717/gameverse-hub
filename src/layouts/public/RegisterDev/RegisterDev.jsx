import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, ShieldCheck, Building, Globe, CheckCircle } from "lucide-react";
import { BASE_URL } from "../../../constants/api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const DeveloperRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
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
            setError("");

            try {
                const { confirmPassword, ...postData } = values;
                await axios.post(`${BASE_URL}/api/users/dev/register`, postData);
                setSuccess(true);
            } catch (err) {
                console.log(err);
                setError("Registration failed");
            } finally {
                setLoading(false);
            }
        },
    });


    useEffect(() => {
        if (Cookies.get("token")) {
            navigate("/");
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                {success ? (
                    <div className="text-center text-white">
                        <CheckCircle size={50} className="text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold">Verify Your Account And wait for the admin to approve it.</h2>
                        <p className="mt-2 text-gray-400">We've sent a verification link to your email.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-white text-2xl font-semibold text-center mb-4">Developer Registration</h2>
                        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {[...
                                [
                                    { name: "fullName", label: "Full Name", icon: <ShieldCheck size={20} /> },
                                    { name: "username", label: "Username", icon: <User size={20} /> },
                                    { name: "email", label: "Email", icon: <Mail size={20} />, type: "email" },
                                    { name: "password", label: "Password", icon: <Lock size={20} />, type: "password" },
                                    { name: "confirmPassword", label: "Confirm Password", icon: <Lock size={20} />, type: "password" },
                                    { name: "companyName", label: "Company Name", icon: <Building size={20} /> },
                                    { name: "website", label: "Website", icon: <Globe size={20} />, type: "url" },
                                ]
                            ].map(({ name, label, icon, type = "text" }) => (
                                <div key={name} className="relative">
                                    <label className="text-gray-300 block mb-1">{label}</label>
                                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                        <span className="text-gray-400 mx-2">{icon}</span>
                                        <input
                                            type={type}
                                            {...formik.getFieldProps(name)}
                                            className="w-full bg-transparent text-white outline-none px-2"
                                            placeholder={`Enter your ${label.toLowerCase()}`}
                                        />
                                    </div>
                                    {formik.touched[name] && formik.errors[name] && (
                                        <p className="text-red-400 text-sm mt-1">{formik.errors[name]}</p>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition duration-300 font-semibold shadow-md"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Register as Developer"}
                            </button>
                        </form>

                        <p className="text-gray-400 text-center mt-4 text-sm">
                            Have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
                        </p>
                    </>
                )}
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                toastStyle={{ backgroundColor: '#1F1F23', color: 'white' }}
            />
        </div>
    );
};

export default DeveloperRegister;

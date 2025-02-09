import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, ShieldCheck, Facebook, Chrome } from "lucide-react";
import { BASE_URL } from "../../../constants/api";
import { toast, ToastContainer } from "react-toastify"
import { useRegisterUserMutation } from "../../../features/user/usersSlice";


const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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
            setError("");

            try {
                const { confirmPassword, ...postData } = values;
                const response = await register({ postData }).unwrap();

                Cookies.set("token", response.data.token, { expires: 7 });
                Cookies.set("role", response.data.data.role, { expires: 7 });
                navigate("/home");
            } catch (err: any) {
                console.log(err);
                setError(err.message || "Registration failed");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleSocialLogin = async (provider: "google" | "facebook") => {
        try {
            window.location.href = `${BASE_URL}/auth/${provider}`;
        } catch (err: any) {
            console.log(err);
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");
        const role = queryParams.get("role");

        if (token && role) {
            Cookies.set("token", token, { expires: 7 });
            Cookies.set("role", role, { expires: 7 });

            navigate("/");
            toast.success("Login Successfully");
        }
        if (Cookies.get("token")) {
            navigate("/");
        }
    }, []);


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h2 className="text-white text-2xl font-semibold text-center mb-4">Create Account</h2>
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {[
                        { name: "fullName", label: "Full Name", icon: <ShieldCheck size={20} /> },
                        { name: "username", label: "Username", icon: <User size={20} /> },
                        { name: "email", label: "Email", icon: <Mail size={20} />, type: "email" },
                        { name: "password", label: "Password", icon: <Lock size={20} />, type: "password" },
                        { name: "confirmPassword", label: "Confirm Password", icon: <Lock size={20} />, type: "password" },
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
                            {formik.touched[name as keyof typeof formik.touched] &&
                                formik.errors[name as keyof typeof formik.errors] && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {formik.errors[name as keyof typeof formik.errors]}
                                    </p>
                                )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition duration-300 font-semibold shadow-md"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>

                <div className="flex justify-center gap-4 mt-4">
                    <button onClick={() => handleSocialLogin("google")} className="text-white bg-red-600 p-2 rounded-full">
                        <Chrome size={24} />
                    </button>
                    <button onClick={() => handleSocialLogin("facebook")} className="text-white bg-blue-600 p-2 rounded-full">
                        <Facebook size={24} />
                    </button>
                </div>

                <p className="text-gray-400 text-center mt-4 text-sm">
                    Have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
                </p>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                toastStyle={{ backgroundColor: '#1F1F23', color: 'white' }}
            />        </div>
    );
};

export default Register;

import { useEffect, useState } from 'react';
import { useForgotPasswordMutation, useGetUserByIdQuery, useResetPasswordMutation, useUpdatePasswordMutation } from '../../features/user/usersSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Key, ArrowLeft, RefreshCw } from 'lucide-react';
import Cookies from 'js-cookie';

const UserPassword = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [forgotPassword] = useForgotPasswordMutation();
    const [resetPassword] = useResetPasswordMutation();
    const [updatePassword] = useUpdatePasswordMutation();
    const id = Cookies.get("id");
    const { data: user } = useGetUserByIdQuery(id as string);

    useEffect(() => {
        setEmail(user.data.email)
    }, [])

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
        if (!token || !newPassword) {
            toast.error('Please enter both the token and new password.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await resetPassword({ token, password: newPassword });
            if ('data' in response && response.data?.message) {
                toast.success(response.data.message);
                setStep(1);
                setToken('');
                setNewPassword('');
            }
        } catch (error) {
            toast.error('Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error('Please enter both new password and confirm password.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await updatePassword({ oldPassword: oldPassword, password: newPassword, confirmPassword: confirmPassword });
            console.log(response);
            if ('data' in response && response.data?.message) {
                toast.success(response.data.message);
                setNewPassword('');
                setConfirmPassword('');
            } else if ('error' in response) {
                toast.error(response?.error?.data?.message || 'Failed to update password.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className=" bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    >
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900">Password Management</h1>
                    <p className="mt-2 text-gray-600">Secure your account with a strong password</p>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={slideVariants}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleForgotPassword}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <ClipLoader size={20} color="#ffffff" /> : (
                                    <>
                                        <Mail className="w-5 h-5 mr-2" />
                                        Send Reset Link
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    )}

                    {step === 2 && (
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
                                        className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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

                    {step === 3 && (
                        <motion.div
                            key="step3"
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
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Enter Old password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleUpdatePassword}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <ClipLoader size={20} color="#ffffff" /> : (
                                    <>
                                        <RefreshCw className="w-5 h-5 mr-2" />
                                        Update Password
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-4 text-center">
                    {step === 1 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setStep(3)}
                            className="text-sm text-indigo-600 hover:text-indigo-500 transition-all font-medium"
                        >
                            Update Password Instead?
                        </motion.button>
                    )}
                    {(step === 2 || step === 3) && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setStep(1)}
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 transition-all font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Go Back
                        </motion.button>
                    )}
                </div>
            </motion.div>
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
    );
};

export default UserPassword;
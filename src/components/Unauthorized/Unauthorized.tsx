import { motion } from 'framer-motion';
import { ShieldX, Lock, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1F1F23] to-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full backdrop-blur-lg bg-[#1F1F23]/80 rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-700/50 text-center"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative mb-8"
                >
                    <div className="inline-block p-4 bg-red-500/10 rounded-2xl mb-6">
                        <ShieldX className="w-16 h-16 text-red-400" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                            className="w-24 h-24 bg-red-500/5 rounded-full"
                        />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-4"
                >
                    Access Denied
                </motion.h1>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 text-gray-400 mb-6"
                >
                    <Lock className="w-4 h-4" />
                    <span>Unauthorized Access</span>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-400 mb-8 max-w-md mx-auto"
                >
                    Sorry, you don't have permission to access this page. Please make sure you're logged in with the appropriate credentials.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-xl bg-gray-700/50 text-white hover:bg-gray-700/70 transition duration-300 flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-red-500/20"
                    >
                        <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        Return Home
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 pt-8 border-t border-gray-700/50"
                >
                    <p className="text-sm text-gray-500">
                        If you believe this is a mistake, please contact support for assistance.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Unauthorized;
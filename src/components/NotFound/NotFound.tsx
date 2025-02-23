import { motion } from 'framer-motion';
import { Home, MoveLeft, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Not Found</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
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
                        className="relative mb-8 select-none"
                    >
                        <div className="text-[120px] md:text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 leading-none">
                            404
                        </div>
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.1, 1.1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-bold text-white/5 leading-none -z-10"
                        >
                            404
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-3xl font-bold text-white mb-4"
                    >
                        Page Not Found
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400 mb-8 max-w-md mx-auto"
                    >
                        Oops! The page you're looking for seems to have wandered off into the digital wilderness.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl bg-gray-700/50 text-white hover:bg-gray-700/70 transition duration-300 flex items-center justify-center gap-2 group"
                        >
                            <MoveLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                            Go Back
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 transition duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
                        >
                            <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            Home Page
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 rounded-xl bg-gray-700/50 text-white hover:bg-gray-700/70 transition duration-300 flex items-center justify-center gap-2 group"
                        >
                            <RefreshCcw className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                            Reload
                        </button>
                    </motion.div>
                </motion.div>
            </div></>
    );
};

export default NotFound;
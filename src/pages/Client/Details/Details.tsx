import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useGetGamesByIdQuery } from '../../../features/games/gamesSlice';
import { 
    useAddToBasketMutation, 
    useAddToLibraryMutation, 
    useAddToWishlistMutation, 
    useDeductBalanceMutation, 
    useGetBasketQuery, 
    useGetUserBalanceQuery 
} from '../../../features/user/usersSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Users, 
    Clock, 
    ShoppingCart, 
    Heart, 
    CreditCard,
    MonitorPlay,
    Cpu,
    CalendarDays,
    TrendingUp,
    X
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Details: React.FC = () => {
    const token = Cookies.get('token');
    const { id } = useParams<{ id: string }>();
    const { data: game, isLoading, isError } = useGetGamesByIdQuery(id);
    const [addToWishlist] = useAddToWishlistMutation();
    const [addToBasket] = useAddToBasketMutation();
    const { data: userBalance } = useGetUserBalanceQuery();
    const [deductBalance] = useDeductBalanceMutation();
    const [addToLibrary] = useAddToLibraryMutation();
    const { data: basketData } = useGetBasketQuery(undefined, { skip: !token });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1F1F23] to-black p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-8">
                        <div className="h-12 bg-gray-700/50 rounded-xl w-1/3" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="aspect-video bg-gray-700/50 rounded-xl" />
                            <div className="space-y-4">
                                <div className="h-48 bg-gray-700/50 rounded-xl" />
                                <div className="h-12 bg-gray-700/50 rounded-xl" />
                                <div className="space-y-2">
                                    <div className="h-12 bg-gray-700/50 rounded-xl" />
                                    <div className="h-12 bg-gray-700/50 rounded-xl" />
                                    <div className="h-12 bg-gray-700/50 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !game) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1F1F23] to-black flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <X className="w-16 h-16 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-white">Error Loading Game</h2>
                    <p className="text-gray-400">Failed to load game details. Please try again later.</p>
                </div>
            </div>
        );
    }

    const handleAuthCheck = () => {
        if (!token) {
            toast.error('Please login to perform this action');
            return false;
        }
        return true;
    };

    const isInBasket = (gameId: any) =>
        basketData?.data?.some((item: any) => item.gameId?._id === gameId);

    const handleAddToWishlist = async () => {
        if (!handleAuthCheck()) return;
        try {
            await addToWishlist({ gameId: game.data._id }).unwrap();
            toast.success('Added to wishlist successfully!');
        } catch (err: any) {
            if (err.data.message === "Game already in wishlist") {
                toast.error('This game is already in your wishlist');
                return;
            }
            toast.error('Failed to add to wishlist');
        }
    };

    const handleAddToBasket = async () => {
        if (!handleAuthCheck()) return;
        if (isInBasket(game.data._id)) {
            toast.error('This game is already in your basket')
            return;
        }
        try {
            await addToBasket({ gameId: game.data._id }).unwrap();
            toast.success('Added to basket successfully!');
        } catch (err: any) {
            toast.error('Failed to add to basket');
        }
    };

    const handleBuyNow = async () => {
        if (!handleAuthCheck()) return;
        if (!userBalance || userBalance.balance < game.data.price) {
            toast.error('Insufficient balance!');
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmPurchase = async () => {
        setShowConfirmModal(false);
        try {
            await addToLibrary({ gameId: game.data._id }).unwrap();
            await deductBalance({ amount: game.data.price }).unwrap();
            toast.success('Purchase successful! The game has been added to your library.');
        } catch (err: any) {
            if (err.data?.message === "Game already in library") {
                toast.error('Game already in library.');
                return;
            }
            toast.error('Failed to complete the purchase. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-[#101014] via-[#18181a] to-black py-12 px-4 md:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{game.data.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-300">
                        <div className="flex items-center gap-2">
                            <MonitorPlay className="w-5 h-5 text-indigo-400" />
                            <span>{game.data.platform}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span>{game.data.averageRating.toFixed(1)}/5.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <span>{game.data.players}k Players</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-400" />
                            <span>{game.data.playtime}h Playtime</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        {game.data.videoTrailerUrl ? (
                            <div className="aspect-video bg-[#1F1F23] rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={game.data.videoTrailerUrl}
                                    title="Game Trailer"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="aspect-video bg-[#1F1F23] rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50">
                                <img
                                    src={game.data.coverPhotoUrl}
                                    alt={game.data.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="backdrop-blur-lg bg-[#1F1F23]/80 rounded-2xl p-6 shadow-2xl border border-gray-700/50 h-fit"
                    >
                        <img
                            src={game.data.coverPhotoUrl}
                            alt={game.data.title}
                            className="w-full aspect-video object-cover rounded-xl mb-6 shadow-lg"
                        />
                        
                        {game.data.freeWeekly ? (
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl mb-6 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                                <Star className="w-5 h-5" />
                                <span className="font-semibold">Free This Week!</span>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-xl mb-6 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                                <CreditCard className="w-5 h-5" />
                                <span className="font-semibold">${game.data.price}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handleBuyNow}
                                className="w-full cursor-pointer px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-xl transition duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
                            >
                                <CreditCard className="w-5 h-5 cursor-pointer transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-semibold">Buy Now</span>
                            </button>
                            
                            <button
                                onClick={handleAddToBasket}
                                className="w-full px-6 py-4 cursor-pointer bg-[#2A2A2E] hover:bg-[#323236] text-white rounded-xl transition duration-300 flex items-center justify-center gap-2 group border border-gray-700/50"
                            >
                                <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-semibold">Add to Basket</span>
                            </button>
                            
                            <button
                                onClick={handleAddToWishlist}
                                className="w-full px-6 py-4 cursor-pointer bg-[#2A2A2E] hover:bg-[#323236] text-white rounded-xl transition duration-300 flex items-center justify-center gap-2 group border border-gray-700/50"
                            >
                                <Heart className="w-5 h-5 cursor-pointer transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-semibold">Add to Wishlist</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    <div className="backdrop-blur-lg bg-[#1F1F23]/80 rounded-2xl p-6 shadow-2xl border border-gray-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Cpu className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">System Requirements</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{game.data.systemRequirements}</p>
                    </div>

                    <div className="backdrop-blur-lg bg-[#1F1F23]/80 rounded-2xl p-6 shadow-2xl border border-gray-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <MonitorPlay className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Game Description</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6">{game.data.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#2A2A2E] rounded-xl p-4">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <CalendarDays className="w-4 h-4" />
                                    <span className="text-sm">Release Date</span>
                                </div>
                                <p className="text-white font-semibold">
                                    {new Date(game.data.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="bg-[#2A2A2E] rounded-xl p-4">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm">Total Sales</span>
                                </div>
                                <p className="text-white font-semibold">{game.data.sales} copies</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#1F1F23] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-700/50"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Confirm Purchase</h3>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to purchase {game.data.title} for ${game.data.price}?
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700/70 transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmPurchase}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition duration-300 shadow-lg shadow-indigo-500/20"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                theme="dark"
            />
        </motion.div>
    );
};

export default Details;
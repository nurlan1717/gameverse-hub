import { Link } from 'react-router-dom';
import { useGetBasketQuery, useRemoveFromBasketMutation, useClearBasketMutation, useGetUserBalanceQuery, useDeductBalanceMutation, useAddToLibraryMutation } from '../../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import { Modal } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, CreditCard, Tag, ArrowUpDown, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

type Game = {
    quantity: number;
    gameId: {
        _id: string;
        title: string;
        coverPhotoUrl: string;
        description: string;
        price: number;
    }
};

const BasketPage = () => {
    const {
        data: basketData,
        isLoading,
        isError,
        error: basketError,
        refetch
    } = useGetBasketQuery();

    const [removeFromBasket] = useRemoveFromBasketMutation();
    const [clearBasket] = useClearBasketMutation();
    const { data: userBalance } = useGetUserBalanceQuery();
    const [deductBalance] = useDeductBalanceMutation();
    const [addToLibrary] = useAddToLibraryMutation();

    const handleRemove = async (gameId: string) => {
        try {
            await removeFromBasket(gameId).unwrap();
            toast.success('Removed from basket successfully!');
            refetch();
        } catch (err) {
            console.error('Failed to remove item:', err);
        }
    };

    const handleClearBasket = async () => {
        try {
            await clearBasket().unwrap();
            toast.success('Cleared basket successfully!');
            refetch();
        } catch (err) {
            console.error('Failed to clear basket:', err);
        }
    };

    const confirmPurchase = () => {
        return new Promise<boolean>((resolve) => {
            Modal.confirm({
                title: 'Confirm Purchase',
                content: `Are you sure you want to purchase ${basketData?.data.length} games for $${totalPrice}?`,
                onOk: () => resolve(true),
                onCancel: () => resolve(false),
            });
        });
    };

    const handleBuyNow = async () => {
        if (!basketData?.data || basketData.data.length === 0) {
            toast.error('Your basket is empty!');
            return;
        }

        if (!userBalance || userBalance.balance < totalPrice) {
            toast.error('Insufficient balance!');
            return;
        }

        const isConfirmed = await confirmPurchase();
        if (!isConfirmed) return;

        try {
            for (const game of basketData.data) {
                await addToLibrary({ gameId: game.gameId._id }).unwrap();
            }
            await deductBalance({ amount: totalPrice }).unwrap();
            await clearBasket().unwrap();
            toast.success('Purchase successful! The games have been added to your library.');
            refetch();
        } catch (err: any) {
            if (err.data?.message === "Game already in library") {
                toast.error('One or more games are already in your library.');
                return;
            }
            if (err.data?.message === "Invalid amount") {
                toast.error('Invalid amount');
                return;
            }
            toast.error('Failed to complete the purchase. Please try again.');
        }
    };

    const totalPrice: number = basketData?.data?.reduce((sum: number, game: Game) => sum + game.gameId.price, 0) || 0;

    if (isLoading) return (
        <div className="bg-gradient-to-b from-[#101014] to-[#1a1a1f] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-[#1F1F23] rounded-xl w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23]/50 backdrop-blur-lg rounded-xl p-6">
                                <div className="flex gap-4">
                                    <div className="h-24 w-24 bg-[#2A2A2E] rounded-xl"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-[#2A2A2E] rounded-lg w-3/4 mb-2"></div>
                                        <div className="h-4 bg-[#2A2A2E] rounded-lg w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gradient-to-b from-[#101014] to-[#1a1a1f] flex items-center justify-center">
            <div className="bg-[#1F1F23]/80 backdrop-blur-lg p-8 rounded-xl text-center">
                <div className="text-red-500 text-xl font-medium mb-4">Oops! Something went wrong</div>
                <div className="text-gray-400">{JSON.stringify(basketError)}</div>
            </div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Basket</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-b from-[#101014] to-[#1a1a1f] min-h-screen py-12"
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-4xl font-bold text-white mb-4 md:mb-0 flex items-center gap-3"
                        >
                            <ShoppingCart size={32} className="text-[#26bbff]" />
                            My Basket
                        </motion.h1>

                        {basketData?.data?.length > 0 && (
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClearBasket}
                                className="flex cursor-pointer items-center gap-2 bg-red-600/90 backdrop-blur-lg text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all"
                            >
                                <Trash2 size={20} />
                                Clear Basket
                            </motion.button>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="w-full lg:w-2/3 space-y-4"
                        >
                            <AnimatePresence>
                                {basketData?.data?.map((game: Game) => (
                                    <motion.div
                                        key={game.gameId._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-[#1F1F23]/80 backdrop-blur-lg rounded-xl p-4 group"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <img
                                                src={game.gameId.coverPhotoUrl}
                                                alt={game.gameId.title}
                                                className="w-full sm:w-24 h-24 object-cover rounded-xl"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-white text-lg font-bold mb-1">{game.gameId.title}</h3>
                                                <p className="text-gray-400 text-sm line-clamp-2">{game.gameId.description}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-end gap-4">
                                                <span className="text-[#26bbff] text-2xl font-bold">${game.gameId.price}</span>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleRemove(game.gameId._id)}
                                                    className="bg-red-600/90 cursor-pointer text-white p-2 rounded-xl hover:bg-red-700 transition-all"
                                                >
                                                    <X size={20} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {(!basketData?.data || basketData.data.length === 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#1F1F23]/80 backdrop-blur-lg rounded-xl p-12 text-center"
                                >
                                    <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg mb-4">Your basket is empty</p>
                                    <Link
                                        to="/games"
                                        className="inline-flex items-center gap-2 bg-[#26bbff] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1da8ea] transition-colors"
                                    >
                                        Explore Games
                                        <ArrowUpDown size={18} />
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-full lg:w-1/3"
                        >
                            <div className="bg-[#1F1F23]/80 backdrop-blur-lg rounded-xl p-6 sticky top-4">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Tag size={24} className="text-[#26bbff]" />
                                    Order Summary
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="text-white">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Discount</span>
                                        <span className="text-[#26bbff]">-$0.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Tax</span>
                                        <span className="text-white">$0.00</span>
                                    </div>
                                    <div className="border-t border-[#2A2A2E] pt-4">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-white font-semibold">Total</span>
                                            <span className="text-[#26bbff] text-3xl font-bold">${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            className="w-full px-4 py-3 bg-[#2A2A2E] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                        />
                                        <button className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-[#26bbff] text-black px-4 py-1.5 rounded-lg hover:bg-[#1da8ea] transition-colors">
                                            Apply
                                        </button>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBuyNow}
                                        disabled={!basketData?.data?.length}
                                        className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CreditCard size={20} />
                                        Checkout Now
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    toastStyle={{
                        backgroundColor: '#1F1F23',
                        color: 'white',
                        borderRadius: '12px',
                        backdropFilter: 'blur(8px)',
                    }}
                />
            </motion.div>
        </>
    );
};

export default BasketPage;
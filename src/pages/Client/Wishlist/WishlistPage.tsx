import { Link } from 'react-router-dom';
import { useAddToBasketMutation, useGetBasketQuery, useGetWishlistQuery, useRemoveFromWishlistMutation } from '../../../features/user/usersSlice';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Filter, ArrowUpDown } from 'lucide-react';
import Cookies from 'js-cookie';

type Game = {
    _id: string;
    title: string;
    coverPhotoUrl: string;
    description: string;
    price: number;
    genre: string;
    platform: string;
};

const platformLogos: { [key: string]: string } = {
    PC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png',
    PlayStation: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/1280px-Playstation_logo_colour.svg.png',
    Xbox: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1280px-Xbox_one_logo.svg.png',
    Nintendo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/1280px-Nintendo.svg.png',
};

const token = Cookies.get('token');

const WishlistPage = () => {
    const {
        data: wishlistData,
        isLoading,
        isError,
        error: wishlistError,
        refetch
    } = useGetWishlistQuery();
    const { data: basketData } = useGetBasketQuery(undefined, { skip: !token });

    const [removeFromWishlist] = useRemoveFromWishlistMutation();
    const [addToBasket] = useAddToBasketMutation();

    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc'>('asc');
    const [showFilters, setShowFilters] = useState(false);

    const isInBasket = (gameId: any) =>
        basketData?.data?.some((item: any) => item.gameId?._id === gameId);

    const handleRemove = async (gameId: string) => {
        try {
            await removeFromWishlist(gameId).unwrap();
            toast.success('Removed from wishlist successfully!');
            refetch();
        } catch (err) {
            console.error('Failed to remove item:', err);
        }
    };

    const handleAuthCheck = () => {
        const token = Cookies.get('token');
        if (!token) {
            toast.error('Please login to perform this action');
            return false;
        }
        return true;
    };

    const handleAddToBasket = async (gameId: string) => {
        if (!handleAuthCheck()) return;
        if (isInBasket(gameId)) {
            toast.error('This game is already in your basket')
            return;
        }
        try {
            await addToBasket({ gameId }).unwrap();
            toast.success('Added to basket successfully!');
        } catch (err) {
            toast.error('Failed to add to basket');
        }
    };

    const filteredGames = wishlistData?.data
        ?.filter((game: Game) => {
            return (
                (selectedPlatform ? game.platform === selectedPlatform : true) &&
                (selectedGenre ? game.genre === selectedGenre : true)
            );
        })
        .sort((a: Game, b: Game) => {
            return sortByPrice === 'asc' ? a.price - b.price : b.price - a.price;
        });

    if (isLoading) return (
        <div className="bg-gradient-to-b from-[#101014] to-[#1a1a1f] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-[#1F1F23] rounded-xl w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23]/50 backdrop-blur-lg rounded-xl p-6">
                                <div className="h-48 bg-[#2A2A2E] rounded-xl mb-4"></div>
                                <div className="h-6 bg-[#2A2A2E] rounded-lg w-3/4 mb-4"></div>
                                <div className="h-4 bg-[#2A2A2E] rounded-lg w-full mb-4"></div>
                                <div className="h-10 bg-[#2A2A2E] rounded-lg w-1/2"></div>
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
                <div className="text-gray-400">{JSON.stringify(wishlistError)}</div>
            </div>
        </div>
    );

    return (
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
                        className="text-4xl font-bold text-white mb-4 md:mb-0"
                    >
                        My Wishlist <Heart className="inline-block ml-2 text-red-500" size={32} />
                    </motion.h1>
                    
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 bg-[#1F1F23]/80 backdrop-blur-lg text-white px-4 py-2 rounded-xl hover:bg-[#2A2A2E] transition-all"
                    >
                        <Filter size={20} />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </motion.button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-8"
                        >
                            <div className="bg-[#1F1F23]/80 backdrop-blur-lg p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
                                <select
                                    value={selectedPlatform}
                                    onChange={(e) => setSelectedPlatform(e.target.value)}
                                    className="bg-[#2A2A2E] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                >
                                    <option value="">All Platforms</option>
                                    <option value="PC">PC</option>
                                    <option value="PlayStation">PlayStation</option>
                                    <option value="Xbox">Xbox</option>
                                    <option value="Nintendo">Nintendo</option>
                                </select>
                                
                                <select
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    className="bg-[#2A2A2E] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                >
                                    <option value="">All Genres</option>
                                    <option value="Action">Action</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="RPG">RPG</option>
                                    <option value="FPS">FPS</option>
                                    <option value="Simulation">Simulation</option>
                                    <option value="Strategy">Strategy</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Horror">Horror</option>
                                    <option value="Puzzle">Puzzle</option>
                                    <option value="Idle">Idle</option>
                                </select>
                                
                                <select
                                    value={sortByPrice}
                                    onChange={(e) => setSortByPrice(e.target.value as 'asc' | 'desc')}
                                    className="bg-[#2A2A2E] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                >
                                    <option value="asc">Price: Low to High</option>
                                    <option value="desc">Price: High to Low</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredGames?.map((game: Game, index: number) => (
                            <motion.div
                                key={game._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#1F1F23]/80 backdrop-blur-lg rounded-xl overflow-hidden group"
                            >
                                <div className="relative">
                                    <img
                                        src={game.coverPhotoUrl}
                                        alt={game.title}
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <img
                                            src={platformLogos[game.platform]}
                                            alt={game.platform}
                                            className="w-8 h-8 object-contain bg-white/90 backdrop-blur-sm rounded-lg p-1"
                                        />
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-white text-xl font-bold mb-2">{game.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{game.description}</p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#26bbff] text-2xl font-bold">${game.price}</span>
                                        <div className="space-x-2 flex">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleAddToBasket(game._id)}
                                                className="bg-transparent text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-100 hover:text-black cursor-pointer transition-colors flex items-center gap-2"
                                            >
                                                <ShoppingCart size={18} />
                                                Add to Cart
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleRemove(game._id)}
                                                className="bg-red-600 text-white cursor-pointer px-4 py-2 rounded-xl font-medium hover:bg-red-700 transition-colors"
                                            >
                                                Remove
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredGames?.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1F1F23]/80 backdrop-blur-lg rounded-xl p-12 text-center mt-8"
                    >
                        <Heart size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-4">Your wishlist is empty</p>
                        <Link
                            to="/games"
                            className="inline-flex items-center gap-2 bg-[#26bbff] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1da8ea] transition-colors"
                        >
                            Explore Games
                            <ArrowUpDown size={18} />
                        </Link>
                    </motion.div>
                )}
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
    );
};

export default WishlistPage;
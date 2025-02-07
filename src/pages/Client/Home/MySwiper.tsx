import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import { useAddToWishlistMutation, useAddToBasketMutation } from '../../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import { useGetGamesQuery } from '../../../features/games/gamesSlice';

type Game = {
    _id: string;
    title: string;
    description: string;
    coverPhotoUrl: string;
    videoTrailerUrl: string;
    rating: number;
    price: number;
    genre: string;
    platform: string;
    systemRequirements: string;
    freeWeekly: boolean;
    approved: boolean;
    developerId: string;
    sales: number;
    createdAt: Date;
};

const platformIcons = {
    PC: "🎮",
    PlayStation: "🅟🅢",
    Xbox: "🅧",
    Nintendo: "🍄"
};

const MyGamesSlider = () => {
    const { data: gamesData, isLoading, isError } = useGetGamesQuery({ limit: 5 });
    const [addToWishlist] = useAddToWishlistMutation();
    const [addToBasket] = useAddToBasketMutation();

    const handleAddToWishlist = async (gameId: string) => {
        try {
            await addToWishlist({ gameId }).unwrap();
            toast.success('Added to wishlist successfully!');
        } catch (err) {
            toast.error('The game is on the wishlist.');
        }
    };

    const handleAddToBasket = async (gameId: string) => {
        try {
            await addToBasket({ gameId }).unwrap();
            toast.success('Added to basket successfully!');
        } catch (err) {
            toast.error('The game is on the basket.');
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">Failed to load games.</div>;

    return (
        <div className="relative">
            <Swiper
                navigation
                modules={[Navigation, Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="mySwiper"
                style={{ width: "60%", height: "500px" }}
            >
                {gamesData?.data?.map((game: Game) => (
                    <SwiperSlide key={game._id} className="relative group">
                        <img
                            src={game.coverPhotoUrl}
                            alt={game.title}
                            className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-white text-3xl font-bold">{game.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[#26bbff] font-medium">${game.price}</span>
                                        <span className="text-gray-400 text-sm">•</span>
                                        <span className="text-gray-300 text-sm">{game.genre}</span>
                                        <span className="text-xl">{platformIcons[game.platform as keyof typeof platformIcons]}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400 text-lg">★ {game.rating}</span>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{game.description}</p>

                            <div className="flex items-center justify-between">
                                <div className="text-gray-400 text-sm">
                                    Released: {new Date(game.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                    {game.freeWeekly ? (
                                        <span className="bg-green-600/90 text-white px-4 py-2 rounded-lg">
                                            Free Weekly
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToBasket(game._id)}
                                            className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition-all"
                                        >
                                            Buy Now
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleAddToWishlist(game._id)}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all"
                                    >
                                        ♡ Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default MyGamesSlider;
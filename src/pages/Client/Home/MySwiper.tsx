import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import {
    useAddToWishlistMutation,
    useAddToBasketMutation,
    useGetBasketQuery
} from '../../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import { useGetGamesQuery } from '../../../features/games/gamesSlice';
import Cookies from 'js-cookie';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type Game = {
    _id: string;
    title: string;
    description: string;
    coverPhotoUrl: string;
    price: number;
    genre: string;
    platform: string;
    averageRating: number;
    freeWeekly: boolean;
    createdAt: Date;
};

const platformIcons = {
    PC: "🎮",
    PlayStation: "🅟🅢",
    Xbox: "🅧",
    Nintendo: "🍄"
};
interface MyGamesSliderProps {
    games: any[];
}

const MyGamesSlider: React.FC<MyGamesSliderProps> = ({ games }) => {
    const token = Cookies.get('token');
    const { data: gamesData, isLoading, isError } = useGetGamesQuery({ limit: 5 });
    const { data: basketData } = useGetBasketQuery(undefined, { skip: !token });
    const [addToWishlist] = useAddToWishlistMutation();
    const [addToBasket] = useAddToBasketMutation();

    const filteredGames = gamesData?.data?.filter((game: any) => game.approved);


    const isInBasket = (gameId: string) =>
        basketData?.data?.some((item: any) => item.gameId?._id === gameId);

    const handleAuthCheck = () => {
        if (!token) {
            toast.error('Please login to perform this action');
            return false;
        }
        return true;
    };

    const handleAddToWishlist = async (gameId: string) => {
        if (!handleAuthCheck()) return;
        try {
            await addToWishlist({ gameId }).unwrap();
            toast.success('Added to wishlist successfully!');
        } catch (err: any) {
            if (err.data.message === "Game already in wishlist") {
                toast.error('This game is already in your wishlist');
                return;
            }
            toast.error('Failed to add to wishlist');
        }
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

    if (isError) return <div className="text-center py-8 text-red-500">Failed to load games.</div>;

    return (
        <div className="relative">
            <Swiper
                navigation
                modules={[Navigation, Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="mySwiper"
                style={{ width: window.innerWidth < 480 ? "auto" : "auto", height: window.innerWidth < 480 ? "360px" : "500px", }}
            >
                {isLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-[#1F1F23] rounded-lg overflow-hidden">
                                <Skeleton height={300} className="w-full" />
                                <div className="p-4">
                                    <Skeleton height={24} width="80%" />
                                    <Skeleton height={16} width="60%" className="mt-2" />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                    : filteredGames?.map((game: Game) => (
                        <SwiperSlide key={game._id} className="relative group rounded-lg overflow-hidden">
                            <img
                                src={game.coverPhotoUrl}
                                alt={game.title}
                                className="w-full h-auto md:h-full lg:h-auto object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold">{game.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[#26bbff] font-medium">${game.price}</span>
                                            <span className="text-gray-400 text-sm">•</span>
                                            <span className="text-gray-300 text-sm">{game.genre}</span>
                                            <span className="text-xl">{platformIcons[game.platform as keyof typeof platformIcons]}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400 text-lg">★ {game.averageRating}</span>
                                    </div>
                                </div>

                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{game.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="text-gray-400 text-sm">
                                        Released: {new Date(game.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2">
                                        {game.freeWeekly ? (
                                            <span className="bg-green-600/90 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base">
                                                Free Weekly
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleAddToBasket(game._id)}
                                                className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-black px-3 py-1 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base"
                                            >
                                                Buy Now
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleAddToWishlist(game._id)}
                                            className="bg-white/10 cursor-pointer hover:bg-white/20 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg backdrop-blur-sm transition-all text-sm md:text-base"
                                        >
                                            ♡ Wishlist
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                toastStyle={{ backgroundColor: '#1F1F23', color: 'white' }}
            />
        </div>
    );
};

export default MyGamesSlider;
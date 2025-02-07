import { Link } from 'react-router-dom';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../../../features/user/usersSlice';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

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

const WishlistPage = () => {
    const {
        data: wishlistData,
        isLoading,
        isError,
        error: wishlistError,
        refetch
    } = useGetWishlistQuery();

    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [sortByPrice, setSortByPrice] = useState<'asc' | 'desc'>('asc');

    const handleRemove = async (gameId: string) => {
        try {
            await removeFromWishlist(gameId).unwrap();
            toast.success('Removed from wishlist successfully!');
            refetch();
        } catch (err) {
            console.error('Failed to remove item:', err);
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
        <div className="bg-[#101014] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-[#1F1F23] rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23] rounded-lg p-4">
                                <div className="h-48 bg-[#2A2A2E] rounded-lg mb-4"></div>
                                <div className="h-6 bg-[#2A2A2E] rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-[#2A2A2E] rounded w-full mb-4"></div>
                                <div className="h-10 bg-[#2A2A2E] rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (isError) return <div className="text-center py-8 text-red-500">Error: {JSON.stringify(wishlistError)}</div>;

    return (
        <div className="bg-[#101014] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-white mb-6">My Wishlist</h1>

                <div className="flex flex-wrap gap-4 mb-6">
                    <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="bg-[#1F1F23] text-white px-4 py-2 rounded-lg focus:outline-none"
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
                        className="bg-[#1F1F23] text-white px-4 py-2 rounded-lg focus:outline-none"
                    >
                        <option value="">All Genres</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="RPG">RPG</option>
                        <option value="FPS">FPS</option>
                    </select>
                    <select
                        value={sortByPrice}
                        onChange={(e) => setSortByPrice(e.target.value as 'asc' | 'desc')}
                        className="bg-[#1F1F23] text-white px-4 py-2 rounded-lg focus:outline-none"
                    >
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                </div>

                <div className="bg-[#1F1F23] rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#2A2A2E]">
                                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Game</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Platform</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Genre</th>
                                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Price</th>
                                <th className="text-right py-4 px-6 text-gray-400 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGames?.map((game: Game) => (
                                <tr key={game._id} className="border-b border-[#2A2A2E]">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <img
                                                src={game.coverPhotoUrl}
                                                alt={game.title}
                                                className="w-16 h-16 object-cover rounded-lg mr-4"
                                            />
                                            <div>
                                                <h3 className="text-white text-lg font-semibold">{game.title}</h3>
                                                <p className="text-gray-400 text-sm">{game.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <img
                                            src={platformLogos[game.platform]}
                                            alt={game.platform}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </td>
                                    <td className="py-4 px-6 text-gray-400">{game.genre}</td>
                                    <td className="py-4 px-6 text-[#26bbff] text-lg">${game.price}</td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => handleRemove(game._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredGames?.length === 0 && (
                    <div className="text-gray-400 text-center mt-8">
                        Your wishlist is empty. <Link to="/games" className="text-[#26bbff] hover:underline">Explore games</Link>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default WishlistPage;
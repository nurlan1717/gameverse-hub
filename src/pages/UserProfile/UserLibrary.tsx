import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useGetUserByIdQuery } from '../../features/user/usersSlice';
import { useRateGameMutation } from '../../features/games/gamesSlice';
import { Download, Star } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRating from './StarRating';
import { Helmet } from 'react-helmet-async';

interface Game {
    _id: string;
    title: string;
    description: string;
    coverPhotoUrl: string;
    price: number;
    genre: string;
    fileUrl?: string;
    ratings?: { userId: string; rating: number }[];
    averageRating?: number;
}

function UserLibrary() {
    const id = Cookies.get('id') || '';
    const { data: user, isLoading, isError } = useGetUserByIdQuery(id);
    const [games, setGames] = useState<Game[]>([]);
    const [ratings, setRatings] = useState<{ [key: string]: number }>({});
    const [submittedRatings, setSubmittedRatings] = useState<{ [key: string]: boolean }>({});

    const [rateGame] = useRateGameMutation();

    useEffect(() => {
        if (user?.data?.library) {
            setGames(user.data.library);
            const initialRatings: { [key: string]: number } = {};
            const initialSubmittedRatings: { [key: string]: boolean } = {};
            user.data.library.forEach((game: any) => {
                const userRating = game.ratings?.find((r: any) => r.userId === id);
                if (userRating) {
                    initialRatings[game._id] = userRating.rating;
                    initialSubmittedRatings[game._id] = true;
                }
            });
            setRatings(initialRatings);
            setSubmittedRatings(initialSubmittedRatings);
        }
    }, [user, id]);

    const handleRatingChange = (gameId: string, rating: number) => {
        setRatings((prev) => ({ ...prev, [gameId]: rating }));
    };

    const submitRating = async (gameId: string) => {
        const rating = ratings[gameId];
        if (!rating || rating < 1 || rating > 5) {
            toast.error('Please enter a valid rating between 1 and 5.');
            return;
        }

        try {
            const updatedGame = await rateGame({ gameId, userId: id, rating }).unwrap();
            setGames((prevGames) =>
                prevGames.map((game) => (game._id === updatedGame._id ? updatedGame : game))
            );
            setSubmittedRatings((prev) => ({ ...prev, [gameId]: true }));
            toast.success('Rating submitted successfully!');
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Failed to submit rating. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 w-48 bg-gray-200 rounded"></div>
                    <div className="h-64 w-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p>Unable to fetch your library. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Library</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div className="min-h-screen bg-gray-50 p-6">
                <ToastContainer position="bottom-right" autoClose={3000} />

                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Your Game Library</h1>
                        <p className="mt-2 text-gray-600">Manage and rate your collection of games</p>
                    </header>

                    {games.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <p className="text-gray-600">Your library is empty. Start exploring games to add to your collection!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {games.map((game) => (
                                <div key={game._id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
                                    <div className="aspect-video w-full relative">
                                        <img
                                            src={game.coverPhotoUrl}
                                            alt={game.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/70 px-3 py-1 rounded-full">
                                            <p className="text-white text-sm font-medium">${game.price}</p>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-xl font-semibold text-gray-900">{game.title}</h2>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                                {game.genre}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Star className="w-5 h-5 text-yellow-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {game.averageRating ? `${game.averageRating.toFixed(1)} / 5.0` : 'Not rated'}
                                                    </span>
                                                </div>

                                                {game.fileUrl && (
                                                    <a
                                                        href={game.fileUrl}
                                                        download
                                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>Download</span>
                                                    </a>
                                                )}
                                            </div>

                                            <div className="pt-3 border-t">
                                                <div className="flex items-center justify-between">
                                                    <StarRating
                                                        rating={ratings[game._id] || 0}
                                                        onRatingChange={(rating) => handleRatingChange(game._id, rating)}
                                                        isDisabled={submittedRatings[game._id]}
                                                    />

                                                    {!submittedRatings[game._id] && (
                                                        <button
                                                            onClick={() => submitRating(game._id)}
                                                            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                                                        >
                                                            Rate
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserLibrary;
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useGetUserByIdQuery } from '../../features/user/usersSlice';
import { useRateGameMutation } from '../../features/games/gamesSlice';
import SkeletonLoading from './SkeletonLoading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRating from './StarRating';

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

const UserLibrary = () => {
    const id = Cookies.get('id') || '';
    const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetUserByIdQuery(id);
    const [games, setGames] = useState<Game[]>([]);
    const [ratings, setRatings] = useState<{ [key: string]: number }>({});
    const [submittedRatings, setSubmittedRatings] = useState<{ [key: string]: boolean }>({});

    const [rateGame] = useRateGameMutation();

    useEffect(() => {
        if (user?.data?.library) {
            setGames(user?.data?.library);
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

    if (isUserLoading) return <SkeletonLoading />;
    if (isUserError) return <p>Error fetching user data.</p>;

    return (
        <div className="bg-white w-full mx-auto min-h-screen p-10 flex justify-center">
            <ToastContainer position="bottom-right" autoClose={3000} />
            <div className="w-full max-w-6xl bg-gray-100 rounded-lg p-8 shadow-md">
                <h1 className="text-2xl font-semibold mb-6">User Library</h1>
                <p className="text-gray-600 mb-8">Here are the games in your library.</p>
                {games.length ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {games.map((game) => (
                                    <tr key={game._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={game.coverPhotoUrl}
                                                alt={game.title}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{game.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{game.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{game.genre}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">${game.price}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <StarRating
                                                rating={ratings[game._id] || 0}
                                                onRatingChange={(rating: any) => handleRatingChange(game._id, rating)}
                                                isDisabled={submittedRatings[game._id]}
                                            />
                                            {!submittedRatings[game._id] && (
                                                <button
                                                    onClick={() => submitRating(game._id)}
                                                    className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Submit Rating
                                                </button>
                                            )}
                                            <div className="mt-1">
                                                Average Rating: {game.averageRating ? game.averageRating.toFixed(1) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {game.fileUrl ? (
                                                <a
                                                    href={game.fileUrl}
                                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                                    download
                                                >
                                                    Download
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-500">No file available</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No games found in your library.</p>
                )}
            </div>
        </div>
    );
};

export default UserLibrary;
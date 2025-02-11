import Cookies from 'js-cookie';
import { useGetUserByIdQuery } from '../../features/user/usersSlice';
import { useState, useEffect } from "react";

interface Game {
    _id: string;
    title: string;
    description: string;
    coverPhotoUrl: string;
    price: number;
    genre: string;
}

const UserLibrary = () => {
    const id = Cookies.get('id') || '';
    const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetUserByIdQuery(id);
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        if (user?.data?.library) {
            setGames(user.data.library);
        }
    }, [user]);

    if (isUserLoading) return <p>Loading user data...</p>;
    if (isUserError) return <p>Error fetching user data.</p>;

    return (
        <div className="bg-white w-full mx-auto min-h-screen p-10 flex justify-center">
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
                                        <td className="px-6 py-4">
                                            <a
                                                href={`/download/${game._id}`} 
                                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Download
                                            </a>
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
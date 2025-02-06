import React, { useEffect, useState } from "react";
import axios from "axios";
import { Flame } from "lucide-react";
import { BASE_URL } from "../../../constants/api";
import Cookies from "js-cookie";
import { Game } from "../../../types/game";
import { useNavigate } from "react-router-dom";

const TrendingGames: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const token = Cookies.get("token");
                const response = await axios.get(`${BASE_URL}games?sort=sales-desc`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGames(response.data.data);
            } catch (err) {
                setError("Failed to fetch top selling games.");
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleGameClick = (gameId: string) => {
        navigate(`games/${gameId}`);
    };

    return (
        <section className="w-full py-10 bg-[#070320] text-white px-4 md:px-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">🔥 Top Selling Games</h2>
            </div>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : error ? (
                <p className="text-red-400">{error}</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <div
                            key={game._id}
                            className={`relative bg-[#12122a] rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ${
                                game.freeWeekly ? "border-4 border-green-500" : ""
                            }`}
                            onClick={() => handleGameClick(game._id)}
                        >
                            <img
                                src={game.coverPhotoUrl}
                                alt={game.title}
                                className="w-full h-44 object-cover"
                            />
                            <div className="p-3 text-center">
                                <p className="text-gray-300 text-sm flex items-center justify-center gap-1">
                                    <Flame size={16} className="text-red-500" /> {game.title}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">⭐ {game.rating} | 🛒 {game.sales} Sales</p>
                            </div>
                            {game.freeWeekly && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                    Free Weekly
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default TrendingGames;

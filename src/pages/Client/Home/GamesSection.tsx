import { useGetGamesQuery } from '../../../features/games/gamesSlice';
import { Game } from '../../../types/game';
import { Link } from 'react-router-dom';

const GamesSection = () => {
    const { data: salesGames } = useGetGamesQuery({ limit: 5, sort: 'sales-desc' });
    const { data: ratingGames } = useGetGamesQuery({ limit: 5, sort: 'rating-desc' });
    const { data: freeWeeklyGames } = useGetGamesQuery({ limit: 5, freeWeekly: true });

    const filteredSalesGames = salesGames?.data?.filter((game: Game) => game.approved);
    const filteredRatingGames = ratingGames?.data?.filter((game: Game) => game.approved);
    const filteredFreeWeeklyGames = freeWeeklyGames?.data?.filter((game: Game) => game.approved);

    const renderTableSection = (title: string, games: any, extraField?: string) => (
        <div className="flex-1 p-4 border-r border-[#2A2A2E] last:border-r-0">
            <h2 className="text-xl font-bold text-white mb-4 sticky top-0 bg-[#1F1F23] py-2">
                {title}
            </h2>
            <div className="space-y-4">
                {games?.map((game: Game) => (
                    <Link
                        to={`/games/${game._id}`}
                        key={game._id}
                        className="group flex items-center space-x-4 p-3 hover:bg-[#2A2A2E] rounded-lg transition-colors"
                    >
                        <img
                            src={game.coverPhotoUrl}
                            alt={game.title}
                            className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{game.title}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-[#26bbff] text-sm">
                                    ${game.price}
                                </p>
                                {extraField === 'sales' && (
                                    <span className="text-gray-400 text-sm">
                                        Sales: {game.sales}
                                    </span>
                                )}
                                {extraField === 'rating' && (
                                    <span className="text-yellow-400 text-sm">
                                        ★ {game.averageRating}
                                    </span>
                                )}
                                {extraField === 'free' && (
                                    <span className="text-green-500 text-sm">
                                        Free Weekly
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div className="bg-[#101014] min-h-screen py-8">
                <div className="container mx-auto px-4">

                    <div className="flex flex-col md:flex-row gap-4 bg-[#1F1F23] rounded-xl overflow-hidden">
                        {renderTableSection("Top Sales Games", filteredSalesGames, 'sales')}
                        {renderTableSection("Top Rated Games", filteredRatingGames, 'rating')}
                        {renderTableSection("Free Weekly Games", filteredFreeWeeklyGames, 'free')}
                    </div>
                    <div className='flex justify-center mt-8 text-center'>
                        <Link to="games" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-10 py-4.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            See All Games
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamesSection;
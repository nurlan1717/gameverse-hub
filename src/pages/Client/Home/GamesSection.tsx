import { useGetGamesQuery } from '../../../features/games/gamesSlice';
import { Game } from '../../../types/game';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Star, Gift } from 'lucide-react';

const GamesSection = () => {
    const { data: salesGames } = useGetGamesQuery({ limit: 5, sort: 'sales-desc' });
    const { data: ratingGames } = useGetGamesQuery({ limit: 5, sort: 'rating-desc' });
    const { data: freeWeeklyGames } = useGetGamesQuery({ limit: 5, freeWeekly: true });

    const filteredSalesGames = salesGames?.data?.filter((game: Game) => game.approved);
    const filteredRatingGames = ratingGames?.data?.filter((game: Game) => game.approved);
    const filteredFreeWeeklyGames = freeWeeklyGames?.data?.filter((game: Game) => game.approved);

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const gameCardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const renderTableSection = (title: string, games: any, extraField?: string, icon?: JSX.Element) => (
        <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 p-6 border-r border-gray-800 last:border-r-0"
        >
            <div className="flex items-center gap-2 mb-6 sticky top-0 bg-[#101014] p-3 rounded-2xl z-10">
                {icon}
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="space-y-4">
                {games?.map((game: Game, index: number) => (
                    <motion.div
                        key={game._id}
                        variants={gameCardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            to={`/games/${game._id}`}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all duration-300"
                        >
                            <div className="relative overflow-hidden rounded-lg">
                                <img
                                    src={game.coverPhotoUrl}
                                    alt={game.title}
                                    className="w-20 h-20 object-cover transform group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium text-lg truncate group-hover:text-[#26bbff] transition-colors duration-300">
                                    {game.title}
                                </h3>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#26bbff] font-medium">
                                            ${game.price}
                                        </span>
                                        {extraField === 'sales' && (
                                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                                <TrendingUp size={14} />
                                                {game.sales}
                                            </span>
                                        )}
                                        {extraField === 'rating' && (
                                            <span className="text-yellow-400 text-sm flex items-center gap-1">
                                                <Star size={14} className="fill-yellow-400" />
                                                {game.averageRating.toFixed(1)}
                                            </span>
                                        )}
                                        {extraField === 'free' && (
                                            <span className="text-green-400 text-sm px-2 py-1 rounded-full bg-green-400/10 flex items-center gap-1">
                                                <Gift size={14} />
                                                Free Weekly
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <div className="bg-[#101014] min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-6 bg-[#1A1A1E] rounded-2xl overflow-hidden shadow-2xl">
                    {renderTableSection("Top Sales", filteredSalesGames, 'sales', 
                        <TrendingUp className="text-[#26bbff]" size={24} />
                    )}
                    {renderTableSection("Top Rated", filteredRatingGames, 'rating',
                        <Star className="text-yellow-400" size={24} />
                    )}
                    {renderTableSection("Free Weekly", filteredFreeWeeklyGames, 'free',
                        <Gift className="text-green-400" size={24} />
                    )}
                </div>
                <motion.div 
                    className="flex justify-center mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link 
                        to="/games" 
                        className="group relative px-8 py-4 bg-[#26bbff] text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(38,187,255,0.3)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            See All Games
                            <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#26bbff] to-[#0095ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default GamesSection;
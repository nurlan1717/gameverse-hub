import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2, Search, SlidersHorizontal, Star, Users, Clock,
    ChevronDown, X, Sparkles
} from 'lucide-react';
import { useGetGamesQuery } from '../../../features/games/gamesSlice';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

type SortOption = 'popular' | 'newest' | 'rating' | 'alphabetical';

interface FilterState {
    search: string;
    genre: string;
    freeWeekly: boolean;
}

const ITEMS_PER_PAGE = 12;

const GENRES = [
    'All', 'Action', 'Adventure', 'RPG', "FPS", 'Strategy', 'Sports',
    'Simulation', 'Puzzle', 'Idle', 'Horror'
];

const GameCard = ({ game }: { game: any }) => {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group bg-gradient-to-b from-[#1F1F23] to-[#18181b] rounded-2xl overflow-hidden shadow-xl border border-gray-800/50 transition-all duration-300 hover:shadow-indigo-500/10 hover:border-indigo-500/50">
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={game.coverPhotoUrl}
                    alt={game.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                {game.freeWeekly && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        <span>Free This Week</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{game.title}</h3>
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{game.averageRating}/5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{game.players}k</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{game.playtime}h</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-[#2A2A2E] text-gray-300 text-sm rounded-full">
                        {game.genre}
                    </span>
                </div>
                <button
                    onClick={() => game._id && navigate(`${game._id}`)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 transform hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                >
                    Play Now
                </button>
            </div>
        </motion.div>
    );
};

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
            <div key={index} className="bg-[#1F1F23] rounded-2xl overflow-hidden animate-pulse border border-gray-800/50">
                <div className="aspect-video bg-gradient-to-r from-[#2A2A2E] to-[#1F1F23]" />
                <div className="p-6 space-y-4">
                    <div className="h-6 bg-gradient-to-r from-[#2A2A2E] to-[#1F1F23] rounded-lg w-3/4" />
                    <div className="flex gap-4">
                        <div className="h-4 bg-gradient-to-r from-[#2A2A2E] to-[#1F1F23] rounded-lg w-1/4" />
                        <div className="h-4 bg-gradient-to-r from-[#2A2A2E] to-[#1F1F23] rounded-lg w-1/4" />
                        <div className="h-4 bg-gradient-to-r from-[#2A2A2E] to-[#1F1F23] rounded-lg w-1/4" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-8 bg-gradient-to-r from-[#2A2A2E] to-[#1F1F23] rounded-full w-24" />
                    </div>
                    <div className="h-12 bg-gradient-to-r from-[#2A2A2E] to-[#1F1F23] rounded-xl" />
                </div>
            </div>
        ))}
    </div>
);

const Games = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState<SortOption>('popular');
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        genre: 'All',
        freeWeekly: false,
    });
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sort]);

    const { data: gamesResponse, isLoading, error } = useGetGamesQuery({
        limit: ITEMS_PER_PAGE * 3,
        sort,
        freeWeekly: filters.freeWeekly,
        genre: filters.genre === 'All' ? undefined : filters.genre,
    });

    const games = gamesResponse?.data || [];
    const filteredGames = games.filter((game: any) =>
        game.title.toLowerCase().includes(filters.search.toLowerCase())
    );

    const sortedGames = [...filteredGames].sort((a, b) => {
        switch (sort) {
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'rating':
                return b.averageRating - a.averageRating;
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'popular':
            default:
                return b.players - a.players;
        }
    });

    const totalPages = Math.ceil(sortedGames.length / ITEMS_PER_PAGE);
    const currentGames = sortedGames.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Helmet>
                <title>Games</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-[#0F0F13] via-[#151518] to-[#0F0F13] py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-block p-4 bg-indigo-500/10 rounded-2xl mb-6">
                            <Gamepad2 className="w-16 h-16 text-indigo-400" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6">
                            Game Library
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Discover and play amazing games from our extensive collection
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-12 space-y-4"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search games..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="w-full pl-12 pr-4 py-3 bg-[#1F1F23] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-gray-800/50 transition-all"
                                />
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                    className="px-6 py-3 bg-[#1F1F23] text-white rounded-xl flex items-center gap-3 border border-gray-800/50 hover:border-indigo-500/50 transition-all"
                                >
                                    <SlidersHorizontal className="w-5 h-5" />
                                    <span>Filters</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isFilterMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-72 bg-[#1F1F23] rounded-xl shadow-xl p-4 z-10 border border-gray-800/50"
                                        >
                                            <div className="mb-4">
                                                <label className="text-gray-400 text-sm mb-2 block">Sort by</label>
                                                <select
                                                    value={sort}
                                                    onChange={(e) => setSort(e.target.value as SortOption)}
                                                    className="w-full px-4 py-2.5 bg-[#2A2A2E] text-white rounded-lg border border-gray-700/50 focus:outline-none focus:border-indigo-500/50"
                                                >
                                                    <option value="popular">Most Popular</option>
                                                    <option value="newest">Newest</option>
                                                    <option value="rating">Highest Rated</option>
                                                    <option value="alphabetical">Alphabetical</option>
                                                </select>
                                            </div>

                                            <div className="mb-4">
                                                <label className="text-gray-400 text-sm mb-2 block">Genre</label>
                                                <select
                                                    value={filters.genre}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                                                    className="w-full px-4 py-2.5 bg-[#2A2A2E] text-white rounded-lg border border-gray-700/50 focus:outline-none focus:border-indigo-500/50"
                                                >
                                                    {GENRES.map(genre => (
                                                        <option key={genre} value={genre}>{genre}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="freeWeekly"
                                                    checked={filters.freeWeekly}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, freeWeekly: e.target.checked }))}
                                                    className="w-5 h-5 rounded-md bg-[#2A2A2E] border-gray-700 text-indigo-500 focus:ring-indigo-500/50"
                                                />
                                                <label htmlFor="freeWeekly" className="text-white cursor-pointer">Free This Week</label>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <AnimatePresence>
                            {(filters.genre !== 'All' || filters.freeWeekly || filters.search) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {filters.genre !== 'All' && (
                                        <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-sm flex items-center gap-2 border border-indigo-500/20">
                                            {filters.genre}
                                            <X
                                                className="w-4 h-4 cursor-pointer hover:text-indigo-300 transition-colors"
                                                onClick={() => setFilters(prev => ({ ...prev, genre: 'All' }))}
                                            />
                                        </span>
                                    )}
                                    {filters.freeWeekly && (
                                        <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-xl text-sm flex items-center gap-2 border border-green-500/20">
                                            Free This Week
                                            <X
                                                className="w-4 h-4 cursor-pointer hover:text-green-300 transition-colors"
                                                onClick={() => setFilters(prev => ({ ...prev, freeWeekly: false }))}
                                            />
                                        </span>
                                    )}
                                    {filters.search && (
                                        <span className="px-4 py-2 bg-gray-500/10 text-gray-400 rounded-xl text-sm flex items-center gap-2 border border-gray-500/20">
                                            Search: {filters.search}
                                            <X
                                                className="w-4 h-4 cursor-pointer hover:text-gray-300 transition-colors"
                                                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                            />
                                        </span>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <div className="text-center text-red-500 p-8 bg-red-500/10 rounded-2xl border border-red-500/20">
                            Failed to load games. Please try again later.
                        </div>
                    ) : currentGames?.length === 0 ? (
                        <div className="text-center text-gray-400 p-12 bg-gray-500/5 rounded-2xl border border-gray-500/10">
                            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-xl">No games found matching your criteria.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                                {currentGames?.map((game) => (
                                    <GameCard key={game._id} game={game} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-4 py-2 rounded-xl transition-all duration-300 ${currentPage === index + 1
                                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                                : 'bg-[#1F1F23] text-gray-400 hover:bg-[#2A2A2E] border border-gray-800/50 hover:border-indigo-500/50'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default Games;
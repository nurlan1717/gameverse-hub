import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Gamepad2, Search, SlidersHorizontal, Star, Users, Clock,
    ChevronDown, X, ArrowUpDown, Loader2
} from 'lucide-react';
import { useGetGamesQuery } from '../../../features/games/gamesSlice';
import { useNavigate } from 'react-router-dom';

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
            whileHover={{ scale: 1.02 }}
            className="bg-[#1F1F23] rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-video">
                <img
                    src={game.coverPhotoUrl}
                    alt={game.title}
                    className="w-full h-full object-cover"
                />
                {game.freeWeekly && (
                    <span className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                        Free This Week
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{game.averageRating}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{game.players} Players</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{game.playtime}h</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <span
                        className="px-2 py-1 bg-[#2A2A2E] text-gray-300 text-xs rounded-full"
                    >
                        {game.genre}
                    </span>
                </div>
                <button onClick={() => {
                    if (game._id) {
                        navigate(`${game._id}`);
                    }
                }} className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
                    Play Now
                </button>
            </div>
        </motion.div>
    );
};

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
            <div key={index} className="bg-[#1F1F23] rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-[#2A2A2E]" />
                <div className="p-4 space-y-4">
                    <div className="h-6 bg-[#2A2A2E] rounded w-3/4" />
                    <div className="flex gap-4">
                        <div className="h-4 bg-[#2A2A2E] rounded w-1/4" />
                        <div className="h-4 bg-[#2A2A2E] rounded w-1/4" />
                        <div className="h-4 bg-[#2A2A2E] rounded w-1/4" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-6 bg-[#2A2A2E] rounded w-16" />
                        <div className="h-6 bg-[#2A2A2E] rounded w-16" />
                    </div>
                    <div className="h-10 bg-[#2A2A2E] rounded" />
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

    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(filters.search.toLowerCase());
        return matchesSearch;
    });

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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#101014] py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Gamepad2 className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Game Library
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Discover and play amazing games from our extensive collection
                    </p>
                </div>

                <div className="mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search games..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 bg-[#1F1F23] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className="px-4 py-2 bg-[#1F1F23] text-white rounded-lg flex items-center gap-2"
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                                <span>Filters</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {isFilterMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-[#1F1F23] rounded-lg shadow-lg p-4 z-10">
                                    <div className="mb-4">
                                        <label className="text-gray-400 text-sm mb-2 block">Sort by</label>
                                        <select
                                            value={sort}
                                            onChange={(e) => setSort(e.target.value as SortOption)}
                                            className="w-full px-3 py-2 bg-[#2A2A2E] text-white rounded-lg"
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
                                            className="w-full px-3 py-2 bg-[#2A2A2E] text-white rounded-lg"
                                        >
                                            {GENRES.map(genre => (
                                                <option key={genre} value={genre}>{genre}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="freeWeekly"
                                            checked={filters.freeWeekly}
                                            onChange={(e) => setFilters(prev => ({ ...prev, freeWeekly: e.target.checked }))}
                                            className="w-4 h-4 bg-[#2A2A2E] rounded"
                                        />
                                        <label htmlFor="freeWeekly" className="text-white">Free This Week</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {(filters.genre !== 'All' || filters.freeWeekly || filters.search) && (
                        <div className="flex flex-wrap gap-2">
                            {filters.genre !== 'All' && (
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm flex items-center gap-1">
                                    {filters.genre}
                                    <X
                                        className="w-4 h-4 cursor-pointer"
                                        onClick={() => setFilters(prev => ({ ...prev, genre: 'All' }))}
                                    />
                                </span>
                            )}
                            {filters.freeWeekly && (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
                                    Free This Week
                                    <X
                                        className="w-4 h-4 cursor-pointer"
                                        onClick={() => setFilters(prev => ({ ...prev, freeWeekly: false }))}
                                    />
                                </span>
                            )}
                            {filters.search && (
                                <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm flex items-center gap-1">
                                    Search: {filters.search}
                                    <X
                                        className="w-4 h-4 cursor-pointer"
                                        onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                    />
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <LoadingSkeleton />
                ) : error ? (
                    <div className="text-center text-red-500 p-8">
                        Failed to load games. Please try again later.
                    </div>
                ) : currentGames?.length === 0 ? (
                    <div className="text-center text-gray-400 p-8">
                        No games found matching your criteria.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {currentGames?.map((game) => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${currentPage === index + 1
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-[#1F1F23] text-gray-400 hover:bg-[#2A2A2E]'
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
    );
};

export default Games;
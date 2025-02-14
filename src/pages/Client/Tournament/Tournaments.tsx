import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, AlertCircle } from 'lucide-react';
import { useGetActiveTournamentsQuery, useRegisterForTournamentMutation } from '../../../features/tournaments/tournamentSlice';
import { format } from 'date-fns';

const TournamentCard = ({ tournament }: { tournament: any }) => {
    const [registerForTournament, { isLoading: isRegistering }] = useRegisterForTournamentMutation();

    const handleRegister = async () => {
        try {
            await registerForTournament({ tournamentId: tournament._id });
        } catch (error) {
            console.error('Failed to register for tournament:', error);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#1F1F23] rounded-lg overflow-hidden shadow-lg">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
                        <p className="text-indigo-400">{tournament.game}</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-sm">
                        Active
                    </span>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Starts: {format(new Date(tournament.startDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Ends: {format(new Date(tournament.endDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{tournament.length} Participants</span>
                    </div>
                </div>

                <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 
            text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                    {isRegistering ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Registering...
                        </>
                    ) : (
                        'Register Now'
                    )}
                </button>
            </div>
        </motion.div>
    );
};

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#2A2A2E] rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-[#1F1F23] rounded-lg p-6">
                    <div className="space-y-4">
                        <div className="h-6 bg-[#2A2A2E] rounded w-3/4"></div>
                        <div className="h-4 bg-[#2A2A2E] rounded w-1/2"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-[#2A2A2E] rounded w-full"></div>
                            <div className="h-4 bg-[#2A2A2E] rounded w-full"></div>
                            <div className="h-4 bg-[#2A2A2E] rounded w-2/3"></div>
                        </div>
                        <div className="h-10 bg-[#2A2A2E] rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Tournaments = () => {
    const { data: tournaments, error, isLoading } = useGetActiveTournamentsQuery();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#101014] py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Trophy className="w-12 h-12 text-indigo-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Active Tournaments
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Join competitive tournaments and prove your skills against the best players
                    </p>
                </div>

                {isLoading ? (
                    <LoadingSkeleton />
                ) : error ? (
                    <div className="text-center text-red-500 p-8 bg-[#1F1F23] rounded-lg">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg">Failed to load tournaments. Please try again later.</p>
                    </div>
                ) : tournaments?.data?.length === 0 ? (
                    <div className="text-center text-gray-400 p-8 bg-[#1F1F23] rounded-lg">
                        <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                        <p className="text-lg">No active tournaments at the moment.</p>
                        <p>Check back later for new tournaments!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tournaments?.data?.map((tournament: any) => (
                            <TournamentCard key={tournament._id} tournament={tournament} />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Tournaments;
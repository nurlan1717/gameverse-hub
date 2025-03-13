import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, AlertCircle, X, ChevronRight, Shield, DollarSign } from 'lucide-react';
import { useGetActiveTournamentsQuery, useRegisterForTournamentMutation } from '../../../features/tournaments/tournamentSlice';
import { useGetTeamsQuery } from '../../../features/teams/teamsSlice';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import Cookies from "js-cookie";
import { Helmet } from 'react-helmet-async';

interface Team {
    _id: string;
    name: string;
    logo?: string;
    members: Array<{
        userId: string;
        role: string;
        _id: string;
    }>;
}

const TeamSelectionModal = ({
    isOpen,
    onClose,
    onSelectTeam,
    tournament,
    currentUserId
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelectTeam: (teamId: string) => void;
    tournament: any;
    currentUserId: string;
}) => {
    const { data: teams, isLoading } = useGetTeamsQuery({});
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');

    if (!isOpen) return null;

    const isTeamCaptain = (team: any) => {
        return team.members.some((member: any) =>
            member.userId._id === currentUserId && member.role === 'captain'
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1F1F23] rounded-xl p-6 w-full max-w-md relative border border-gray-800"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Select Team</h2>
                <p className="text-gray-400 mb-2">Choose a team to register for {tournament.name}</p>
                <p className="text-yellow-500 text-sm mb-6 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Only team captains can register for tournaments
                </p>

                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-[#2A2A2E] rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : teams?.data?.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">You don't have any teams yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {teams?.data?.map((team: Team) => {
                            const isCaptain = isTeamCaptain(team);
                            return (
                                <button
                                    key={team._id}
                                    onClick={() => isCaptain && setSelectedTeamId(team._id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${!isCaptain
                                        ? 'opacity-50 cursor-not-allowed bg-[#2A2A2E]'
                                        : selectedTeamId === team._id
                                            ? 'bg-indigo-500/20 border-indigo-500'
                                            : 'bg-[#2A2A2E] hover:bg-[#353539] border-transparent'
                                        } border`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#1F1F23] flex items-center justify-center overflow-hidden">
                                            {team.logo ? (
                                                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Trophy className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-white font-medium">{team.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-gray-400">
                                                    {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                                                </p>
                                                {!isCaptain && (
                                                    <span className="text-xs text-yellow-500">
                                                        (Not captain)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 transition-transform ${selectedTeamId === team._id ? 'text-indigo-400 rotate-90' : 'text-gray-400'
                                        }`} />
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#2A2A2E] text-gray-300 hover:bg-[#353539] px-6 py-2.5 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (selectedTeamId) {
                                onSelectTeam(selectedTeamId);
                                onClose();
                            }
                        }}
                        disabled={!selectedTeamId}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 
                                 hover:from-indigo-600 hover:to-indigo-700 disabled:from-gray-500 
                                 disabled:to-gray-600 disabled:cursor-not-allowed text-white 
                                 px-6 py-2.5 rounded-lg transition-all duration-300 font-medium"
                    >
                        Register Team
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const TournamentCard = ({ tournament, currentUserId }: { tournament: any; currentUserId: string }) => {
    const [registerForTournament, { isLoading: isRegistering }] = useRegisterForTournamentMutation();
    const [isTeamSelectionOpen, setIsTeamSelectionOpen] = useState(false);

    const handleRegister = async (teamId: string) => {
        try {
            await registerForTournament({
                tournamentId: tournament._id,
                teamId
            }).unwrap();

            toast.success('Successfully registered for the tournament!');
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to register for tournament';

            switch (errorMessage) {
                case 'Tournament not found':
                    toast.error('This tournament no longer exists');
                    break;
                case 'Team not found':
                    toast.error('Selected team not found. Please refresh and try again');
                    break;
                case 'Tournament is not open for registration':
                    toast.error('This tournament is no longer accepting registrations');
                    break;
                case 'Team is already registered':
                    toast.error('Your team is already registered for this tournament');
                    break;
                case 'Tournament is full':
                    toast.error('This tournament has reached its maximum team capacity');
                    break;
                default:
                    toast.error(errorMessage);
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-500/10 text-blue-500';
            case 'active':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    const isRegistrationOpen = tournament.status === 'upcoming' || tournament.status === 'active';
    const spotsLeft = tournament.maxTeams - tournament.registeredTeams.length;

    return (
        <>
            <Helmet>
                <title>Tournaments</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#1F1F23] rounded-lg overflow-hidden shadow-lg border border-gray-800 hover:border-gray-700 transition-colors"
            >
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={tournament.tournamentLogo || `https://source.unsplash.com/800x400/?${encodeURIComponent(tournament.game.toLowerCase())},gaming`}
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F23] via-transparent to-transparent" />
                    {tournament.prizePool > 0 && (
                        <div className="absolute top-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {tournament.prizePool.toLocaleString()}
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
                            <p className="text-indigo-400">{tournament.game}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(tournament.status)}`}>
                            {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
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
                            <span>
                                {tournament.registeredTeams.length} / {tournament.maxTeams} Teams
                                {spotsLeft > 0 && (
                                    <span className="text-indigo-400 ml-2">
                                        ({spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left)
                                    </span>
                                )}
                            </span>
                        </div>
                        {tournament.prizePool > 0 && (
                            <div className="flex items-center gap-2 text-gray-400">
                                <DollarSign className="w-4 h-4" />
                                <span>Prize Pool: ${tournament.prizePool.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsTeamSelectionOpen(true)}
                        disabled={isRegistering || !isRegistrationOpen || spotsLeft === 0}
                        className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 
                                 hover:from-indigo-600 hover:to-indigo-700 disabled:from-gray-500 
                                 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg 
                                 transition-all duration-300 flex items-center justify-center gap-2 
                                 shadow-lg"
                    >
                        {isRegistering ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Registering...
                            </>
                        ) : !isRegistrationOpen ? (
                            'Registration Closed'
                        ) : spotsLeft === 0 ? (
                            'Tournament Full'
                        ) : (
                            'Register Now'
                        )}
                    </button>
                </div>
            </motion.div>

            <TeamSelectionModal
                isOpen={isTeamSelectionOpen}
                onClose={() => setIsTeamSelectionOpen(false)}
                onSelectTeam={handleRegister}
                tournament={tournament}
                currentUserId={currentUserId}
            />
        </>
    );
};

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#2A2A2E] rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-[#1F1F23] rounded-lg overflow-hidden border border-gray-800">
                    <div className="h-48 bg-[#2A2A2E]"></div>
                    <div className="p-6 space-y-4">
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
    const { data: tournaments, error, isLoading } = useGetActiveTournamentsQuery()
    const id = Cookies.get("id") || '';
    const currentUserId = id;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-b from-[#101014] to-[#16161a] py-12"
        >
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
                    <div className="text-center p-8 bg-[#1F1F23] rounded-lg border border-red-500/20">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        <p className="text-lg text-white mb-2">Failed to load tournaments</p>
                        <p className="text-gray-400">Please try again later</p>
                    </div>
                ) : tournaments?.data?.length === 0 ? (
                    <div className="text-center p-8 bg-[#1F1F23] rounded-lg border border-gray-800">
                        <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                        <p className="text-lg text-white mb-2">No active tournaments</p>
                        <p className="text-gray-400">Check back later for new tournaments!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tournaments?.data?.map((tournament: any) => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </motion.div>
    );
};

export default Tournaments;
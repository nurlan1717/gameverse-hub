import { motion } from 'framer-motion';
import { Trophy, Flame, Gamepad2, Users, Zap, Crown, Calendar, Star, AlertCircle } from 'lucide-react';
import { useGetActiveTournamentsQuery } from '../../../features/tournaments/tournamentSlice';
import { format } from 'date-fns';

const SectionTitle = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="flex items-center gap-3 mb-8">
        <Icon className="w-8 h-8 text-indigo-500" />
        <h2 className="text-3xl font-bold text-white">{title}</h2>
    </div>
);

const StatCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#1F1F23] p-4 rounded-lg shadow-lg flex items-center gap-4">
        <div className="bg-indigo-500/10 p-2 rounded-lg">
            <Icon className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
            <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

const FeaturedGameCard = ({ game }: { game: any }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#1F1F23] rounded-lg overflow-hidden shadow-lg">
        <img src={game.image} alt={game.title} className="w-full h-32 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{game.description}</p>
        </div>
    </motion.div>
);

const TournamentCard = ({ tournament }: { tournament: any }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#1F1F23] p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-bold text-white mb-1">{tournament.name}</h3>
                <p className="text-sm text-gray-400">{tournament.game}</p>
            </div>
            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs">
                Active
            </span>
        </div>
        <div className="flex items-center gap-4 text-gray-400 mb-4">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{format(new Date(tournament.startDate), 'MMM dd')}</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{tournament.length} Players</span>
            </div>
        </div>
        <button className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm">
            Register Now
        </button>
    </motion.div>
);

const AchievementCard = ({ achievement }: { achievement: any }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#1F1F23] p-4 rounded-lg shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
            <h3 className="text-sm font-semibold text-white">{achievement.title}</h3>
            <p className="text-xs text-gray-400">{achievement.description}</p>
        </div>
    </motion.div>
);

const HomeSections = () => {
    const { data: tournaments, error: tournamentsError, isLoading: tournamentsLoading } = useGetActiveTournamentsQuery();

    const stats = [
        { icon: Users, title: 'Active Players', value: '2.5M+' },
        { icon: Gamepad2, title: 'Games Available', value: '500+' },
        { icon: Trophy, title: 'Tournaments', value: '1.2K+' },
        { icon: Star, title: 'Player Rating', value: '4.8/5' },
    ];

    const featuredGames = [
        {
            title: 'Cyber Warriors',
            genre: 'Action',
            description: 'Enter a futuristic battlefield where cybernetic warriors clash in epic battles.',
            players: '125K',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
        },
        {
            title: 'Mystic Realms',
            genre: 'RPG',
            description: 'Explore vast magical worlds filled with mythical creatures and ancient mysteries.',
            players: '89K',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
        },
        {
            title: 'Speed Racers',
            genre: 'Racing',
            description: 'Push your limits in high-speed races across stunning futuristic cityscapes.',
            players: '95K',
            image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
        },
    ];

    const achievements = [
        {
            title: 'Master Gamer',
            description: 'Complete 100 matches with a win rate above 75%',
        },
        {
            title: 'Tournament Champion',
            description: 'Win a major tournament with over 50 participants',
        },
        {
            title: 'Community Leader',
            description: 'Help 1000+ players improve their gaming skills',
        },
    ];

    return (
        <div className="space-y-16">
            <section>
                <SectionTitle title="Platform Statistics" icon={Zap} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </section>

            <section>
                <SectionTitle title="Featured Games" icon={Flame} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredGames.map((game, index) => (
                        <FeaturedGameCard key={index} game={game} />
                    ))}
                </div>
            </section>

            <section>
                <SectionTitle title="Live Tournaments" icon={Crown} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tournamentsLoading ? (
                        [...Array(3)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23] p-4 rounded-lg animate-pulse">
                                <div className="h-5 bg-[#2A2A2E] rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-[#2A2A2E] rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-[#2A2A2E] rounded w-full"></div>
                            </div>
                        ))
                    ) : tournamentsError ? (
                        <div className="col-span-3 text-center text-red-500 p-6 bg-[#1F1F23] rounded-lg">
                            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                            <p className="text-sm">Failed to load tournaments</p>
                        </div>
                    ) : tournaments?.data?.length === 0 ? (
                        <div className="col-span-3 text-center text-gray-400 p-6 bg-[#1F1F23] rounded-lg">
                            <Trophy className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                            <p className="text-sm">No active tournaments at the moment</p>
                        </div>
                    ) : (
                        tournaments?.data?.slice(0, 3).map((tournament: any) => (
                            <TournamentCard key={tournament._id} tournament={tournament} />
                        ))
                    )}
                </div>
            </section>

            <section>
                <SectionTitle title="Latest Achievements" icon={Trophy} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                        <AchievementCard key={index} achievement={achievement} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomeSections;    
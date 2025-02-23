import React from 'react';
import { motion } from 'framer-motion';
import {
    Gamepad2,
    Users,
    Trophy,
    MessageCircle,
    Globe,
    Shield,
    Headphones,
    Sparkles
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: {
    icon: React.ElementType;
    title: string;
    description: string;
}) => (
    <motion.div
        whileHover={{ scale: 1.05, rotate: 1 }}
        className="relative bg-[#1F1F23] rounded-xl p-8 overflow-hidden group"
    >
        {/* Arka plan efekti */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icon ve Başlık */}
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-500/10 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>

        {/* Açıklama */}
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

        {/* Alt çizgi efekti */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
);

const StatisticCard = ({ value, label }: { value: string; label: string }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-[#1F1F23] rounded-xl p-8 text-center relative overflow-hidden group"
    >
        {/* Arka plan efekti */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Değer ve Etiket */}
        <div className="text-4xl font-bold text-indigo-500 mb-2">{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>

        {/* Alt çizgi efekti */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
);

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#101014]"
        >
            <div className="relative h-[400px] mb-12">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
                        alt="GameVerse Hub"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101014] to-transparent" />
                </div>
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Welcome to GameVerse Hub
                        </h1>
                        <p className="text-xl text-gray-300">
                            Your ultimate destination for gaming communities, competitive tournaments, and endless entertainment
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            GameVerse Hub is dedicated to creating the ultimate gaming ecosystem where players can connect,
                            compete, and celebrate their passion for gaming. We're building a space where competitive spirit
                            meets community, and where every gamer can find their place to shine.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <StatisticCard value="100K+" label="Active Players" />
                    <StatisticCard value="500+" label="Active Tournaments" />
                    <StatisticCard value="1000+" label="Gaming Teams" />
                    <StatisticCard value="50K+" label="Daily Conversations" />
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Core Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Gamepad2}
                            title="Game Library"
                            description="Access a vast collection of games, complete with detailed information, reviews, and active player communities."
                        />
                        <FeatureCard
                            icon={Trophy}
                            title="Tournaments"
                            description="Participate in regular tournaments across multiple games with real prizes and recognition."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Team Building"
                            description="Find your perfect team or build your own. Connect with players who share your competitive spirit."
                        />
                        <FeatureCard
                            icon={MessageCircle}
                            title="Live Chat"
                            description="Real-time communication with team members, opponents, and the gaming community at large."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Global Community"
                            description="Connect with gamers from around the world, share experiences, and build lasting friendships."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Fair Play"
                            description="Advanced anti-cheat systems and moderation ensure a fair and enjoyable gaming environment."
                        />
                    </div>
                </div>

                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center"
                >
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to Join the GameVerse?
                    </h3>
                    <p className="text-gray-200 mb-6">
                        Begin your journey in the ultimate gaming community today.
                    </p>
                    <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Get Started
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default About;
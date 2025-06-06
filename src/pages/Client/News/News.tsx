import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Newspaper, TrendingUp, Star, Clock, X } from 'lucide-react';
import { useGetGameNewsQuery } from "../../../features/gamenews/gamenews";
import { Helmet } from 'react-helmet-async';

const NewsSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="pb-12">
        <div className="flex items-center gap-2 mb-6">
            <Icon className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        {children}
    </div>
);

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    image: string;
    date: string;
    category: string;
    description: string;
}

const NewsModal = ({ isOpen, onClose, title, image, date, category, description }: NewsModalProps) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-75"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[#1F1F23] rounded-xl overflow-hidden shadow-xl w-full max-w-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="relative h-64">
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F23] to-transparent" />
                    </div>
                    
                    <div className="p-6">
                        <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-500 bg-indigo-500/10 rounded-full mb-3">
                            {category}
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                        <div className="flex items-center text-gray-400 mb-4">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm">{format(new Date(date), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 leading-relaxed">{description}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const NewsCard = ({ title, image, date, category, description }: { 
    title: string; 
    image: string; 
    date: string; 
    category: string;
    description: string;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const truncatedDescription = description.length > 100 
        ? `${description.substring(0, 100)}...` 
        : description;

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#1F1F23] rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <img src={image} alt={title} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-500 bg-indigo-500/10 rounded-full mb-2">
                        {category}
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{truncatedDescription}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm">{format(new Date(date), 'MMM dd, yyyy')}</span>
                        </div>
                        {description.length > 100 && (
                            <span className="text-sm text-indigo-400 hover:text-indigo-300">Read more</span>
                        )}
                    </div>
                </div>
            </motion.div>

            <NewsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                image={image}
                date={date}
                category={category}
                description={description}
            />
        </>
    );
};

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#2A2A2E] rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-[#1F1F23] rounded-lg overflow-hidden">
                    <div className="h-48 bg-[#2A2A2E]"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-6 bg-[#2A2A2E] rounded w-1/4"></div>
                        <div className="h-4 bg-[#2A2A2E] rounded w-3/4"></div>
                        <div className="h-4 bg-[#2A2A2E] rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const News = () => {
    const { data: gameNews, error, isLoading } = useGetGameNewsQuery();

    if (error) {
        return (
            <div className="text-center text-red-500 p-8">
                Error loading news. Please try again later.
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>News</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen bg-[#101014]"
            >
                <div className="relative h-[400px] mb-12">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
                            alt="Gaming News Hero"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101014] to-transparent" />
                    </div>
                    <div className="relative container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Latest Gaming News
                            </h1>
                            <p className="text-xl text-gray-300">
                                Stay updated with the latest news from the gaming world
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <>
                            <NewsSection title="Breaking News" icon={Newspaper}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {gameNews?.breaking?.map((news: any) => (
                                        <NewsCard
                                            key={news._id}
                                            title={news.title}
                                            image={news.imageUrl}
                                            description={news.description}
                                            date={news.date}
                                            category="Breaking"
                                        />
                                    ))}
                                </div>
                            </NewsSection>

                            <NewsSection title="Trending" icon={TrendingUp}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {gameNews?.trending?.map((news: any) => (
                                        <NewsCard
                                            key={news.id}
                                            title={news.title}
                                            image={news.imageUrl}
                                            description={news.description}
                                            date={news.date}
                                            category="Trending"
                                        />
                                    ))}
                                </div>
                            </NewsSection>

                            <NewsSection title="Featured Stories" icon={Star}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {gameNews?.featured?.map((news: any) => (
                                        <NewsCard
                                            key={news.id}
                                            title={news.title}
                                            image={news.imageUrl}
                                            description={news.description}
                                            date={news.date}
                                            category="Featured"
                                        />
                                    ))}
                                </div>
                            </NewsSection>
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default News;
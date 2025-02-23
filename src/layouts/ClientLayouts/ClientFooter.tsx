import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientFooter = () => {
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <footer className="bg-[#121216] text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold bg-gradient-to-r from-[#26bbff] to-blue-600 bg-clip-text text-transparent">About GameVerse</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Your ultimate destination for gaming excellence. Join our community and experience gaming like never before.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { icon: Facebook, href: 'https://facebook.com' },
                                { icon: Twitter, href: 'https://twitter.com' },
                                { icon: Instagram, href: 'https://instagram.com' },
                                { icon: Linkedin, href: 'https://linkedin.com' },
                                { icon: Youtube, href: 'https://youtube.com' }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#1a1a1f] p-2 rounded-lg hover:bg-[#26bbff] group transition-colors duration-300"
                                    whileHover={{ y: -3 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'Games', path: '/games' },
                                { label: 'Tournaments', path: '/tournament' },
                                { label: 'About Us', path: '/about' },
                                { label: 'Teams', path: '/team' }
                            ].map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        to={link.path}
                                        className="text-gray-400 hover:text-[#26bbff] transition-colors duration-300 flex items-center group"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-[#26bbff] mt-1" />
                                <span className="text-gray-400">gameversehubaz@gmail.com</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-[#26bbff] mt-1" />
                                <span className="text-gray-400">+994 (55)496-06-33</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-[#26bbff] mt-1" />
                                <span className="text-gray-400">123 Gaming Street, Sumgait City, World</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold">Newsletter</h3>
                        <p className="text-gray-400">
                            Stay updated with our latest news and special offers.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-[#1a1a1f] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all duration-300"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#26bbff] text-white p-2 rounded-lg hover:bg-[#1f9fd8] transition-colors duration-300"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="border-t border-[#1a1a1f] mt-12 pt-8 text-center"
                >
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} GameVerse. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default ClientFooter;
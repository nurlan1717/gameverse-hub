import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const ClientFooter = () => {
    return (
        <footer className="bg-[#121216] text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">About Us</h3>
                        <p className="text-gray-400">
                            We are a platform dedicated to providing the best gaming experience. Join us and explore the world of games!
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <Facebook className="text-gray-400 hover:text-[#26bbff] transition duration-300" size={24} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <Twitter className="text-gray-400 hover:text-[#26bbff] transition duration-300" size={24} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Instagram className="text-gray-400 hover:text-[#26bbff] transition duration-300" size={24} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="text-gray-400 hover:text-[#26bbff] transition duration-300" size={24} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <Youtube className="text-gray-400 hover:text-[#26bbff] transition duration-300" size={24} />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-[#26bbff] transition duration-300">Home</Link>
                            </li>
                            <li>
                                <Link to="/games" className="text-gray-400 hover:text-[#26bbff] transition duration-300">Games</Link>
                            </li>
                            <li>
                                <Link to="/tournaments" className="text-gray-400 hover:text-[#26bbff] transition duration-300">Tournaments</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-[#26bbff] transition duration-300">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-[#26bbff] transition duration-300">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400">Email: gameversehubaz@gmail.com</li>
                            <li className="text-gray-400">Phone: +994 (55)496-06-33</li>
                            <li className="text-gray-400">Address: 123 Gaming Street, Sumgait City, World</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Newsletter</h3>
                        <p className="text-gray-400">
                            Subscribe to our newsletter to get the latest updates and offers.
                        </p>
                        <form className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-2 py-2 rounded-lg transition duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-[#2A2A2E] mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} GameStore. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default ClientFooter;
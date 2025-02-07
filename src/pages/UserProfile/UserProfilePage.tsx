import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';

type User = {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
    createdAt: string;
};

const UserProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get('token');
                const id = Cookies.get('id');
                const response = await axios.get(`${BASE_URL}users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.data);
            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!user) return <div className="text-center py-8">User not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-[#1F1F23] rounded-lg p-8">
                <div className="flex items-center mb-6">
                    <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mr-6"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Account Details</h2>
                    <div className="space-y-2">
                        <p className="text-gray-400">
                            <span className="font-medium">Joined:</span>{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <Link
                        to="/wishlist"
                        className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-6 py-2 rounded-lg transition duration-300"
                    >
                        View Wishlist
                    </Link>
                    <Link
                        to="/basket"
                        className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-6 py-2 rounded-lg transition duration-300"
                    >
                        View Basket
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
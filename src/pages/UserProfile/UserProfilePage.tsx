import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserInfoMutation } from '../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, ShoppingCart, Mail, Wallet, Badge, Calendar, Clock, X, Save, Edit2 } from 'lucide-react';

type User = {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    profileImage: string;
    balance: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
};

const UserProfilePage = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState('');
    const [updateUserInfo] = useUpdateUserInfoMutation();
    const id = Cookies.get('id') || '';
    const { data: user, isLoading, isError } = useGetUserByIdQuery(id);

    useEffect(() => {
        if (user) {
            setCurrentUser(user.data);
            setFormData({
                username: user.data.username,
                fullName: user.data.fullName,
                email: user.data.email,
            });
            setPreviewImage(user.data.profileImage);
        }
    }, [user]);

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const id = Cookies.get('id');
            if (!id) return toast.error('User ID not found.');

            const data = new FormData();
            data.append('username', formData.username);
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            if (selectedFile) data.append('profileImage', selectedFile);

            const response = await updateUserInfo({ id, data }).unwrap();
            setCurrentUser(response.data);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setSelectedFile(null);
        } catch (error) {
            toast.error('Failed to update profile.');
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#101014] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#26bbff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#101014] flex items-center justify-center">
                <div className="bg-[#1a1a1f] p-6 rounded-lg text-red-500">
                    Error loading profile. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 pt-12 pb-12 rounded-2xl">
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto bg-[#1a1a1f] rounded-2xl overflow-hidden shadow-xl"
                >
                    <div className="relative h-48 bg-gradient-to-r from-blue-600 to-[#26bbff]">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative"
                            >
                                <img
                                    src={isEditing ? previewImage : currentUser?.profileImage}
                                    alt="Profile"
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-4 border-[#1a1a1f] object-cover"
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-[#26bbff] p-2 rounded-lg cursor-pointer hover:bg-[#1f9fd8] transition-colors">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </label>
                                )}
                            </motion.div>
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    {isEditing ? (
                                        <motion.input
                                            key="edit-name"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="bg-transparent text-xl sm:text-2xl font-bold text-white border-b border-white/20 focus:border-white/50 outline-none w-full pb-1"
                                        />
                                    ) : (
                                        <motion.h1
                                            key="display-name"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-xl sm:text-2xl font-bold text-white"
                                        >
                                            {currentUser?.fullName}
                                        </motion.h1>
                                    )}
                                </AnimatePresence>
                                <p className="text-white/80">@{currentUser?.username}</p>
                            </div>
                            <button
                                onClick={handleEditToggle}
                                className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                                {isEditing ? (
                                    <>
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.form
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#2a2a2f] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#2a2a2f] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                            />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full bg-[#26bbff] hover:bg-[#1f9fd8] text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-[#26bbff]" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Email</p>
                                                <p className="text-white">{currentUser?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Wallet className="w-5 h-5 text-[#26bbff]" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Balance</p>
                                                <p className="text-white">${currentUser?.balance.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className="w-5 h-5 text-[#26bbff]" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Status</p>
                                                <p className={`${currentUser?.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                                                    {currentUser?.isVerified ? 'Verified Account' : 'Not Verified'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-[#26bbff]" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Joined</p>
                                                <p className="text-white">
                                                    {new Date(currentUser?.createdAt ?? '').toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-[#26bbff]" />
                                            <div>
                                                <p className="text-gray-400 text-sm">Last Updated</p>
                                                <p className="text-white">
                                                    {new Date(currentUser?.updatedAt ?? '').toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/wishlist"
                                className="flex-1 bg-[#2a2a2f] hover:bg-[#353539] text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Heart className="w-4 h-4" />
                                Wishlist
                            </Link>
                            <Link
                                to="/basket"
                                className="flex-1 bg-[#2a2a2f] hover:bg-[#353539] text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Shopping Cart
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                toastStyle={{ backgroundColor: '#1a1a1f', color: 'white' }}
            />
        </div>
    );
};

export default UserProfilePage;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserInfoMutation } from '../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

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
            toast.success('Profile updated!');
            setIsEditing(false);
            setSelectedFile(null);
        } catch (error) {
            toast.error('Update failed.');
            console.error(error);
        }
    };

    if (isLoading) return <div className='bg-white min-h-screen py-8 text-white'>Loading...</div>;
    if (isError) return <div className='bg-white min-h-screen py-8 text-white flex' >Error loading profile.</div>;

    return (
        <div className="bg-white min-h-screen py-2">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-gray-100 rounded-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-black">Profile</h1>
                        <button
                            onClick={handleEditToggle}
                            className="bg-[#26bbff] hover:bg-[#1f9fd8] text-black px-4 py-2 rounded-lg transition duration-300"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center space-x-6">
                                <img
                                    src={previewImage}
                                    alt="Profile Preview"
                                    className="w-24 h-24 rounded-full"
                                />
                                <input
                                    type="file"
                                    aria-describedby="file_input_help"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className='block w-1/2 py-2 px-2 text-sm text-gray-800 border bg-white rounded-lg cursor-pointer '
                                />
                            </div>
                            <div>
                                <label className="block mt-2 text-gray-800 mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full bg-white text-black px-4 py-2 rounded-lg focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block mt-2 text-gray-800 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full bg-white text-black px-4 py-2 rounded-lg focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block mt-2 text-gray-8 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-white text-black px-4 py-2 rounded-lg focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 mt-5 hover:bg-green-700 text-black px-6 py-2 rounded-lg transition duration-300"
                            >
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <img
                                    src={currentUser?.profileImage}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full"
                                />
                                <div>
                                    <h1 className="text-2xl font-bold text-black">{currentUser?.fullName}</h1>
                                    <p className="text-gray-800">@{currentUser?.username}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-gray-800">Email:</span>
                                    <p className="text-black">{currentUser?.email}</p>
                                </div>
                                <div>
                                    <span className="text-gray-800">Balance:</span>
                                    <p className="text-[#002f44]">${currentUser?.balance.toFixed(2)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-800">Status:</span>
                                    <p className={`${currentUser?.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                                        {currentUser?.isVerified ? 'Verified' : 'Not Verified'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-800">Joined:</span>
                                    <p className="text-black">{new Date(currentUser?.createdAt ?? '').toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="text-gray-800">Last Updated:</span>
                                    <p className="text-black">{new Date(currentUser?.updatedAt || '').toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex space-x-4">
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
            </div >
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                toastStyle={{ backgroundColor: '#1F1F23', color: 'white' }}
            />
        </div >
    );
};

export default UserProfilePage;
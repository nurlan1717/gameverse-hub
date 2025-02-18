import { useState } from 'react';
import {
    useGetTeamsQuery,
    useCreateTeamMutation,
    useAddMemberMutation,
    useRemoveMemberMutation,
    useDeleteTeamMutation,
} from '../../../features/teams/teamsSlice';
import { useGetUserByUsernameQuery } from '../../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
    Upload,
    X,
    Plus,
    UserPlus,
    UserMinus,
    Trophy,
    Trash2,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface Team {
    _id: string;
    name: string;
    description: string;
    logo?: string;
    members: Array<{
        userId: string;
        role: string;
        _id: string;
        joinedAt: string;
        userDetails?: {
            username: string;
            _id: string;
        };
    }>;
}

interface NewTeam {
    name: string;
    description: string;
    logo?: File;
}

const Teams = () => {
    const { data: teams, isLoading, error, refetch } = useGetTeamsQuery({});
    const [createTeam] = useCreateTeamMutation();
    const [addMember] = useAddMemberMutation();
    const [removeMember] = useRemoveMemberMutation();
    const [deleteTeam] = useDeleteTeamMutation();
    const navigate = useNavigate();
    const [newTeam, setNewTeam] = useState<NewTeam>({ name: '', description: '' });
    const [newMember, setNewMember] = useState<{ [key: string]: string }>({});
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<string | null>(null);

    const id = Cookies.get('id');
    const token = Cookies.get('token');

    const { data: userData, error: userError } = useGetUserByUsernameQuery(
        Object.values(newMember)[0] || '',
        {
            skip: !Object.values(newMember)[0],
        }
    );

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#101014]">
                <div className="bg-[#1F1F23] p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-white mb-2">Access Denied</h2>
                    <p className="text-gray-400 mb-6">You need to log in first to access this page.</p>
                    <button
                        onClick={() => navigate('/reg')}
                        className="w-full px-6 py-3 bg-[#26bbff] text-white rounded-lg shadow-md hover:bg-[#1f9fd8] transition-all duration-300 font-medium"
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            setNewTeam({ ...newTeam, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeam.name.trim() || !newTeam.description.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', newTeam.name.trim());
            formData.append('description', newTeam.description.trim());
            if (newTeam.logo) {
                formData.append('logo', newTeam.logo);
            }

            const resp = await createTeam(formData).unwrap();
            console.log(resp);
            toast.success('Team created successfully');
            setNewTeam({ name: '', description: '' });
            setPreviewLogo(null);
            setIsCreateTeamModalOpen(false);
            refetch();
        } catch (err: any) {
            if (err.data.message === 'A user can create a maximum of 5 teams') {
                return toast.error("A user can create a maximum of 6 teams")
            }
            toast.error('Error creating team');
        }
    };

    const handleAddMember = async (teamId: string) => {
        if (!newMember[teamId]?.trim()) {
            toast.error('Please enter a username');
            return;
        }

        if (userError) {
            toast.error('User not found');
            return;
        }

        if (!userData?._id) {
            toast.error('Invalid user data');
            return;
        }

        try {
            await addMember({ teamId, userId: userData._id }).unwrap();
            toast.success('Member added successfully');
            setNewMember({ ...newMember, [teamId]: '' });
            refetch();
        } catch (err) {
            toast.error('Error adding member');
        }
    };

    const handleRemoveMember = async (teamId: string, memberId: string) => {
        try {
            await removeMember({ teamId, memberId }).unwrap();
            toast.success('Member removed successfully');
            refetch();
        } catch (err) {
            toast.error('Error removing member');
        }
    };
    const handleDeleteTeam = async (id: string) => {
        try {
            const resp = await deleteTeam(id).unwrap();
            toast.success('Team deleted successfully');
            setIsConfirmDeleteOpen(null);
            refetch();
        } catch (err) {
            toast.error('Error deleting team');
        }
    };

    const isCaptain = (team: Team) => {
        return team.members.some(
            (member) => member.userId._id === id && member.role === 'captain'
        );
    };

    if (isLoading) {
        return (
            <div className="bg-[#101014] min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="h-8 w-32 bg-[#1F1F23] rounded-lg animate-pulse"></div>
                        <div className="h-10 w-32 bg-[#1F1F23] rounded-lg animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23] rounded-lg p-6 animate-pulse">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-[#2A2A2E] rounded-full mb-4"></div>
                                    <div className="h-6 w-32 bg-[#2A2A2E] rounded-lg mb-2"></div>
                                    <div className="h-4 w-48 bg-[#2A2A2E] rounded-lg mb-4"></div>
                                </div>
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-12 bg-[#2A2A2E] rounded-lg"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#101014]">
                <div className="text-center bg-[#1F1F23] p-8 rounded-lg max-w-md mx-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Error Loading Teams</h2>
                    <p className="text-gray-400 mb-6">There was a problem loading your teams. Please try again later.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-[#26bbff] text-white rounded-lg hover:bg-[#1f9fd8] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#101014] min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-[#26bbff]" />
                        My Teams
                    </h1>
                    <button
                        onClick={() => setIsCreateTeamModalOpen(true)}
                        className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Create Team
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams?.data?.map((team: Team) => (
                        <div key={team._id} className="bg-[#1F1F23] rounded-lg p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-[#2A2A2E] mb-4 overflow-hidden group relative">
                                    {team.logo ? (
                                        <img
                                            src={team.logo}
                                            alt={`${team.name} logo`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Trophy className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                                    <p className="text-gray-400 text-sm">{team.description}</p>
                                </div>
                            </div>

                            {isCaptain(team) && (
                                <>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Add member by username"
                                            className="flex-1 bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                            value={newMember[team._id] || ''}
                                            onChange={(e) => setNewMember({ ...newMember, [team._id]: e.target.value })}
                                        />
                                        <button
                                            onClick={() => handleAddMember(team._id)}
                                            className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white p-2 rounded-lg transition-colors"
                                            title="Add Member"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={() => setIsConfirmDeleteOpen(team._id)}
                                            className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Team
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                    Team Members
                                    <span className="text-sm text-gray-400">
                                        ({team.members.length})
                                    </span>
                                </h4>
                                {team.members.map((member) => (
                                    <div
                                        key={member._id}
                                        className="flex justify-between items-center bg-[#2A2A2E] p-3 rounded-lg hover:bg-[#353539] transition-colors"
                                    >
                                        <div>
                                            <span className="text-gray-300">
                                                {member.userDetails?.username || 'Unknown User'}
                                            </span>
                                            <span className={`text-sm ml-2 ${member.role === 'captain' ? 'text-[#26bbff]' : 'text-gray-500'
                                                }`}>
                                                ({member.role})
                                            </span>
                                        </div>
                                        {isCaptain(team) && member.role !== 'captain' && (
                                            <button
                                                onClick={() => handleRemoveMember(team._id, member.userDetails?._id || '')}
                                                className="text-red-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove Member"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {isCaptain(team) && (
                                <button
                                    onClick={() => navigate('/tournament')}
                                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <Trophy className="w-5 h-5" />
                                    Register for Tournament
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {isCreateTeamModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1F1F23] rounded-lg p-6 w-full max-w-md relative animate-fadeIn">
                        <button
                            onClick={() => {
                                setIsCreateTeamModalOpen(false);
                                setPreviewLogo(null);
                                setNewTeam({ name: '', description: '' });
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Team</h2>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-[#2A2A2E] flex items-center justify-center mb-4 overflow-hidden group relative">
                                    {previewLogo ? (
                                        <img
                                            src={previewLogo}
                                            alt="Team logo preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Upload className="w-8 h-8 text-gray-400" />
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <label className="cursor-pointer bg-[#2A2A2E] text-white px-4 py-2 rounded-lg hover:bg-[#353539] transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                    Upload Logo
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter team name"
                                    className="w-full bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                    maxLength={50}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Enter team description"
                                    className="w-full bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all min-h-[100px] resize-none"
                                    value={newTeam.description}
                                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                    maxLength={200}
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateTeamModalOpen(false);
                                        setPreviewLogo(null);
                                        setNewTeam({ name: '', description: '' });
                                    }}
                                    className="flex-1 bg-[#2A2A2E] text-white px-6 py-2.5 rounded-lg hover:bg-[#353539] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                                >
                                    Create Team
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isConfirmDeleteOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1F1F23] rounded-lg p-6 w-full max-w-md text-center animate-fadeIn">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Delete Team</h2>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this team? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsConfirmDeleteOpen(null)}
                                className="flex-1 bg-[#2A2A2E] text-white px-6 py-2.5 rounded-lg hover:bg-[#353539] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => isConfirmDeleteOpen && handleDeleteTeam(isConfirmDeleteOpen)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default Teams;
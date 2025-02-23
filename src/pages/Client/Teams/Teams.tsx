import React, { useState } from 'react';
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
    Users,
    ChevronRight
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
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#101014] to-[#16161a]">
                <div className="bg-[#1F1F23] p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4 border border-gray-800">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-white mb-2">Access Denied</h2>
                    <p className="text-gray-400 mb-6">You need to log in first to access this page.</p>
                    <button
                        onClick={() => navigate('/reg')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-[#26bbff] to-[#1f9fd8] text-white rounded-lg shadow-md hover:from-[#1f9fd8] hover:to-[#1885b7] transition-all duration-300 font-medium"
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewTeam({ ...newTeam, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateTeam = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newTeam.name);
            formData.append('description', newTeam.description);
            if (newTeam.logo) {
                formData.append('logo', newTeam.logo);
            }

            await createTeam(formData).unwrap();
            setIsCreateTeamModalOpen(false);
            setNewTeam({ name: '', description: '' });
            setPreviewLogo(null);
            toast.success('Team created successfully!');
        } catch (error) {
            toast.error('Failed to create team');
        }
    };

    const handleAddMember = async (teamId: string) => {
        if (!userData?.username) {
            toast.error('User not found');
            return;
        }

        try {
            await addMember({ teamId, userId: userData._id }).unwrap();
            setNewMember({ ...newMember, [teamId]: '' });
            toast.success('Member added successfully!');
        } catch (error) {
            console.log(error);
            toast.error('Failed to add member');
        }
    };

    const handleRemoveMember = async (teamId: string, userId: string) => {
        try {
            await removeMember({ teamId, userId }).unwrap();
            toast.success('Member removed successfully!');
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        try {
            await deleteTeam(teamId).unwrap();
            setIsConfirmDeleteOpen(null);
            toast.success('Team deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete team');
        }
    };
    const isCaptain = (team: any) => {
        return team.members.some((member: any) => member.userId._id === id && member.role === 'captain');
    };

    if (isLoading) {
        return (
            <div className="bg-gradient-to-b from-[#101014] to-[#16161a] min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="h-8 w-32 bg-[#1F1F23] rounded-lg animate-pulse"></div>
                        <div className="h-10 w-32 bg-[#1F1F23] rounded-lg animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23] rounded-xl p-6 animate-pulse border border-gray-800">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-16 h-16 bg-[#2A2A2E] rounded-xl"></div>
                                    <div className="flex-1">
                                        <div className="h-6 w-32 bg-[#2A2A2E] rounded-lg mb-2"></div>
                                        <div className="h-4 w-24 bg-[#2A2A2E] rounded-lg"></div>
                                    </div>
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#101014] to-[#16161a]">
                <div className="text-center bg-[#1F1F23] p-8 rounded-xl max-w-md mx-4 border border-gray-800">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Error Loading Teams</h2>
                    <p className="text-gray-400 mb-6">There was a problem loading your teams. Please try again later.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-gradient-to-r from-[#26bbff] to-[#1f9fd8] text-white rounded-lg hover:from-[#1f9fd8] hover:to-[#1885b7] transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-[#101014] to-[#16161a] min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-[#26bbff]" />
                        My Teams
                    </h1>
                    <button
                        onClick={() => setIsCreateTeamModalOpen(true)}
                        className="bg-gradient-to-r from-[#26bbff] to-[#1f9fd8] hover:from-[#1f9fd8] hover:to-[#1885b7] text-white px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Create Team
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams?.data?.map((team: Team) => (
                        <div
                            key={team._id}
                            className="bg-[#1F1F23] rounded-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-gray-700 group"
                        >
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 rounded-xl bg-[#2A2A2E] overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    {team.logo ? (
                                        <img
                                            src={team.logo}
                                            alt={`${team.name} logo`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Trophy className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#26bbff] transition-colors">
                                        {team.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">{team.description}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div
                                    className="bg-[#2A2A2E] p-4 rounded-lg cursor-pointer hover:bg-[#353539] transition-colors"
                                    onClick={() => setExpandedTeam(expandedTeam === team._id ? null : team._id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-[#26bbff]" />
                                            <span className="text-white font-medium">
                                                Team Members ({team.members.length})
                                            </span>
                                        </div>
                                        <ChevronRight
                                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedTeam === team._id ? 'rotate-90' : ''
                                                }`}
                                        />
                                    </div>
                                </div>

                                {expandedTeam === team._id && (
                                    <div className="space-y-2 animate-fadeIn">
                                        {isCaptain(team) && (
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
                                        )}

                                        {team.members.map((member) => (
                                            <div
                                                key={member._id}
                                                className="flex justify-between items-center bg-[#2A2A2E] p-3 rounded-lg hover:bg-[#353539] transition-colors group/member"
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
                                                        className="text-red-500 hover:text-red-400 p-1 opacity-0 group-hover/member:opacity-100 transition-opacity"
                                                        title="Remove Member"
                                                    >
                                                        <UserMinus className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isCaptain(team) && (
                                <div className="mt-4 space-y-2">
                                    <button
                                        onClick={() => navigate('/tournament')}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md"
                                    >
                                        <Trophy className="w-5 h-5" />
                                        Register for Tournament
                                    </button>
                                    <button
                                        onClick={() => setIsConfirmDeleteOpen(team._id)}
                                        className="w-full text-red-500 hover:text-red-400 py-2 flex items-center justify-center gap-1 text-sm transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Team
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Team Modal */}
            {isCreateTeamModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1F1F23] rounded-xl p-6 max-w-md w-full border border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Create New Team</h2>
                            <button
                                onClick={() => {
                                    setIsCreateTeamModalOpen(false);
                                    setNewTeam({ name: '', description: '' });
                                    setPreviewLogo(null);
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Team Name</label>
                                <input
                                    type="text"
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                    className="w-full bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all"
                                    placeholder="Enter team name"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={newTeam.description}
                                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                    className="w-full bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] transition-all resize-none"
                                    placeholder="Enter team description"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Team Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-[#2A2A2E] rounded-lg overflow-hidden flex items-center justify-center">
                                        {previewLogo ? (
                                            <img
                                                src={previewLogo}
                                                alt="Team logo preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Trophy className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="cursor-pointer">
                                            <div className="bg-[#2A2A2E] px-4 py-2 rounded-lg text-gray-300 hover:bg-[#353539] transition-colors flex items-center gap-2">
                                                <Upload className="w-5 h-5" />
                                                Upload Logo
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Recommended: 200x200px, PNG or JPG
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleCreateTeam}
                                disabled={!newTeam.name || !newTeam.description}
                                className="flex-1 bg-gradient-to-r from-[#26bbff] to-[#1f9fd8] hover:from-[#1f9fd8] hover:to-[#1885b7] text-white px-6 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                Create Team
                            </button>
                            <button
                                onClick={() => {
                                    setIsCreateTeamModalOpen(false);
                                    setNewTeam({ name: '', description: '' });
                                    setPreviewLogo(null);
                                }}
                                className="flex-1 bg-[#2A2A2E] text-gray-300 hover:bg-[#353539] px-6 py-2.5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isConfirmDeleteOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1F1F23] rounded-xl p-6 max-w-md w-full border border-gray-800">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Delete Team</h2>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete this team? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleDeleteTeam(isConfirmDeleteOpen)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setIsConfirmDeleteOpen(null)}
                                className="flex-1 bg-[#2A2A2E] text-gray-300 hover:bg-[#353539] px-6 py-2.5 rounded-lg transition-colors"
                            >
                                Cancel
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
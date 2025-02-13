import { useState } from 'react';
import {
    useGetTeamsQuery,
    useCreateTeamMutation,
    useAddMemberMutation,
    useRemoveMemberMutation,
} from '../../../features/teams/teamsSlice';
import { useGetUserByUsernameQuery } from '../../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, UserPlus, UserMinus, Trophy } from 'lucide-react';

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
    const navigate = useNavigate();
    const [newTeam, setNewTeam] = useState<NewTeam>({ name: '', description: '' });
    const [newMember, setNewMember] = useState<{ [key: string]: string }>({});
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
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
                <div className="bg-[#121216] p-8 rounded-2xl shadow-lg text-center">
                    <h2 className="text-2xl font-semibold text-gray-400">Access Denied</h2>
                    <p className="text-white mt-2">You need to log in first to access this page.</p>
                    <button
                        onClick={() => navigate('/reg')}
                        className="mt-4 px-6 py-2 bg-[#353539] cursor-pointer text-white rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300"
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
        try {
            const formData = new FormData();
            formData.append('name', newTeam.name);
            formData.append('description', newTeam.description);
            if (newTeam.logo) {
                formData.append('logo', newTeam.logo);
            }

            await createTeam(formData).unwrap();
            toast.success('Team created successfully');
            setNewTeam({ name: '', description: '' });
            setPreviewLogo(null);
            setIsCreateTeamModalOpen(false);
            refetch();
        } catch (err) {
            toast.error('Error creating team');
        }
    };

    const handleAddMember = async (teamId: string) => {
        if (!newMember[teamId]) {
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

    const isCaptain = (team: Team) => {
        const iscaptain = team.members.some((member) => {
            return member.userId._id === id && member.role === 'captain';
        });
        return iscaptain;
    };


    if (isLoading) {
        return (
            <div className="bg-[#101014] min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-end mb-8">
                        <div className="bg-[#1F1F23] h-10 w-32 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23] rounded-lg p-6">
                                <div className="h-16 w-16 bg-[#2A2A2E] rounded-full animate-pulse mb-4 mx-auto"></div>
                                <div className="h-6 w-32 bg-[#2A2A2E] rounded-lg animate-pulse mb-2 mx-auto"></div>
                                <div className="h-4 w-48 bg-[#2A2A2E] rounded-lg animate-pulse mb-4 mx-auto"></div>
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-12 w-full bg-[#2A2A2E] rounded-lg animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-[#101014]">
            <div className="text-red-500 bg-[#1F1F23] p-6 rounded-lg">
                Error loading teams. Please try again later.
            </div>
        </div>
    );

    return (
        <div className="bg-[#101014] min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Teams</h1>
                    <button
                        onClick={() => setIsCreateTeamModalOpen(true)}
                        className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create Team
                    </button>
                </div>

                {isCreateTeamModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#1F1F23] rounded-lg p-6 w-full max-w-md relative">
                            <button
                                onClick={() => {
                                    setIsCreateTeamModalOpen(false);
                                    setPreviewLogo(null);
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-white mb-6">Create New Team</h2>
                            <form onSubmit={handleCreateTeam} className="space-y-4">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-24 h-24 rounded-full bg-[#2A2A2E] flex items-center justify-center mb-4 overflow-hidden">
                                        {previewLogo ? (
                                            <img src={previewLogo} alt="Team logo preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload size={32} className="text-gray-400" />
                                        )}
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
                                <input
                                    type="text"
                                    placeholder="Team Name"
                                    className="w-full bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff]"
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                />
                                <textarea
                                    placeholder="Team Description"
                                    className="w-full bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff] min-h-[100px]"
                                    value={newTeam.description}
                                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Create Team
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams?.data?.map((team: Team) => (
                        <div key={team._id} className="bg-[#1F1F23] rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-[#2A2A2E] mb-4 overflow-hidden">
                                    {team.logo ? (
                                        <img src={team.logo} alt={`${team.name} logo`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Trophy size={32} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white text-center">{team.name}</h3>
                                <p className="text-gray-400 text-sm text-center mt-1">{team.description}</p>
                            </div>

                            {isCaptain(team) && (
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Add member by username"
                                        className="flex-1 bg-[#2A2A2E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26bbff]"
                                        value={newMember[team._id] || ''}
                                        onChange={(e) => setNewMember({ ...newMember, [team._id]: e.target.value })}
                                    />
                                    <button
                                        onClick={() => handleAddMember(team._id)}
                                        className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white p-2 rounded-lg"
                                        title="Add Member"
                                    >
                                        <UserPlus size={20} />
                                    </button>
                                </div>
                            )}

                            <div className="space-y-2">
                                <h4 className="text-white font-medium mb-3">Team Members</h4>
                                {team.members.map((member) => (
                                    <div key={member?.userDetails?._id} className="flex justify-between items-center bg-[#2A2A2E] p-3 rounded-lg">
                                        <div>
                                            <span className="text-gray-300">{member?.userDetails?.username || 'Unknown User'}</span>
                                            <span className={`text-sm ml-2 ${member.role === 'captain' ? 'text-[#26bbff]' : 'text-gray-500'}`}>
                                                ({member.role})
                                            </span>
                                        </div>
                                        {isCaptain(team) && member.role !== 'captain' && (
                                            <button
                                                onClick={() => handleRemoveMember(team._id, member?.userDetails?._id)}
                                                className="text-red-500 hover:text-red-400 p-1"
                                                title="Remove Member"
                                            >
                                                <UserMinus size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {isCaptain(team) && (
                                <button
                                    onClick={() => {/* useRegisterForTournamentMutation */ }}
                                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trophy size={20} />
                                    Register for Tournament
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Teams;
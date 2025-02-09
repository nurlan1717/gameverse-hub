import { useState } from 'react';
import {
    useFetchTeamsQuery,
    useCreateTeamMutation,
    useAddMemberMutation,
    useRemoveMemberMutation,
    useDeleteTeamMutation,
} from '../../../features/teams/teamsSlice';
import { useGetUserByIdQuery, useGetUserByUsernameQuery } from '../../../features/user/usersSlice';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface Team {
    _id: string;
    name: string;
    description: string;
    members: Array<{
        userId: string;
        role: string;
        _id: string;
        joinedAt: string;
    }>;
}

interface NewTeam {
    name: string;
    description: string;
}

const Teams = () => {
    const { data: teams, isLoading, error, refetch } = useFetchTeamsQuery();
    const [createTeam] = useCreateTeamMutation();
    const [addMember] = useAddMemberMutation();
    const [removeMember] = useRemoveMemberMutation();
    const [deleteTeam] = useDeleteTeamMutation();
    const navigate = useNavigate();

    const [newTeam, setNewTeam] = useState<NewTeam>({ name: '', description: '' });
    const [newMember, setNewMember] = useState<{ [key: string]: string }>({});
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const userId = Cookies.get('id');
    const token = Cookies.get('token');

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#101014]">
                <div className="bg-[#121216] p-8 rounded-2xl shadow-lg  text-center">
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
        )
    }

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTeam(newTeam).unwrap();
            toast.success('Team created successfully');
            setNewTeam({ name: '', description: '' });
            setIsCreateTeamModalOpen(false);
            refetch();
        } catch (err) {
            toast.error('Error creating team');
        }
    };

    const handleAddMember = async (teamId: string) => {
        if (!newMember[teamId]) return;

        const { data: user, error: userError } = await useGetUserByUsernameQuery(newMember[teamId]);
        console.log(user);
        if (userError) {
            toast.error('User not found');
            return;
        }

        try {
            await addMember({ teamId, userid: user.data._id }).unwrap();
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

    const handleDeleteTeam = async (teamId: string) => {
        try {
            await deleteTeam(teamId).unwrap();
            toast.success('Team deleted successfully');
            refetch();
        } catch (err) {
            toast.error('Error deleting team');
        }
    };

    const isCaptain = (team: Team) => {
        return team.members.some(member => member.userId === userId && member.role === 'captain');
    };

    const MemberName = ({ userId }: { userId: string }) => {
        const { data: user, isLoading, error } = useGetUserByIdQuery(userId);
        if (isLoading) return <span className="text-gray-300">Loading...</span>;
        if (error) return <span className="text-gray-300">Unknown User</span>;
        return <span className="text-gray-300">{user?.data?.username || 'Unknown User'}</span>;
    };

    if (isLoading) {
        return (
            <div className="bg-[#101014] min-h-screen p-8 mt-22">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-end mb-8">
                        <div className="bg-[#1F1F23] h-10 w-32 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="bg-[#1F1F23] rounded-lg p-6 mb-8">
                        <div className="h-8 w-48 bg-[#2A2A2E] rounded-lg animate-pulse mb-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-[#2A2A2E] p-4 rounded-lg">
                                    <div className="h-6 w-32 bg-[#1F1F23] rounded-lg animate-pulse mb-2"></div>
                                    <div className="h-4 w-24 bg-[#1F1F23] rounded-lg animate-pulse mb-2"></div>
                                    <div className="h-4 w-36 bg-[#1F1F23] rounded-lg animate-pulse mb-4"></div>
                                    <div className="h-10 w-full bg-[#1F1F23] rounded-lg animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23] rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="h-6 w-48 bg-[#2A2A2E] rounded-lg animate-pulse mb-2"></div>
                                        <div className="h-4 w-64 bg-[#2A2A2E] rounded-lg animate-pulse"></div>
                                    </div>
                                    <div className="h-6 w-6 bg-[#2A2A2E] rounded-lg animate-pulse"></div>
                                </div>
                                <div className="h-10 w-full bg-[#2A2A2E] rounded-lg animate-pulse mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-6 w-24 bg-[#2A2A2E] rounded-lg animate-pulse mb-2"></div>
                                    {[...Array(2)].map((_, i) => (
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

    if (error) return <div className="text-center py-8 text-red-500">Error loading teams</div>;

    return (
        <div className="bg-[#101014] min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-end mb-8">
                    <button
                        onClick={() => setIsCreateTeamModalOpen(true)}
                        className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Create Team
                    </button>
                </div>

                {isCreateTeamModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-[#1F1F23] rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold text-white mb-4">Create New Team</h2>
                            <form onSubmit={handleCreateTeam} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Team Name"
                                    className="flex-1 bg-[#2A2A2E] text-white px-4 py-2 rounded-lg"
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Team Description"
                                    className="flex-1 bg-[#2A2A2E] text-white px-4 py-2 rounded-lg"
                                    value={newTeam.description}
                                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateTeamModalOpen(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-[#1F1F23] rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Active Tournaments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-[#2A2A2E] p-4 rounded-lg">
                            <h3 className="text-xl font-bold text-white">Tournament Name</h3>
                            <p className="text-gray-400">Game: Example Game</p>
                            <p className="text-gray-400">Starts: 01/01/2023</p>
                            <button className="mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg w-full transition-colors">
                                Register
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams?.data?.map((team: Team) => (
                        <div key={team._id} className="bg-[#1F1F23] rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{team.name}</h3>
                                    <p className="text-gray-400 text-sm">{team.description}</p>
                                </div>
                                {isCaptain(team) && (
                                    <button
                                        onClick={() => handleDeleteTeam(team._id)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>

                            {isCaptain(team) && (
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="flex-1 bg-[#2A2A2E] text-white px-4 py-2 rounded-lg"
                                        value={newMember[team._id] || ''}
                                        onChange={(e) => setNewMember({ ...newMember, [team._id]: e.target.value })}
                                    />
                                    <button
                                        onClick={() => handleAddMember(team._id)}
                                        className="bg-[#26bbff] hover:bg-[#1f9fd8] text-white px-4 py-2 rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}

                            <div className="space-y-2">
                                <h4 className="text-white font-medium">Members:</h4>
                                {team.members.map((member) => (
                                    <div key={member._id} className="flex justify-between items-center bg-[#2A2A2E] p-3 rounded-lg">
                                        <div>
                                            <MemberName userId={member.userId} />
                                            <span className="text-gray-500 text-sm ml-2">({member.role})</span>
                                        </div>
                                        {isCaptain(team) && member.role !== 'captain' && (
                                            <button
                                                onClick={() => handleRemoveMember(team._id, member._id)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Tournament Registration Button (Only for Captains) */}
                            {isCaptain(team) && (
                                <button
                                    onClick={() => {/* useRegisterForTournamentMutation */ }}
                                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                                >
                                    Register for Tournament
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Teams;
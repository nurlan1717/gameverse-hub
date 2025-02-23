import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useGetUserByIdQuery } from "../../features/user/usersSlice";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Terminal, Send, Shield } from "lucide-react";

const socket = io("http://localhost:3000", {
    withCredentials: true,
    transports: ["websocket"],
});

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ text: string; user: { username: string; profileImage: string; role?: string } }[]>([]);
    const navigate = useNavigate();
    const userId = Cookies.get('id');
    const userRole = Cookies.get('role');
    const { data: user, isLoading, isError, refetch } = useGetUserByIdQuery(userId as string);

    useEffect(() => {
        socket.on("connect", () => {
            toast.success("Connected to chat server", {
                icon: <span role="img" aria-label="rocket">🚀</span>
            });
        });

        socket.on("disconnect", () => {
            toast.error("Disconnected from chat server", {
                icon: <span role="img" aria-label="danger">⚠️</span>
            });
        });

        socket.on("receiveMessage", (data: { text: string; user: { username: string; profileImage: string; role?: string } }) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("receiveMessage");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== "" && user?.data) {
            const messageData = {
                text: message,
                user: {
                    username: user.data.username,
                    profileImage: user.data.profileImage,
                    role: userRole
                },
            };
            socket.emit("sendMessage", messageData);
            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const SkeletonLoading = () => (
        <div className="w-full bg-[#1a1a1f] p-6 rounded-2xl shadow-xl">
            <div className="animate-pulse">
                <div className="h-10 bg-gray-800 rounded-lg mb-6"></div>
                <div className="h-[calc(100vh-300px)] bg-gray-800 rounded-lg mb-4"></div>
                <div className="flex gap-3">
                    <div className="flex-1 h-14 bg-gray-800 rounded-lg"></div>
                    <div className="w-24 h-14 bg-gray-800 rounded-lg"></div>
                </div>
            </div>
        </div>
    );

    const ErrorMessage = () => (
        <div className="w-full bg-[#1a1a1f] p-8 rounded-2xl shadow-xl text-center">
            <Terminal className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 text-lg mb-4">Failed to connect to the chat server</p>
            <button
                onClick={() => refetch()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
            >
                Retry Connection
            </button>
        </div>
    );

    const token = Cookies.get("token")
    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0f0f13]">
                <div className="bg-[#1a1a1f] p-10 rounded-2xl shadow-xl max-w-md w-full mx-4">
                    <Terminal className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white text-center mb-3">Access Denied</h2>
                    <p className="text-gray-400 text-center mb-6">Please log in to join the conversation</p>
                    <button
                        onClick={() => navigate('/reg')}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium"
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0f0f13] min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {isLoading ? (
                    <SkeletonLoading />
                ) : isError ? (
                    <ErrorMessage />
                ) : (
                    <div className="w-full bg-[#1a1a1f] p-6 rounded-2xl shadow-xl">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Terminal className="w-6 h-6 text-indigo-400" />
                            <h2 className="text-2xl font-bold text-white">Global Chat</h2>
                        </div>

                        <div className="h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar mb-6 px-4">
                            <ul className="space-y-4">
                                {messages.map((msg, index) => (
                                    <li
                                        key={index}
                                        className={`flex ${msg.user.username === user?.data?.username ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex items-start space-x-3 max-w-[80%] ${msg.user.username === user?.data?.username ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                                            <div className="relative">
                                                <img
                                                    src={msg.user.profileImage}
                                                    alt={msg.user.username}
                                                    className="w-10 h-10 rounded-full border-2 border-gray-700"
                                                />
                                                {msg.user.role === 'admin' && (
                                                    <Shield className="w-4 h-4 text-indigo-400 absolute -bottom-1 -right-1" />
                                                )}
                                            </div>
                                            <div className={`flex flex-col ${msg.user.username === user?.data?.username ? "items-end" : "items-start"}`}>
                                                <span className={`text-sm font-medium ${msg.user.role === 'admin' ? 'text-indigo-400' : 'text-gray-400'}`}>
                                                    {msg.user.username}
                                                </span>
                                                <div className={`mt-1 p-4 rounded-2xl ${msg.user.username === user?.data?.username
                                                    ? msg.user.role === 'admin'
                                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                        : 'bg-indigo-600 text-white'
                                                    : 'bg-[#252529] text-gray-100'
                                                    }`}>
                                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="w-full p-4 bg-[#252529] text-white rounded-xl border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-[60px] custom-scrollbar"
                                    style={{ minHeight: '60px', maxHeight: '120px' }}
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                className="h-[60px] px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1f] transition-all duration-300 flex items-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                <span className="hidden sm:inline">Send</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                toastStyle={{
                    backgroundColor: '#1a1a1f',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
            />
        </div>
    );
};

export default Chat;
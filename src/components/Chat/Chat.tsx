import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useGetUserByIdQuery } from "../../features/user/usersSlice";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000", {
    withCredentials: true,
    transports: ["websocket"],
});

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ text: string; user: { username: string; profileImage: string } }[]>([]);
    const navigate = useNavigate();
    const userId = Cookies.get('id');
    const { data: user, isLoading, isError, refetch } = useGetUserByIdQuery(userId as string);

    useEffect(() => {
        socket.on("connect", () => {
            toast.success("Connected Chat!");
        });

        socket.on("disconnect", () => {
            toast.success("Disconnected Chat!");
        });

        socket.on("receiveMessage", (data: { text: string; user: { username: string; profileImage: string } }) => {
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
                },
            };
            socket.emit("sendMessage", messageData);
            setMessage("");
        }
    };

    const SkeletonLoading = () => (
        <div className="w-full bg-[#121216] p-6 rounded-lg shadow-lg">
            <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded mb-6"></div>
                <div className="h-72 bg-gray-700 rounded mb-4"></div>
                <div className="flex gap-2">
                    <div className="flex-1 h-12 bg-gray-700 rounded"></div>
                    <div className="w-24 h-12 bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>
    );

    const ErrorMessage = () => (
        <div className="w-full bg-[#121216] p-6 rounded-lg shadow-lg text-center">
            <p className="text-red-500 mb-4">Failed to load chat. Please try again.</p>
            <button
                onClick={() => refetch()}
                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none"
            >
                Retry
            </button>
        </div>
    );

    const token = Cookies.get("token")
    if (!token) {
        return (
            <div>
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
            </div>
        )
    }

    return (
        <div className="bg-[#101014] min-h-screen pt-10">
            <div className="w-full md:w-3/5 mx-auto p-4">
                {isLoading ? (
                    <SkeletonLoading />
                ) : isError ? (
                    <ErrorMessage />
                ) : (
                    <div className="w-full bg-[#121216] p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold text-center text-white mb-6">Global Chat</h2>

                        <div className="w-full h-72 overflow-y-auto border-b-2 border-gray-700 mb-4">
                            <ul className="space-y-2">
                                {messages.map((msg, index) => (
                                    <li
                                        key={index}
                                        className={`flex ${msg.user.username === user?.data?.username ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex items-center space-x-2 max-w-[70%] p-3 rounded-lg ${msg.user.username === user?.data?.username ? "bg-indigo-600 text-white" : "bg-gray-700 text-white"}`}>
                                            {msg.user.username !== user?.data?.username && (
                                                <img src={msg.user.profileImage} alt={msg.user.username} className="w-8 h-8 rounded-full" />
                                            )}
                                            <div>
                                                {msg.user.username !== user?.data?.username && (
                                                    <span className="text-sm font-semibold">{msg.user.username}</span>
                                                )}
                                                <p className="text-sm">{msg.text}</p>
                                            </div>
                                            {msg.user.username === user?.data?.username && (
                                                <img src={msg.user.profileImage} alt={msg.user.username} className="w-8 h-8 rounded-full" />
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Message"
                                className="flex-1 p-3 bg-gray-700 text-white rounded-md border-2 border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                toastStyle={{ backgroundColor: '#1F1F23', color: 'white' }}
            />
        </div>
    );
};

export default Chat;
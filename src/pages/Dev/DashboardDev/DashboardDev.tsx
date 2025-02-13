import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Card, Statistic, Row, Col, Upload, Skeleton, Popconfirm } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { UserOutlined, MailOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Cookies from 'js-cookie';
import {
    useFetchGamesQuery,
    useCreateGameMutation,
    useUpdateGameMutation,
    useDeleteGameMutation,
    useUploadGameFileMutation,
} from "../../../features/games/gamesSlice";
import { useGetUserByIdQuery } from "../../../features/user/usersSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

interface Game {
    _id: string;
    title: string;
    averageRating: number;
    sales: number;
    developerId: string;
    price: number;
    description: string;
    approved: boolean;
}

interface GameFormValues {
    title: string;
    description: string;
    systemRequirements: string;
    videoTrailerUrl: string;
    coverPhotoUrl: File | null;
    price: number;
    genre: string;
    platform: string;
}

const DashboardDev = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [coverPhotoFileList, setCoverPhotoFileList] = useState<any[]>([]);
    const [exeFileList, setExeFileList] = useState<any[]>([]);
    const id = Cookies.get("id") as string;
    const { data: user, isLoading: userLoading, isError: userError } = useGetUserByIdQuery(id);
    const { data: gamesData, isLoading: gamesLoading, isError: gamesError } = useFetchGamesQuery();
    const [createGame, { isLoading: isCreating }] = useCreateGameMutation();
    const [updateGame, { isLoading: isUpdating }] = useUpdateGameMutation();
    const [deleteGame, { isLoading: isDeleting }] = useDeleteGameMutation();
    const [uploadGameFile, { isLoading: isUploading }] = useUploadGameFileMutation();
    const [form] = Form.useForm<GameFormValues>();

    const filteredGames: Game[] = gamesData?.data.filter((game: Game) => game.developerId === id);

    useEffect(() => {
        if (gamesData) {
            setGames(filteredGames);
        }
    }, [gamesData]);

    useEffect(() => {
        if (selectedGame) {
            form.setFieldsValue(selectedGame);
        }
    }, [selectedGame]);

    const handleAddGame = async (values: GameFormValues) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("systemRequirements", values.systemRequirements);
            formData.append("videoTrailerUrl", values.videoTrailerUrl);
            formData.append("price", values.price.toString());
            formData.append("genre", values.genre);
            formData.append("platform", values.platform);
            formData.append("developerId", id);

            if (values.coverPhotoUrl) {
                formData.append("coverPhotoUrl", values.coverPhotoUrl);
            }

            const createdGame = await createGame(formData).unwrap();
            if (exeFileList.length > 0) {
                const fileData = new FormData();
                fileData.append("file", exeFileList[0].originFileObj);
                await uploadGameFile({ gameId: createdGame.data._id, file: exeFileList[0].originFileObj }).unwrap();
            }

            setGames([...games, createdGame]);
            setIsModalVisible(false);
            form.resetFields();
            setCoverPhotoFileList([]);
            setExeFileList([]);
            toast.success("Game added successfully!");
        } catch (error) {
            console.error("Failed to create game:", error);
            toast.error("Failed to add game. Please try again.");
        }
    };

    const handleUpdateGame = async (values: GameFormValues) => {
        if (!selectedGame) return;
        const updatedGame = {
            ...selectedGame,
            ...values,
        };
        try {
            const result = await updateGame({ id: selectedGame._id, gameData: updatedGame }).unwrap();
            setGames(games.map((game) => (game._id === selectedGame._id ? { ...game, ...result } : game)));
            setIsUpdateModalVisible(false);
            toast.success("Game updated successfully!");
        } catch (error) {
            console.error("Failed to update game:", error);
            toast.error("Failed to update game. Please try again.");
        }
    };

    const handleDeleteGame = async (gameId: string) => {
        try {
            await deleteGame(gameId).unwrap();
            setGames(games.filter((game) => game._id !== gameId));
            toast.success("Game deleted successfully!");
        } catch (error) {
            console.error("Failed to delete game:", error);
            toast.error("Failed to delete game. Please try again.");
        }
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            responsive: ['sm'],
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            responsive: ['md'],
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `$${price}`,
            responsive: ['sm'],
        },
        {
            title: "Sales",
            dataIndex: "sales",
            key: "sales",
            responsive: ['md'],
        },
        {
            title: "Rating",
            dataIndex: "averageRating",
            key: "averageRating",
            responsive: ['lg'],
        },
        {
            title: "Status",
            dataIndex: "approved",
            key: "approved",
            render: (approved: boolean) => (
                <span className={approved ? 'text-green-500' : 'text-yellow-500'}>
                    {approved ? 'Approved' : 'Pending'}
                </span>
            ),
            responsive: ['sm'],
        },
        {
            title: "Actions",
            key: "actions",
            fixed: 'right',
            width: 100,
            render: (_: any, record: Game) => (
                <div className="flex space-x-2">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedGame(record);
                            setIsUpdateModalVisible(true);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this game?"
                        onConfirm={() => handleDeleteGame(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const salesData = games.map((game) => ({
        name: game.title,
        sales: game.sales,
    }));

    const ratingData = games.map((game) => ({
        name: game.title,
        rating: game.averageRating,
    }));

    const handleCoverPhotoChange = ({ fileList }: any) => {
        setCoverPhotoFileList(fileList);
        if (fileList.length > 0) {
            form.setFieldsValue({ coverPhotoUrl: fileList[0].originFileObj });
        }
    };

    const handleExeFileChange = ({ fileList }: any) => {
        setExeFileList(fileList);
        if (fileList.length > 0) {
            form.setFieldsValue({ fileUrl: fileList[0].originFileObj });
        }
    };

    if (userLoading || gamesLoading) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <Skeleton active />
            </div>
        );
    }

    if (userError || gamesError) {
        return (
            <div className="p-4 md:p-6 lg:p-8 text-center text-red-500">
                Error loading data
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-14 lg:px-12 py-28">
                <ToastContainer position="bottom-right" autoClose={3000} />
                
                {/* Profile Card */}
                <Card className="mb-6 shadow-md">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-shrink-0">
                            <UserOutlined className="text-4xl text-blue-500" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-semibold">{user?.data.username}</h2>
                            <p className="text-gray-600 flex items-center justify-center sm:justify-start space-x-2">
                                <MailOutlined />
                                <span>{user?.data.email}</span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="shadow-md">
                        <Statistic title="Total Games" value={games.length} />
                    </Card>
                    <Card className="shadow-md">
                        <Statistic 
                            title="Total Sales" 
                            value={games.reduce((acc, game) => acc + game.sales, 0)} 
                        />
                    </Card>
                    <Card className="shadow-md">
                        <Statistic
                            title="Total Revenue"
                            value={games.reduce((acc, game) => acc + game.sales * game.price, 0)}
                            prefix="$"
                        />
                    </Card>
                    <Card className="shadow-md">
                        <Statistic
                            title="Average Rating"
                            value={
                                games.length > 0
                                    ? (games.reduce((acc, game) => acc + game.averageRating, 0) / games.length).toFixed(1)
                                    : 0
                            }
                            suffix="/5"
                        />
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card title="Sales Over Time" className="shadow-md">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <Card title="Ratings" className="shadow-md">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ratingData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="rating" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <Card
                    title={
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <h2 className="text-xl font-semibold">Games</h2>
                            <Button 
                                type="primary" 
                                onClick={() => setIsModalVisible(true)}
                                className="w-full sm:w-auto"
                            >
                                Add New Game
                            </Button>
                        </div>
                    }
                    className="shadow-md"
                >
                    <div className="overflow-x-auto">
                        <Table
                            dataSource={games}
                            columns={columns}
                            rowKey="_id"
                            scroll={{ x: 'max-content' }}
                            pagination={{
                                responsive: true,
                                position: ['bottomCenter'],
                                showSizeChanger: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                className: 'px-4'
                            }}
                        />
                    </div>
                </Card>

                <Modal
                    title="Add New Game"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width="90%"
                    className="responsive-modal"
                >
                    <Form
                        form={form}
                        onFinish={handleAddGame}
                        layout="vertical"
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                        </div>

                        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="systemRequirements" label="System Requirements" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="videoTrailerUrl" label="Video Trailer URL" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="FPS">FPS</Option>
                                    <Option value="RPG">RPG</Option>
                                    <Option value="Action">Action</Option>
                                    <Option value="Adventure">Adventure</Option>
                                    <Option value="Simulation">Simulation</Option>
                                    <Option value="Strategy">Strategy</Option>
                                    <Option value="Sports">Sports</Option>
                                    <Option value="Horror">Horror</Option>
                                    <Option value="Puzzle">Puzzle</Option>
                                    <Option value="Idle">Idle</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="PC">PC</Option>
                                    <Option value="PlayStation">PlayStation</Option>
                                    <Option value="Xbox">Xbox</Option>
                                    <Option value="Nintendo">Nintendo</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="coverPhotoUrl"
                                label="Cover Photo"
                                rules={[{ required: true, message: "Please upload a cover photo!" }]}
                            >
                                <Upload
                                    beforeUpload={() => false}
                                    listType="picture-card"
                                    fileList={coverPhotoFileList}
                                    onChange={handleCoverPhotoChange}
                                    className="upload-list-inline"
                                >
                                    {coverPhotoFileList.length >= 1 ? null : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                name="fileUrl"
                                label="Game File (.exe)"
                                rules={[{ required: true, message: "Please upload a .exe file!" }]}
                            >
                                <Upload
                                    beforeUpload={() => false}
                                    listType="text"
                                    fileList={exeFileList}
                                    onChange={handleExeFileChange}
                                    className="upload-list-inline"
                                >
                                    {exeFileList.length >= 1 ? null : (
                                        <Button icon={<PlusOutlined />}>Upload Game File</Button>
                                    )}
                                </Upload>
                            </Form.Item>
                        </div>

                        <Form.Item className="flex justify-end">
                            <Button type="primary" htmlType="submit" loading={isCreating}>
                                Add Game
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Update Game"
                    open={isUpdateModalVisible}
                    onCancel={() => setIsUpdateModalVisible(false)}
                    footer={null}
                    width="90%"
                    className="responsive-modal"
                >
                    <Form
                        form={form}
                        initialValues={selectedGame || {}}
                        onFinish={handleUpdateGame}
                        layout="vertical"
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                        </div>

                        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="systemRequirements" label="System Requirements" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="videoTrailerUrl" label="Video Trailer URL" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="FPS">FPS</Option>
                                    <Option value="RPG">RPG</Option>
                                    <Option value="Action">Action</Option>
                                    <Option value="Adventure">Adventure</Option>
                                    <Option value="Simulation">Simulation</Option>
                                    <Option value="Strategy">Strategy</Option>
                                    <Option value="Sports">Sports</Option>
                                    <Option value="Horror">Horror</Option>
                                    <Option value="Puzzle">Puzzle</Option>
                                    <Option value="Idle">Idle</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="PC">PC</Option>
                                    <Option value="PlayStation">PlayStation</Option>
                                    <Option value="Xbox">Xbox</Option>
                                    <Option value="Nintendo">Nintendo</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item className="flex justify-end">
                            <Button type="primary" htmlType="submit" loading={isUpdating}>
                                Update Game
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <style jsx global>{`
                    .responsive-modal {
                        max-width: 90vw !important;
                    }
                    
                    @media (min-width: 768px) {
                        .responsive-modal {
                            max-width: 800px !important;
                        }
                    }
                    
                    .upload-list-inline .ant-upload-list-item {
                        margin-top: 8px;
                    }
                    
                    .ant-table {
                        overflow-x: auto;
                    }

                    @media (max-width: 640px) {
                        .ant-table-cell {
                            padding: 8px !important;
                        }
                        
                        .ant-card-head-title {
                            padding: 12px 0 !important;
                        }
                        
                        .ant-statistic-title {
                            font-size: 14px !important;
                        }
                        
                        .ant-statistic-content {
                            font-size: 20px !important;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default DashboardDev;
import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Card, Statistic, Row, Col, Upload, Skeleton, Popconfirm } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
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
            console.log(createdGame);
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
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `$${price}`,
        },
        {
            title: "Sales",
            dataIndex: "sales",
            key: "sales",
        },
        {
            title: "Rating",
            dataIndex: "averageRating",
            key: "averageRating",
        },
        {
            title: "Status",
            dataIndex: "approved",
            key: "approved",
            render: (approved: boolean) => (approved ? "Approved" : "Pending"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Game) => (
                <div key={record._id}>
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
            <div className="p-6">
                <Skeleton active />
            </div>
        );
    }

    if (userError || gamesError) {
        return <div>Error loading data</div>;
    }

    return (
        <div className="py-30 px-6 bg-gray-100 min-h-screen">
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Card className="mb-6">
                <div className="flex items-center space-x-4">
                    <UserOutlined className="text-4xl text-blue-500" />
                    <div>
                        <h2 className="text-2xl font-semibold">{user?.data.username}</h2>
                        <p className="text-gray-600">
                            <MailOutlined /> {user?.data.email}
                        </p>
                    </div>
                </div>
            </Card>

            <Row gutter={16} className="mb-6">
                <Col span={12}>
                    <Card>
                        <Statistic title="Total Games" value={games.length} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic title="Total Sales" value={games.reduce((acc, game) => acc + game.sales, 0)} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={games.reduce((acc, game) => acc + game.sales * game.price, 0)}
                            suffix="$"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Average Rating"
                            value={(games.reduce((acc, game) => acc + game.averageRating, 0) / games.length || 0)}
                            precision={1}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} className="mb-6">
                <Col span={12}>
                    <Card title="Sales Over Time">
                        <LineChart width={500} height={300} data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                        </LineChart>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Ratings">
                        <LineChart width={500} height={300} data={ratingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="rating" stroke="#82ca9d" />
                        </LineChart>
                    </Card>
                </Col>
            </Row>

            <Card
                title="Games"
                extra={
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        Add New Game
                    </Button>
                }
            >
                <Table dataSource={games} columns={columns} rowKey="id" />
            </Card>

            <Modal
                title="Add New Game"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddGame} layout="horizontal">
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="systemRequirements" label="System Requirements" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="videoTrailerUrl" label="Video Trailer (Embed Url)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
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
                        label="File .exe file"
                        rules={[{ required: true, message: "Please upload a .exe file!" }]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            fileList={exeFileList}
                            onChange={handleExeFileChange}
                        >
                            {exeFileList.length >= 1 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isCreating}>
                            Add Game
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Update Game"
                visible={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    initialValues={selectedGame || {}}
                    onFinish={handleUpdateGame}
                    layout="horizontal"
                >
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="systemRequirements" label="System Requirements" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="videoTrailerUrl" label="Video Trailer (Embed Url)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isUpdating}>
                            Update Game
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DashboardDev;
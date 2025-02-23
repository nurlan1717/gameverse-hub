import { Table, Button, Card, Row, Col, Statistic, Space, Form, Input, Modal, Select, Upload, message } from 'antd';
import { Pie } from '@ant-design/plots';
import { EditOutlined, DeleteOutlined, NotificationOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useCreateGameNewsMutation, useDeleteGameNewsMutation, useGetGameNewsQuery, useUpdateGameNewsMutation } from '../../../features/gamenews/gamenews';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const { Option } = Select;

const NewsPanel = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState<{ _id: string } | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);

    const { data: news, isLoading } = useGetGameNewsQuery();
    const [createGameNews] = useCreateGameNewsMutation();
    const [updateGameNews] = useUpdateGameNewsMutation();
    const [deleteGameNews] = useDeleteGameNewsMutation();

    const allNews = news ? [
        ...(news?.featured || []),
        ...(news?.trending || []),
        ...(news?.breaking || []),
    ] : [];

    const calculateNewsDistribution = () => {
        return [
            { type: 'Featured', value: news?.featured?.length },
            { type: 'Trending', value: news?.trending?.length },
            { type: 'Breaking', value: news?.breaking?.length },
        ];
    };

    const handleCreateOrUpdateNews = async (values: any) => {
        try {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                formData.append(key, values[key]);
            });

            if (fileList.length > 0) {
                formData.append("image", fileList[0].originFileObj);
            }
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
            if (selectedNews) {
                try {
                    await updateGameNews({ id: selectedNews?._id, updates: formData }).unwrap();
                    message.success('News Updated successfully');
                } catch (error) {
                    console.log(error);
                }
            } else {
                await createGameNews(formData).unwrap();
                message.success('News added successfully');
            }

            setIsModalVisible(false);
            form.resetFields();
            setSelectedNews(null);
            setFileList([]);
        } catch (error) {
            console.error("Failed to save news:", error);
        }
    };

    const handleDelete = (id: any) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you really want to delete this news article? This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => deleteGameNews(id),
        });
    };

    const handleEdit = (record: any) => {
        setSelectedNews(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Published Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: any) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const uploadProps = {
        onRemove: (file: any) => {
            setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
        },
        beforeUpload: (file: any) => {
            setFileList([file]);
            return false;
        },
        onChange: ({ fileList }: { fileList: any[] }) => {
            setFileList(fileList);
        },
        fileList,
    };

    return (
        <div>
            <Helmet>
                <title>Admin News</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Total News Articles"
                            value={allNews.length}
                            prefix={<NotificationOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Published Today"
                            value={allNews.filter((item) => new Date(item.publishedDate).toDateString() === new Date().toDateString()).length}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Drafts"
                            value={allNews.filter((item) => item.status === 'Draft').length}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card>
                        <h3>News Distribution</h3>
                        <Pie
                            data={calculateNewsDistribution()}
                            angleField="value"
                            colorField="type"
                            radius={1}
                            label={{ type: 'outer' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    style={{ marginBottom: 16 }}
                >
                    Create News
                </Button>
                <Table
                    columns={columns}
                    dataSource={allNews}
                    loading={isLoading}
                    rowKey="_id"
                    scroll={{ x: true }}
                />
            </Card>

            <Modal
                title={selectedNews ? "Edit News" : "Create News"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setSelectedNews(null);
                    setFileList([]);
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleCreateOrUpdateNews} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter the title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter the description!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="author"
                        label="Author"
                        rules={[{ required: true, message: 'Please enter the author!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select the category!' }]}
                    >
                        <Select>
                            <Option value="featured">Featured News</Option>
                            <Option value="trending">Trending News</Option>
                            <Option value="breaking">Breaking News</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Upload Image">
                        <Upload {...uploadProps} listType="picture">
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NewsPanel;
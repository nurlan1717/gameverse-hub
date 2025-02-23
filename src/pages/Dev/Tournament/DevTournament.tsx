import { useState, useEffect } from 'react';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, TrophyOutlined, UploadOutlined, PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
    useCreateTournamentMutation,
    useUpdateTournamentMutation,
    useDeleteTournamentMutation,
    useGetActiveTournamentsQuery,
    useSetTournamentActiveMutation
} from '../../../features/tournaments/tournamentSlice';
import type { Tournament } from '../../../types/tournament';
import { Button, Table, Form, Input, DatePicker, InputNumber, Modal, message, Tag, Upload, Image, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import moment from 'moment';

const { RangePicker } = DatePicker;

function DevTournament() {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string>('');

    const { data: tournaments, isLoading, error } = useGetActiveTournamentsQuery();
    const [createTournament, { isLoading: isCreatingTournament }] = useCreateTournamentMutation();
    const [updateTournament, { isLoading: isUpdating }] = useUpdateTournamentMutation();
    const [deleteTournament, { isLoading: isDeleting }] = useDeleteTournamentMutation();
    const [setTournamentActive] = useSetTournamentActiveMutation();

    useEffect(() => {
        const checkTournamentStatus = async () => {
            if (tournaments?.data) {
                const now = new Date();
                tournaments.data.forEach(async (tournament: any) => {
                    const startDate = new Date(tournament.startDate);
                    const endDate = new Date(tournament.endDate);

                    if (tournament.status === 'upcoming' && startDate <= now) {
                        try {
                            await setTournamentActive(tournament._id).unwrap();
                            message.success(`Tournament "${tournament.name}" is now active!`);
                        } catch (error) {
                            console.error('Failed to activate tournament:', error);
                        }
                    }
                });
            }
        };

        checkTournamentStatus();
    }, [tournaments?.data, setTournamentActive]);

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            Object.keys(values).forEach(key => {
                if (key === 'dateRange') {
                    formData.append('startDate', values.dateRange[0].toDate().toISOString());
                    formData.append('endDate', values.dateRange[1].toDate().toISOString());
                } else if (key !== 'tournamentLogo') {
                    formData.append(key, values[key]);
                }
            });

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('tournamentLogo', fileList[0].originFileObj);
            }

            if (editingId) {
                await updateTournament({ id: editingId, data: formData }).unwrap();
                message.success('Tournament updated successfully');
            } else {
                await createTournament(formData).unwrap();
                message.success('Tournament created successfully');
            }
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
        } catch (err) {
            message.error('Failed to save tournament');
        }
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this tournament?',
            content: 'This action cannot be undone.',
            okText: 'Yes, delete it',
            okType: 'danger',
            cancelText: 'No, keep it',
            onOk: async () => {
                try {
                    await deleteTournament(id).unwrap();
                    message.success('Tournament deleted successfully');
                } catch (err) {
                    message.error('Failed to delete tournament');
                }
            },
        });
    };

    const startEdit = (tournament: any) => {
        setEditingId(tournament._id);
        form.setFieldsValue({
            ...tournament,
            dateRange: [moment(tournament.startDate), moment(tournament.endDate)],
        });

        if (tournament.image) {
            setFileList([
                {
                    uid: '-1',
                    name: 'tournament-image',
                    status: 'done',
                    url: tournament.image,
                },
            ]);
            setPreviewImage(tournament.image);
        } else {
            setFileList([]);
            setPreviewImage('');
        }

        setIsModalVisible(true);
    };

    const handleImageChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);

        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(newFileList[0].originFileObj);
        } else {
            setPreviewImage('');
        }
    };

    const getStatusWithAction = (record: any) => {
        const now = new Date();
        const startDate = new Date(record.startDate);
        const endDate = new Date(record.endDate);

        if (record.status === 'upcoming' && startDate <= now) {
            return (
                <div className="flex items-center gap-2">
                    <Tag color="blue">UPCOMING</Tag>
                    <Tooltip title="Activate Tournament">
                        <Button
                            type="link"
                            icon={<PlayCircleOutlined />}
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    await setTournamentActive(record._id).unwrap();
                                    message.success('Tournament activated successfully');
                                } catch (error) {
                                    message.error('Failed to activate tournament');
                                }
                            }}
                            size="small"
                            className="text-blue-600 hover:text-blue-700"
                        />
                    </Tooltip>
                </div>
            );
        }

        let color = 'default';
        let icon = null;

        switch (record.status) {
            case 'active':
                color = 'green';
                icon = <CheckCircleOutlined className="text-green-500" />;
                break;
            case 'upcoming':
                color = 'blue';
                break;
            case 'completed':
                color = 'red';
                break;
        }

        return (
            <div className="flex items-center gap-2">
                <Tag color={color}>{record.status.toUpperCase()}</Tag>
                {icon}
            </div>
        );
    };

    const columns: ColumnsType<Tournament> = [
        {
            title: 'Tournament',
            dataIndex: 'name',
            key: 'name',
            render: (text, record: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {record.image ? (
                            <Image
                                src={record.image}
                                alt={text}
                                className="w-full h-full object-cover"
                                preview={false}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <TrophyOutlined className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-medium">{text}</div>
                        <div className="text-gray-500">{record.game}</div>
                    </div>
                </div>
            ),
            responsive: ['xs'],
        },
        {
            title: 'Dates',
            dataIndex: 'dateRange',
            key: 'dateRange',
            render: (_, record) => (
                <div className="whitespace-nowrap">
                    <div>{moment(record.startDate).format('MMM DD, YYYY')}</div>
                    <div className="text-gray-500">to {moment(record.endDate).format('MMM DD, YYYY')}</div>
                </div>
            ),
            responsive: ['sm'],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => getStatusWithAction(record),
            responsive: ['xs'],
            className: 'whitespace-nowrap',
        },
        {
            title: 'Teams',
            dataIndex: 'registeredTeams',
            key: 'teams',
            render: (teams, record) => (
                <div className="whitespace-nowrap">
                    <span className="font-medium">{teams.length}</span>
                    <span className="text-gray-500">/{record.maxTeams}</span>
                    {teams.length < record.maxTeams && (
                        <span className="text-green-500 text-sm ml-2">
                            ({record.maxTeams - teams.length} spots left)
                        </span>
                    )}
                </div>
            ),
            responsive: ['lg'],
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: (_, record) => (
                <div className="flex justify-end items-center gap-2">
                    <Tooltip title="Edit Tournament">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => startEdit(record)}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete Tournament">
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record._id)}
                            disabled={isDeleting}
                        >
                            <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                    </Tooltip>
                </div>
            ),
            responsive: ['xs'],
        },
    ];

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                <h3 className="font-medium mb-2">Error loading tournaments</h3>
                <p className="text-sm">Please try refreshing the page or contact support if the problem persists.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <TrophyOutlined className="text-indigo-600" />
                        <span>Tournament Management</span>
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your tournaments and track their status</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                        setIsModalVisible(true);
                        setEditingId(null);
                        form.resetFields();
                        setFileList([]);
                        setPreviewImage('');
                    }}
                    size="large"
                    className="w-full sm:w-auto"
                >
                    New Tournament
                </Button>
            </div>

            <Modal
                title={editingId ? 'Edit Tournament' : 'Create New Tournament'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="mt-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label="Tournament Name"
                            rules={[{ required: true, message: 'Please enter tournament name' }]}
                            className="md:col-span-2"
                        >
                            <Input placeholder="Enter tournament name" />
                        </Form.Item>

                        <Form.Item
                            name="game"
                            label="Game"
                            rules={[{ required: true, message: 'Please enter game name' }]}
                        >
                            <Input placeholder="Enter game name" />
                        </Form.Item>

                        <Form.Item
                            name="maxTeams"
                            label="Maximum Teams"
                            rules={[{ required: true, message: 'Please enter maximum teams' }]}
                        >
                            <InputNumber
                                min={1}
                                max={100}
                                placeholder="Enter max teams"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="dateRange"
                            label="Tournament Dates"
                            rules={[{ required: true, message: 'Please select tournament dates' }]}
                            className="md:col-span-2"
                        >
                            <RangePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="tournamentLogo"
                            label="Tournament Logo"
                            className="md:col-span-2"
                        >
                            <div className="space-y-4">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleImageChange}
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    accept="image/*"
                                >
                                    {fileList.length === 0 && (
                                        <div>
                                            <UploadOutlined />
                                            <div className="mt-2">Upload</div>
                                        </div>
                                    )}
                                </Upload>

                                {previewImage && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-2">Preview:</p>
                                        <div className="w-full max-w-xs">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="rounded-lg shadow-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setIsModalVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isCreatingTournament || isUpdating}
                        >
                            {editingId ? 'Update Tournament' : 'Create Tournament'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={tournaments?.data}
                        loading={isLoading}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} tournaments`,
                            responsive: true,
                            className: "px-4 py-3",
                        }}
                        scroll={{ x: 'max-content' }}
                        className="min-w-full"
                        locale={{
                            emptyText: (
                                <div className="py-8 text-center">
                                    <TrophyOutlined style={{ fontSize: 24 }} className="text-gray-400 mb-2" />
                                    <p className="text-gray-500">No tournaments found</p>
                                </div>
                            )
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default DevTournament;
import { useState, useEffect } from 'react';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, TrophyOutlined, UploadOutlined, PlayCircleOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
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
import { Helmet } from 'react-helmet-async';

const { RangePicker } = DatePicker;

function DevTournament() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [form] = Form.useForm();

    const { data: tournaments, isLoading } = useGetActiveTournamentsQuery();
    const [createTournament, { isLoading: isCreatingTournament }] = useCreateTournamentMutation();
    const [updateTournament, { isLoading: isUpdating }] = useUpdateTournamentMutation();
    const [deleteTournament] = useDeleteTournamentMutation();
    const [setTournamentActive] = useSetTournamentActiveMutation();

    const handleImageChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
        if (newFileList[0]?.originFileObj) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(newFileList[0].originFileObj);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const formData = {
                ...values,
                startDate: values.dateRange[0].toISOString(),
                endDate: values.dateRange[1].toISOString(),
                image: previewImage,
            };

            if (editingId) {
                await updateTournament({ id: editingId, updates: formData }).unwrap();
                message.success('Tournament updated successfully');
            } else {
                await createTournament(formData).unwrap();
                message.success('Tournament created successfully');
            }

            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
            setPreviewImage(null);
            setEditingId(null);
        } catch (error) {
            console.log(message);
            message.error(error?.data?.message || 'An error occurred');
        }
    };

    const columns: ColumnsType<Tournament> = [
        {
            title: 'Tournament',
            dataIndex: 'name',
            key: 'name',
            render: (text, record: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {record.tournamentLogo ? (
                            <Image
                                src={record.tournamentLogo}
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
                        <div className="text-emerald-600 font-medium text-sm mt-1">
                            <DollarOutlined className="mr-1" />
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(record.prizePool)}
                        </div>
                    </div>
                </div>
            ),
            responsive: ['xs'],
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'nameOnly',
            responsive: ['sm'],
        },
        {
            title: 'Game',
            dataIndex: 'game',
            key: 'game',
            responsive: ['lg'],
        },
        {
            title: 'Teams',
            dataIndex: 'maxTeams',
            key: 'maxTeams',
            responsive: ['lg'],
        },
        {
            title: 'Prize Pool',
            dataIndex: 'prizePool',
            key: 'prizePool',
            render: (value) => (
                <div className="whitespace-nowrap text-emerald-600 font-medium">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }).format(value)}
                </div>
            ),
            responsive: ['xl'],
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (status: string) => {
                const color = status === 'active' ? 'green' : 'orange';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
            responsive: ['lg'],
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEditingId(record._id);
                                form.setFieldsValue({
                                    ...record,
                                    dateRange: [moment(record.startDate), moment(record.endDate)],
                                });
                                if (record.tournamentLogo) {
                                    setPreviewImage(record.tournamentLogo);
                                    setFileList([
                                        {
                                            uid: '-1',
                                            name: 'tournament-logo.png',
                                            status: 'done',
                                            url: record.tournamentLogo,
                                        },
                                    ]);
                                }
                                setIsModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Are you sure you want to delete this tournament?',
                                    content: 'This action cannot be undone.',
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk: async () => {
                                        try {
                                            await deleteTournament(record._id).unwrap();
                                            message.success('Tournament deleted successfully');
                                        } catch (error) {
                                            message.error('Failed to delete tournament');
                                        }
                                    },
                                });
                            }}
                        />
                    </Tooltip>
                    <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
                        <Button
                            icon={record.status === 'active' ? <CheckCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={async () => {
                                try {
                                    await setTournamentActive(record._id).unwrap();
                                    message.success(`Tournament ${record.status === 'active' ? 'deactivated' : 'activated'} successfully`);
                                } catch (error) {
                                    message.error('Failed to update tournament status');
                                }
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <title>Developer Tournament</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tournaments</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your tournaments here</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() => {
                            setEditingId(null);
                            form.resetFields();
                            setFileList([]);
                            setPreviewImage(null);
                            setIsModalVisible(true);
                        }}
                    >
                        Create Tournament
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
                                name="prizePool"
                                label="Prize Pool (USD)"
                                rules={[{ required: true, message: 'Please enter prize pool amount' }]}
                                className="md:col-span-2"
                            >
                                <InputNumber
                                    min={0}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => parseFloat(value!.replace(/\$\s?|(,*)/g, '')) as any}
                                    style={{ width: '100%' }}
                                    placeholder="Enter prize pool amount"
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

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                            <Button
                                onClick={() => setIsModalVisible(false)}
                                className="w-full sm:w-auto order-2 sm:order-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isCreatingTournament || isUpdating}
                                className="w-full sm:w-auto order-1 sm:order-2"
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
        </>
    );
}

export default DevTournament;
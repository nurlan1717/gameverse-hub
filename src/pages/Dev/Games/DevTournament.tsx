import { useState } from 'react';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import {
    useCreateTournamentMutation,
    useUpdateTournamentMutation,
    useDeleteTournamentMutation,
    useGetActiveTournamentsQuery,
} from '../../../features/tournaments/tournamentSlice';
import type { Tournament } from '../../../types/tournament';
import { Button, Table, Form, Input, DatePicker, InputNumber, Modal, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

const { RangePicker } = DatePicker;

function DevTournament() {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data: tournaments, isLoading, error } = useGetActiveTournamentsQuery();
    const [createTournament, { isLoading: isCreatingTournament }] = useCreateTournamentMutation();
    const [updateTournament, { isLoading: isUpdating }] = useUpdateTournamentMutation();
    const [deleteTournament, { isLoading: isDeleting }] = useDeleteTournamentMutation();

    const handleSubmit = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                startDate: values.dateRange[0].toDate(),
                endDate: values.dateRange[1].toDate(),
            };
            delete formattedValues.dateRange;

            if (editingId) {
                await updateTournament({ id: editingId, data: formattedValues }).unwrap();
                message.success('Tournament updated successfully');
            } else {
                await createTournament(formattedValues).unwrap();
                message.success('Tournament created successfully');
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (err) {
            message.error('Failed to save tournament');
        }
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this tournament?',
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

    const startEdit = (tournament: Tournament) => {
        setEditingId(tournament._id);
        form.setFieldsValue({
            ...tournament,
            dateRange: [moment(tournament.startDate), moment(tournament.endDate)],
        });
        setIsModalVisible(true);
    };

    const columns: ColumnsType<Tournament> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <>
                    <div className="font-medium">{text}</div>
                    <div className="text-gray-500">{record.game}</div>
                </>
            ),
        },
        {
            title: 'Dates',
            dataIndex: 'dateRange',
            key: 'dateRange',
            render: (_, record) => (
                <>
                    <div>{moment(record.startDate).format('YYYY-MM-DD')}</div>
                    <div className="text-gray-500">to {moment(record.endDate).format('YYYY-MM-DD')}</div>
                </>
            ),
        },
        {
            title: 'Max Teams',
            dataIndex: 'maxTeams',
            key: 'maxTeams',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'upcoming') color = 'blue';
                if (status === 'active') color = 'green';
                if (status === 'completed') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => startEdit(record)}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                        disabled={isDeleting}
                    />
                </>
            ),
        },
    ];

    if (error) {
        return <div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading tournaments: {error.message}</div>;
    }

    return (
        <div className="max-w-6xl min-h-screen mt-25 mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <TrophyOutlined className="h-8 w-8 text-indigo-600" />
                    Tournament Management
                </h1>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                        setIsModalVisible(true);
                        setEditingId(null);
                        form.resetFields();
                    }}
                >
                    New Tournament
                </Button>
            </div>

            <Modal
                title={editingId ? 'Edit Tournament' : 'Create New Tournament'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true, max: 100 }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="game" label="Game" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="maxTeams" label="Max Teams" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="dateRange" label="Date Range" rules={[{ required: true }]}>
                        <RangePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isCreatingTournament || isUpdating}>
                            {editingId ? 'Update' : 'Create'}
                        </Button>
                        <Button onClick={() => setIsModalVisible(false)} style={{ marginLeft: 8 }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                columns={columns}
                dataSource={tournaments?.data}
                loading={isLoading}
                rowKey="_id"
                locale={{ emptyText: 'No active tournaments found' }}
            />
        </div>
    );
}

export default DevTournament;
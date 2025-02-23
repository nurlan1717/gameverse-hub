import { useState } from 'react';
import { Table, Button, Card, Row, Col, Statistic, Space, message, Tooltip, Tag, Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import { Column } from '@ant-design/plots';
import { EditOutlined, DeleteOutlined, TrophyOutlined, TeamOutlined, DollarOutlined, PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
    useDeleteTournamentMutation,
    useGetTournamentsQuery,
    useUpdateTournamentMutation,
    useSetTournamentActiveMutation
} from '../../../features/tournaments/tournamentSlice';
import { useGetTeamsQuery } from '../../../features/teams/teamsSlice';
import { format } from 'date-fns';

const TournamentsPanel = () => {
    const { data: tournaments, refetch: refetchTournaments } = useGetTournamentsQuery();
    const { data: teams } = useGetTeamsQuery({});
    const [updateTournament] = useUpdateTournamentMutation();
    const [deleteTournament] = useDeleteTournamentMutation();
    const [setTournamentActive] = useSetTournamentActiveMutation();

    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState<any>(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null);
    
    const handleUpdateTournament = async (values: any) => {
        try {
            await updateTournament({ id: selectedTournament?._id, updates: values }).unwrap();
            message.success('Tournament updated successfully');
            refetchTournaments();
            setIsUpdateModalVisible(false);
        } catch (error) {
            message.error('Failed to update tournament');
        }
    };

    const handleDeleteTournament = async () => {
        if (tournamentToDelete) {
            try {
                await deleteTournament(tournamentToDelete).unwrap();
                message.success('Tournament deleted successfully');
                refetchTournaments();
                setIsDeleteModalVisible(false);
            } catch (error) {
                message.error('Failed to delete tournament');
            }
        }
    };

    const activeCount = tournaments?.data?.filter((t: any) => t.status === 'active').length || 0;
    const upcomingCount = tournaments?.data?.filter((t: any) => t.status === 'upcoming').length || 0;
    const completedCount = tournaments?.data?.filter((t: any) => t.status === 'completed').length || 0;

    const tournamentStatsData = [
        { type: 'Active', value: activeCount },
        { type: 'Upcoming', value: upcomingCount },
        { type: 'Completed', value: completedCount },
    ];

    const getStatusTag = (status: string, record: any) => {
        if (status === 'upcoming') {
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
                                    refetchTournaments();
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

        const colors: Record<string, string> = {
            active: 'green',
            upcoming: 'blue',
            completed: 'red'
        };

        const icons: Record<string, React.ReactNode> = {
            active: <CheckCircleOutlined className="ml-1" />,
            upcoming: null,
            completed: null
        };

        return (
            <Tag color={colors[status]}>
                {status.toUpperCase()}
                {icons[status]}
            </Tag>
        );
    };

    const columns = [
        {
            title: 'Tournament',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        {record.tournamentLogo ? (
                            <img src={record.tournamentLogo} alt={text} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <TrophyOutlined className="text-gray-400" />
                        )}
                    </div>
                    <div>
                        <div className="font-medium">{text}</div>
                        <div className="text-gray-500 text-sm">{record.game}</div>
                    </div>
                </div>
            ),
            responsive: ['xl', 'xs', 'md', 'lg'] as Breakpoint[]
        },
        {
            title: 'Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
            responsive: ['xl', 'xs', 'md', 'lg'] as Breakpoint[]
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => getStatusTag(status, record),
            responsive: ['xl', 'xs', 'md', 'lg'] as Breakpoint[]
        },
        {
            title: 'Teams',
            key: 'teams',
            render: (record: any) => (
                <div className="whitespace-nowrap">
                    <span className="font-medium">{record.registeredTeams?.length || 0}</span>
                    <span className="text-gray-500">/{record.maxTeams}</span>
                </div>
            ),
            responsive: ['xl', 'xs', 'md', 'lg'] as Breakpoint[]
        },
        {
            title: 'Prize Pool',
            dataIndex: 'prizePool',
            key: 'prizePool',
            render: (value: number) => `$${value?.toLocaleString() || 0}`,
            responsive: ['xl', 'xs', 'md', 'lg'] as Breakpoint[]
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space className="flex sm:flex-row flex-col">
                    <Tooltip title="Edit Tournament">
                        <Button
                            type="primary"
                            key={record._id}
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedTournament(record);
                                setIsUpdateModalVisible(true);
                            }}
                            className="min-w-[90px]"
                        >
                            <span className="hidden sm:inline">Edit</span>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete Tournament">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                setTournamentToDelete(record._id);
                                setIsDeleteModalVisible(true);
                            }}
                            className="min-w-[90px]"
                        >
                            <span className="hidden sm:inline">Delete</span>
                        </Button>
                    </Tooltip>
                </Space>
            ),
            responsive: ['xl', 'xs', 'md', 'lg'] as Breakpoint[]
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                    <Card className="h-full">
                        <Statistic
                            title="Active Tournaments"
                            value={activeCount}
                            prefix={<TrophyOutlined className="text-green-500" />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="h-full">
                        <Statistic
                            title="Total Teams"
                            value={teams?.data?.length || 0}
                            prefix={<TeamOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="h-full">
                        <Statistic
                            title="Total Prize Pool"
                            value={tournaments?.data?.reduce((acc: number, t: any) => acc + (t.prizePool || 0), 0)}
                            prefix={<DollarOutlined className="text-purple-500" />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card className="mb-6">
                <h3 className="text-lg font-medium mb-4">Tournament Statistics</h3>
                <div className="h-[300px]">
                    <Column
                        data={tournamentStatsData}
                        xField="type"
                        yField="value"
                        label={{
                            position: 'inside',
                            style: {
                                fill: '#FFFFFF',
                                opacity: 0.6,
                            },
                        }}
                        color={['#3f8600', '#1890ff', '#722ed1']}
                        className="h-full"
                    />
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={tournaments?.data}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} tournaments`,
                            responsive: true,
                        }}
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            </Card>

            <Modal
                title="Update Tournament"
                key={tournaments?.data?._id}
                visible={isUpdateModalVisible}
                onCancel={() => setIsUpdateModalVisible(false)}
                footer={null}
            >
                <Form
                    initialValues={{
                        ...selectedTournament,
                        startDate: selectedTournament?.startDate ? moment(selectedTournament.startDate) : null,
                    }}
                    onFinish={handleUpdateTournament}
                    layout="vertical"
                >
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the tournament name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: "Please select the start date!" }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </Form.Item>
                    <Form.Item label="Prize Pool" name="prizePool" rules={[{ required: true, message: 'Please input the prize pool!' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Delete Tournament"
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onOk={handleDeleteTournament}
            >
                <p>Are you sure you want to delete this tournament?</p>
            </Modal>
        </div>
    );
};

export default TournamentsPanel;
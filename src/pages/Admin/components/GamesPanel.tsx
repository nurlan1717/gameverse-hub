import { Table, Button, Card, Row, Col, Statistic, Space } from 'antd';
import { Line } from '@ant-design/plots';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useApproveGameMutation, useDeleteGameMutation, useFetchGamesQuery, useFetchPendingGamesQuery, useRejectGameMutation } from '../../../features/games/gamesSlice';

const GamesPanel = () => {
    const { data: games, isLoading } = useFetchGamesQuery();
    const { data: pendingGames } = useFetchPendingGamesQuery();
    const [approveGame] = useApproveGameMutation();
    const [rejectGame] = useRejectGameMutation();
    const [deleteGame] = useDeleteGameMutation();

    const gameMetricsData = [
        { month: 'Jan', approved: 23, pending: 12, rejected: 5 },
        { month: 'Feb', approved: 35, pending: 18, rejected: 7 },
        { month: 'Mar', approved: 28, pending: 15, rejected: 4 },
    ];

    const columns = [
        {
            title: 'Game Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Developer',
            dataIndex: 'developer',
            key: 'developer',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    {record.status === 'pending' && (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => approveGame(record._id)}
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => rejectGame(record._id)}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    <Button
                        type="default"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteGame(record._id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Games"
                            value={games?.data?.length || 0}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Pending Approvals"
                            value={pendingGames?.length || 0}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Approved Games"
                            value={games?.data?.filter(g => g.status === 'approved').length || 0}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }}>
                <h3>Game Status Trends</h3>
                <Line
                    data={gameMetricsData}
                    xField="month"
                    yField="value"
                    seriesField="type"
                    smooth
                    legend={{
                        position: 'top',
                    }}
                />
            </Card>

            <Card style={{ marginTop: 16 }}>
                <Table
                    columns={columns}
                    dataSource={games?.data}
                    loading={isLoading}
                    rowKey="id"
                />
            </Card>
        </div>
    );
};

export default GamesPanel;
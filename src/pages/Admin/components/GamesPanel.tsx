import { Table, Button, Card, Row, Col, Statistic, Space, Descriptions, Tag, Modal } from 'antd';
import { Line, Pie, Bar } from '@ant-design/plots';
import { CheckOutlined, CloseOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useApproveGameMutation, useDeleteGameMutation, useFetchGamesQuery, useFetchPendingGamesQuery, useRejectGameMutation } from '../../../features/games/gamesSlice';

const GamesPanel = () => {
    const { data: games, isLoading } = useFetchGamesQuery();
    const { data: pendingGames } = useFetchPendingGamesQuery();
    const [approveGame] = useApproveGameMutation();
    const [rejectGame] = useRejectGameMutation();
    const [deleteGame] = useDeleteGameMutation();

    const calculateGameMetrics = () => {
        const metrics = {
            approved: 0,
            pending: 0,
            rejected: 0,
        };

        games?.data?.forEach((game: any) => {
            if (game.approved === true) metrics.approved++;
            else if (game.approved === false) metrics.rejected++;
            else metrics.pending++;
        });

        return metrics;
    };

    const calculateGenreDistribution = () => {
        const genreMap = new Map<string, number>();

        games?.data?.forEach((game: any) => {
            const genre = game.genre;
            if (genreMap.has(genre)) {
                genreMap.set(genre, genreMap.get(genre)! + 1);
            } else {
                genreMap.set(genre, 1);
            }
        });

        return Array.from(genreMap).map(([genre, value]) => ({ genre, value }));
    };

    const calculatePlatformDistribution = () => {
        const platformMap = new Map<string, number>();

        games?.data?.forEach((game: any) => {
            const platform = game.platform;
            if (platformMap.has(platform)) {
                platformMap.set(platform, platformMap.get(platform)! + 1);
            } else {
                platformMap.set(platform, 1);
            }
        });

        return Array.from(platformMap).map(([platform, value]) => ({ platform, value }));
    };

    const calculateMonthlyMetrics = () => {
        const monthlyMetrics: { [key: string]: { approved: number; pending: number; rejected: number } } = {};

        games?.data?.forEach((game: any) => {
            const date = new Date(game.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });

            if (!monthlyMetrics[month]) {
                monthlyMetrics[month] = { approved: 0, pending: 0, rejected: 0 };
            }

            if (game.approved === true) monthlyMetrics[month].approved++;
            else if (game.approved === false) monthlyMetrics[month].rejected++;
            else monthlyMetrics[month].pending++;
        });

        return Object.keys(monthlyMetrics).map((month) => ({
            month,
            ...monthlyMetrics[month],
        }));
    };

    const gameMetricsData = calculateMonthlyMetrics();
    const genreDistributionData = calculateGenreDistribution();
    const platformDistributionData = calculatePlatformDistribution();

    const handleDelete = (id: any) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you really want to delete this game? This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => deleteGame(id),
        });
    };

    const columns = [
        {
            title: 'Game Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Genre',
            dataIndex: 'genre',
            key: 'genre',
        },
        {
            title: 'Status',
            dataIndex: 'approved',
            key: 'approved',
            render: (approved: boolean | null) => (
                <Tag color={approved === true ? 'green' : approved === false ? 'red' : 'orange'}>
                    {approved === true ? 'Approved' : approved === false ? 'Rejected' : 'Pending'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    {record.approved === null && (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => {
                                    const resp = approveGame(record._id)
                                    console.log(resp);
                                }}
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
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="default"
                        icon={<InfoCircleOutlined />}
                        onClick={() => showGameDetails(record)}
                    >
                        Details
                    </Button>
                </Space>
            ),
        },
    ];

    const showGameDetails = (game: any) => {
        Modal.info({
            title: game.title,
            content: (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Description">{game.description}</Descriptions.Item>
                    <Descriptions.Item label="System Requirements">{game.systemRequirements}</Descriptions.Item>
                    <Descriptions.Item label="Genre">{game.genre}</Descriptions.Item>
                    <Descriptions.Item label="Platform">{game.platform}</Descriptions.Item>
                    <Descriptions.Item label="Price">${game.price}</Descriptions.Item>
                    <Descriptions.Item label="Average Rating">{game.averageRating}/5</Descriptions.Item>
                    <Descriptions.Item label="Sales">{game.sales}</Descriptions.Item>
                    <Descriptions.Item label="Cover Photo">
                        <img src={game.coverPhotoUrl} alt="Cover" style={{ width: '100%' }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Video Trailer">
                        <iframe
                            width="100%"
                            height="315"
                            src={game.videoTrailerUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </Descriptions.Item>
                </Descriptions>
            ),
            width: 800,
        });
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Total Games"
                            value={games?.data?.length || 0}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Pending Approvals"
                            value={pendingGames?.data?.length || 0}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Approved Games"
                            value={games?.data?.filter((g: any) => g.approved === true).length || 0}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card>
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
                </Col>
                <Col xs={24} md={12}>
                    <Card>
                        <h3>Genre Distribution</h3>
                        <Pie
                            data={genreDistributionData}
                            angleField="value"
                            colorField="genre"
                            radius={0.8}
                            label={{
                                type: 'inner',
                                offset: '-30%',
                                content: '{name}',
                                style: {
                                    fontSize: 14,
                                    textAlign: 'center',
                                },
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card>
                        <h3>Platform Distribution</h3>
                        <Bar
                            data={platformDistributionData}
                            xField="value"
                            yField="platform"
                            seriesField="platform"
                            legend={{
                                position: 'top',
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }}>
                <Table
                    columns={columns}
                    dataSource={games?.data}
                    loading={isLoading}
                    rowKey="_id"
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default GamesPanel;
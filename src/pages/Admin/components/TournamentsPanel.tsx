import { Table, Button, Card, Row, Col, Statistic, Space } from 'antd';
import { Column } from '@ant-design/plots';
import { EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import { useCreateTournamentMutation, useDeleteTournamentMutation, useGetActiveTournamentsQuery, useUpdateTournamentMutation } from '../../../features/tournaments/tournamentSlice';
import { useGetTeamsQuery } from '../../../features/teams/teamsSlice';

const TournamentsPanel = () => {
    const { data: tournaments } = useGetActiveTournamentsQuery();
    const { data: teams } = useGetTeamsQuery({});
    const [createTournament] = useCreateTournamentMutation();
    const [updateTournament] = useUpdateTournamentMutation();
    const [deleteTournament] = useDeleteTournamentMutation();

    const tournamentStatsData = [
        { type: 'Active', value: 12 },
        { type: 'Completed', value: 8 },
        { type: 'Upcoming', value: 5 },
    ];

    const columns = [
        {
            title: 'Tournament Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Game',
            dataIndex: 'game',
            key: 'game',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
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
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => updateTournament(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteTournament(record._id)}
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
                            title="Active Tournaments"
                            value={tournaments?.data?.filter(t => t?.status === 'active').length || 0}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Teams"
                            value={teams?.data.length || 0}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Prize Pool"
                            value={tournaments?.data?.reduce((acc, t) => acc + t?.prizePool, 0) || 0}
                            prefix="$"
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }}>
                <h3>Tournament Statistics</h3>
                <Column
                    data={tournamentStatsData}
                    xField="type"
                    yField="value"
                    label={{
                        position: 'middle',
                        style: {
                            fill: '#FFFFFF',
                            opacity: 0.6,
                        },
                    }}
                />
            </Card>

            <Card style={{ marginTop: 16 }}>
                <Table
                    columns={columns}
                    dataSource={tournaments?.data}
                    rowKey="id"
                />
            </Card>
        </div>
    );
};

export default TournamentsPanel;
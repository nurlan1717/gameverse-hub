import { Table, Button, Card, Row, Col, Statistic, Space } from 'antd';
import { Pie } from '@ant-design/plots';
import { EditOutlined, DeleteOutlined, NotificationOutlined } from '@ant-design/icons';
import { useCreateGameNewsMutation, useDeleteGameNewsMutation, useUpdateGameNewsMutation } from '../../../features/gamenews/gamenews';

const NewsPanel = () => {
    const [createGameNews] = useCreateGameNewsMutation();
    const [updateGameNews] = useUpdateGameNewsMutation();
    const [deleteGameNews] = useDeleteGameNewsMutation();

    const newsMetricsData = [
        { type: 'Game Updates', value: 35 },
        { type: 'Tournament News', value: 25 },
        { type: 'Community Updates', value: 20 },
        { type: 'Patch Notes', value: 15 },
    ];

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Published Date',
            dataIndex: 'publishedDate',
            key: 'publishedDate',
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
                        onClick={() => updateGameNews(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteGameNews(record.id)}
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
                            title="Total News Articles"
                            value={95}
                            prefix={<NotificationOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Published Today"
                            value={12}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Drafts"
                            value={8}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }}>
                <h3>News Distribution</h3>
                <Pie
                    data={newsMetricsData}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                        type: 'outer',
                    }}
                />
            </Card>

            <Card style={{ marginTop: 16 }}>
                <Table
                    columns={columns}
                    dataSource={[]}
                    rowKey="id"
                />
            </Card>
        </div>
    );
};

export default NewsPanel;
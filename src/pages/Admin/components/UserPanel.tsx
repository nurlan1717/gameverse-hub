import React, { useState } from 'react';
import { Table, Button, Card, Row, Col, Statistic, Modal, Input, Tag } from 'antd';
import { Area, Pie, Bar } from '@ant-design/plots';
import { UserOutlined, LockOutlined, UnlockOutlined, CheckOutlined } from '@ant-design/icons';
import { useApproveDeveloperMutation, useBanAccountMutation, useGetUsersQuery, useUnbanAccountMutation } from '../../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const UsersPanel = () => {
    const { data: users, isLoading } = useGetUsersQuery();
    const [banAccount] = useBanAccountMutation();
    const [unbanAccount] = useUnbanAccountMutation();
    const [approveDeveloper] = useApproveDeveloperMutation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [banDuration, setBanDuration] = useState(0);

    const unverifiedDevelopers = React.useMemo(() => {
        if (!users?.data) return [];
        return users.data.filter((user: any) => user.isVerifiedByAdmin === false);
    }, [users]);

    const userSignUpData = React.useMemo(() => {
        if (!users?.data) return [];
        const signupsByMonth = users.data.reduce((acc: any, user: any) => {
            const date = new Date(user.createdAt);
            const month = date.toLocaleString('default', { month: 'long' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(signupsByMonth).map(month => ({
            month,
            signups: signupsByMonth[month],
        }));
    }, [users]);

    const subscriptionPlanData = React.useMemo(() => {
        if (!users?.data) return [];
        const planCounts = users.data.reduce((acc: any, user: any) => {
            const plan = user.plan || 'free';
            acc[plan] = (acc[plan] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(planCounts).map(plan => ({
            type: plan,
            value: planCounts[plan],
        }));
    }, [users]);

    const userActivityData = React.useMemo(() => {
        if (!users?.data) return [];
        return [
            { date: '2024-01', value: 350 },
            { date: '2024-02', value: 420 },
            { date: '2024-03', value: 380 },
        ];
    }, [users]);

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Provider',
            dataIndex: 'provider',
            key: 'provider',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'admin' ? 'volcano' : role === 'developer' ? 'geekblue' : 'green'}>
                    {role.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isVerifiedByAdmin',
            key: 'isVerifiedByAdmin',
            render: (isVerified: boolean) => (
                <Tag color={isVerified ? 'green' : 'red'}>
                    {isVerified ? 'Verified' : 'Pending Approval'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button
                        type={record.isBanned ? 'primary' : 'default'}
                        danger={!record.isBanned}
                        icon={record.isBanned ? <UnlockOutlined /> : <LockOutlined />}
                        onClick={() => {
                            if (record.isBanned) {
                                unbanAccount(record._id);
                                toast.success("User Unbanned!");
                            } else {
                                setSelectedUser(record._id);
                                setIsModalVisible(true);
                            }
                        }}
                    >
                        {record.isBanned ? 'Unban' : 'Ban'}
                    </Button>
                </div>
            ),
        },
    ];

    const columns2 = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Provider',
            dataIndex: 'provider',
            key: 'provider',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'admin' ? 'volcano' : role === 'developer' ? 'geekblue' : 'green'}>
                    {role.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isVerifiedByAdmin',
            key: 'isVerifiedByAdmin',
            render: (isVerified: boolean) => (
                <Tag color={isVerified ? 'green' : 'red'}>
                    {isVerified ? 'Verified' : 'Pending Approval'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button
                        type={record.isBanned ? 'primary' : 'default'}
                        danger={!record.isBanned}
                        icon={record.isBanned ? <UnlockOutlined /> : <LockOutlined />}
                        onClick={() => {
                            if (record.isBanned) {
                                unbanAccount(record._id);
                                toast.success("User Unbanned!");
                            } else {
                                setSelectedUser(record._id);
                                setIsModalVisible(true);
                            }
                        }}
                    >
                        {record.isBanned ? 'Unban' : 'Ban'}
                    </Button>
                    {!record.isVerifiedByAdmin && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => {
                                try {
                                    approveDeveloper(record._id);
                                    toast.success("Developer Approved!");
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        >
                            Approve Developer
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const handleBan = () => {
        if (selectedUser) {
            banAccount({ id: selectedUser, duration: banDuration });
            toast.success("User Banned!");
        }
        setIsModalVisible(false);
        setBanDuration(0);
    };

    return (
        <>
            <Helmet>
                <title>Admin Users</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div style={{ padding: '16px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card>
                            <Statistic
                                title="Total Users"
                                value={users?.data?.length || 0}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card>
                            <Statistic
                                title="Active Users"
                                value={users?.data?.filter((u: any) => !u.isBanned).length || 0}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card>
                            <Statistic
                                title="Banned Users"
                                value={users?.data?.filter((u: any) => u.isBanned).length || 0}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <Card>
                            <h3>User Activity Trend</h3>
                            <Area
                                data={userActivityData}
                                xField="date"
                                yField="value"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <Card>
                            <h3>Subscription Plan Distribution</h3>
                            <Pie
                                data={subscriptionPlanData}
                                angleField="value"
                                colorField="type"
                                radius={0.8}
                                responsive
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                    <Col span={24}>
                        <Card>
                            <h3>User Sign-ups Over Time</h3>
                            <Bar
                                data={userSignUpData}
                                xField="month"
                                yField="signups"
                                responsive
                            />
                        </Card>
                    </Col>
                </Row>

                <Card style={{ marginTop: '16px' }}>
                    <Table
                        columns={columns}
                        dataSource={users?.data}
                        loading={isLoading}
                        rowKey="id"
                        scroll={{ x: true }}
                    />
                </Card>

                <Card style={{ marginTop: '16px' }}>
                    <h1 className='font-bold text-xl mb-2'>Developer Requests</h1>
                    <Table
                        columns={columns2}
                        dataSource={unverifiedDevelopers}
                        loading={isLoading}
                        rowKey="id"
                        scroll={{ x: true }}
                    />
                </Card>

                <Modal
                    title="Ban Duration"
                    visible={isModalVisible}
                    onOk={handleBan}
                    onCancel={() => setIsModalVisible(false)}
                    width={300}
                >
                    <Input
                        type="number"
                        min={0}
                        placeholder="Enter ban duration in minutes"
                        value={banDuration}
                        onChange={(e) => setBanDuration(parseInt(e.target.value))}
                    />
                </Modal>
                <ToastContainer />
            </div>
        </>
    );
};

export default UsersPanel;
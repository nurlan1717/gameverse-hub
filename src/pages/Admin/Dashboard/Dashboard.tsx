import { useState } from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import {
    UserOutlined,
    CameraOutlined,
    TrophyOutlined,
    NotificationOutlined,
} from '@ant-design/icons';
import UsersPanel from '../components/UserPanel';
import GamesPanel from '../components/GamesPanel';
import TournamentsPanel from '../components/TournamentsPanel';
import NewsPanel from '../components/NewsPanel';
import { Helmet } from 'react-helmet-async';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function Dashboard() {
    const [selectedKey, setSelectedKey] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return <UsersPanel />;
            case '2':
                return <GamesPanel />;
            case '3':
                return <TournamentsPanel />;
            case '4':
                return <NewsPanel />;
            default:
                return <UsersPanel />;
        }
    };

    return (
        <>
            <Helmet>
                <title>Admin Dashboard</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <Layout style={{ minHeight: '100vh', paddingTop: '24px' }}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    theme="light"
                >
                    <div className="p-4">
                        <Title level={4}>Admin Panel</Title>
                    </div>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        onClick={({ key }) => setSelectedKey(key)}
                        items={[
                            {
                                key: '1',
                                icon: <UserOutlined />,
                                label: 'Users',
                            },
                            {
                                key: '2',
                                icon: <CameraOutlined />,
                                label: 'Games',
                            },
                            {
                                key: '3',
                                icon: <TrophyOutlined />,
                                label: 'Tournaments',
                            },
                            {
                                key: '4',
                                icon: <NotificationOutlined />,
                                label: 'News',
                            },
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }} />
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {renderContent()}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default Dashboard;
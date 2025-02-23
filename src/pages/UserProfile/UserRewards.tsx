import { useEffect } from 'react';
import { Card, List, Typography, Button, Image } from 'antd';
import { useFetchGamesQuery } from '../../features/games/gamesSlice';
import { Helmet } from 'react-helmet-async';

const { Title, Text } = Typography;

const UserRewards = () => {
    const { data, isLoading, refetch: fetchGames } = useFetchGamesQuery();

    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    const myGames = data?.data || [];

    return (
        <>
            <Helmet>
                <title>Rewards</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <Card style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '16px' }}>
                <Title level={2}>Your Epic Rewards</Title>
                {isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    <List
                        dataSource={myGames}
                        renderItem={(item: { coverPhotoUrl?: string; name: string; description?: string; points?: number; status?: string }) => (
                            <List.Item style={{ padding: '12px 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '0 0 100px', marginRight: '16px' }}>
                                        <Image
                                            src={item.coverPhotoUrl || 'https://via.placeholder.com/150'}
                                            alt={item.name}
                                            width={100}
                                            height={100}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'left', minWidth: '200px', marginBottom: '8px' }}>
                                        <Text strong>{item.name}</Text>
                                        <br />
                                        <Text type="secondary">{item.description || 'No description available'}</Text>
                                    </div>
                                    <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
                                        <Text strong>{item.points || '0 Points'}</Text>
                                        <br />
                                        <Button type="primary" style={{ marginTop: '8px' }} disabled={item.status === 'Coming Soon'}>
                                            {item.status || 'Coming Soon'}
                                        </Button>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </>
    );
};

export default UserRewards;
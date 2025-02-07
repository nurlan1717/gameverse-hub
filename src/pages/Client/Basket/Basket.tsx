import { Link } from 'react-router-dom';
import { useGetBasketQuery, useRemoveFromBasketMutation, useClearBasketMutation } from '../../../features/user/usersSlice';
import { toast, ToastContainer } from 'react-toastify';

type Game = {
    gameId: {
        _id: string;
        title: string;
        coverPhotoUrl: string;
        description: string;
        price: number;
    }
};

const BasketPage = () => {
    const {
        data: basketData,
        isLoading,
        isError,
        error: basketError,
        refetch
    } = useGetBasketQuery();

    const [removeFromBasket] = useRemoveFromBasketMutation();
    const [clearBasket] = useClearBasketMutation();

    const handleRemove = async (gameId: string) => {
        try {
            await removeFromBasket(gameId).unwrap();
            toast.success('Removed from basket successfully!');
            refetch();
        } catch (err) {
            console.error('Failed to remove item:', err);
        }
    };

    const handleClearBasket = async () => {
        try {
            await clearBasket().unwrap();
            toast.success('Cleared basket successfully!');
            refetch();
        } catch (err) {
            console.error('Failed to clear basket:', err);
        }
    };

    const totalPrice: number = basketData?.data?.reduce((sum: number, game: Game) => sum + game.gameId.price, 0) || 0;


    if (isLoading) return (
        <div className="bg-[#101014] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-[#1F1F23] rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-[#1F1F23] rounded-lg p-4">
                                <div className="h-48 bg-[#2A2A2E] rounded-lg mb-4"></div>
                                <div className="h-6 bg-[#2A2A2E] rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-[#2A2A2E] rounded w-full mb-4"></div>
                                <div className="h-10 bg-[#2A2A2E] rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (isError) return <div className="text-center py-8 text-red-500">Error: {JSON.stringify(basketError)}</div>;

    return (
        <div className="bg-[#101014] min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">My Basket</h1>
                    <button
                        onClick={handleClearBasket}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                        Clear Basket
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3">
                        <div className="bg-[#1F1F23] rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#2A2A2E]">
                                        <th className="text-left py-4 px-6 text-gray-400 font-semibold">Game</th>
                                        <th className="text-left py-4 px-6 text-gray-400 font-semibold">Price</th>
                                        <th className="text-right py-4 px-6 text-gray-400 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {basketData?.data?.map((game: Game) => (
                                        <tr key={game.gameId._id} className="border-b border-[#2A2A2E]">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center">
                                                    <img
                                                        src={game.gameId.coverPhotoUrl}
                                                        alt={game.gameId.title}
                                                        className="w-16 h-16 object-cover rounded-lg mr-4"
                                                    />
                                                    <div>
                                                        <h3 className="text-white text-lg font-semibold">{game.gameId.title}</h3>
                                                        <p className="text-gray-400 text-sm">{game.gameId.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-[#26bbff] text-lg">${game.gameId.price}</td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => handleRemove(game.gameId._id)}
                                                    className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {basketData?.data?.length === 0 && (
                            <div className="text-gray-400 text-center mt-8">
                                Your basket is empty. <Link to="/games" className="text-[#26bbff] hover:underline">Explore games</Link>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-1/3">
                        <div className="bg-[#1F1F23] rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">${totalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Discount</span>
                                    <span className="text-[#26bbff]">$0.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tax</span>
                                    <span className="text-white">$0.00</span>
                                </div>
                                <div className="border-t border-[#2A2A2E] pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-white font-semibold">Total</span>
                                        <span className="text-[#26bbff] font-bold">${totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    className="w-full px-4 py-2 bg-[#2A2A2E] text-white rounded-lg focus:outline-none"
                                />
                                <button className="w-full mt-4 bg-[#26bbff] hover:bg-[#26bbff] text-black px-4 py-2 rounded-lg transition duration-300">
                                    Apply Coupon
                                </button>
                            </div>
                            <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-lg transition duration-300">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BasketPage;
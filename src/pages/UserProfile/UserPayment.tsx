import Cookies from 'js-cookie';
import { useGetUserByIdQuery } from '../../features/user/usersSlice';
import { useState } from "react";
import { CreditCard } from 'lucide-react';

const UserPayment = () => {
    const id = Cookies.get('id') || '';
    const { data: user, isLoading, isError } = useGetUserByIdQuery(id);
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

    return (
        <div className="bg-gray-100 w-full mx-auto min-h-screen py-10 flex justify-center">
            <div className="max-w-3xl bg-white rounded-lg p-12 shadow-md">
                <h1 className="text-2xl font-semibold mb-4">Payment Management</h1>
                <p className="text-gray-600 mb-6">View your payment activity and the current balance of your GameVerse Hub account.</p>
                <h2 className="text-lg font-bold mb-2">CURRENT WALLET BALANCE</h2>
                <p className="text-3xl font-semibold">${user?.data?.balance || '0.00'}</p>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">ADD FUNDS TO WALLET</button>

                <h2 className="text-lg font-bold mt-8 mb-4">YOUR PAYMENT METHODS</h2>
                <p className="text-gray-600 mb-4">By saving your payment information, this payment method will be set as the default for all purchases made using your GameVerse Hub Account.</p>

                <div className="space-y-4">
                    <label className="flex items-center space-x-3 bg-gray-200 p-4 rounded cursor-pointer">
                        <input
                            type="radio"
                            name="payment"
                            value="credit_card"
                            checked={selectedPayment === 'creditCard'}
                            onChange={() => setSelectedPayment('creditCard')}
                        />
                        <span className="flex items-center">
                            <span className="mr-2"><CreditCard /></span> Credit Card
                        </span>
                    </label>
                    <label className="flex items-center space-x-3 bg-gray-200 p-4 rounded cursor-pointer">
                        <input
                            type="radio"
                            name="payment"
                            value="paypal"
                            checked={selectedPayment === 'paypal'}
                            onChange={() => setSelectedPayment('paypal')}
                        />
                        <span className="flex items-center">
                            <span className="mr-2">💰</span> PayPal
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default UserPayment;

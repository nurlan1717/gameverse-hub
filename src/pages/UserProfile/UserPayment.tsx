import Cookies from 'js-cookie';
import { useGetUserByIdQuery, useRequestTopupMutation, useVerifyTopupMutation } from '../../features/user/usersSlice';
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { CreditCard, KeySquare, Wallet, ArrowLeft, Calendar, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Payment from 'payment';
import { Helmet } from 'react-helmet-async';

const UserPayment = () => {
    const id = Cookies.get('id') || '';
    const { data: user } = useGetUserByIdQuery(id);

    const [amount, setAmount] = useState(0);
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const [requestTopup] = useRequestTopupMutation();
    const [verifyTopup] = useVerifyTopupMutation();

    useEffect(() => {
        const cardNumberElement = document.querySelector('.cc-number') as HTMLInputElement | null;
        const cardExpiryElement = document.querySelector('.cc-expiry') as HTMLInputElement | null;
        const cardCvcElement = document.querySelector('.cc-cvc') as HTMLInputElement | null;

        if (cardNumberElement) Payment.formatCardNumber(cardNumberElement);
        if (cardExpiryElement) Payment.formatCardExpiry(cardExpiryElement);
        if (cardCvcElement) Payment.formatCardCVC(cardCvcElement);
    }, []);

    const handleSendOtp = async () => {
        if (!Payment.fns.validateCardNumber(cardNumber.replace(/\s/g, ''))) {
            toast.error('Invalid card number');
            return;
        }
        if (!cardName) {
            toast.error('Please enter cardholder name');
            return;
        }
        const [month, year] = expiry.split('/');
        if (!Payment.fns.validateCardExpiry(month, year)) {
            toast.error('Invalid expiry date');
            return;
        }
        if (!Payment.fns.validateCardCVC(cvc)) {
            toast.error('Invalid CVC');
            return;
        }

        if (!user?.data?.email) {
            toast.error('User email not found!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await requestTopup({ email: user?.data?.email, amount: 0 });
            if (response.data?.message === "OTP sent to your email.") {
                setStep(3);
                toast.success('OTP sent to your email!');
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error('Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTopUp = async () => {
        if (!otp || !amount) {
            toast.error('Please enter both OTP and amount');
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0 || Number(amount) > 100) {
            toast.error('Please enter a valid amount (max $100)');
            return;
        }

        setIsLoading(true);
        try {
            const response = await verifyTopup({
                email: user?.data?.email,
                otp: Number(otp),
                amount: Number(amount)
            });

            if (response.data?.message === "Balance successfully topped up.") {
                toast.success('Your balance has been successfully updated!');
                setAmount(0);
                setOtp('');
                setStep(1);
                setCardNumber('');
                setCardName('');
                setExpiry('');
                setCvc('');
            }
        } catch (error) {
            console.error("Error verifying OTP or topping up:", error);
            toast.error('Failed to verify OTP or top-up balance.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Payment Manager</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div className="flex justify-center items-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full backdrop-blur-lg bg-[#1F1F23]/80 rounded-2xl p-8 shadow-2xl border border-gray-700/50"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-500/10 rounded-xl">
                            <CreditCard className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Payment Management</h1>
                            <p className="text-gray-400 text-sm mt-1">Secure and easy top-up</p>
                        </div>
                    </div>

                    <div className="bg-[#2A2A2E]/50 rounded-xl p-4 mb-8 border border-gray-700/30">
                        <p className="text-gray-400 text-sm">Current Balance</p>
                        <p className="text-3xl font-bold text-white mt-1">
                            ${(user?.data?.balance || 0).toFixed(2)}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Enter Amount (max $100)"
                                        value={amount || ''}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full bg-[#2A2A2E]/50 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-12 border border-gray-700/30"
                                        min="1"
                                        max="100"
                                    />
                                    <Wallet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!amount || amount <= 0 || amount > 100}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-medium">Continue to Payment</span>
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="cc-number w-full bg-[#2A2A2E]/50 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-12 border border-gray-700/30"
                                            placeholder="Card Number"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            maxLength={19}
                                        />
                                        <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Cardholder Name"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            className="w-full bg-[#2A2A2E]/50 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-12 border border-gray-700/30"
                                        />
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="cc-expiry w-full bg-[#2A2A2E]/50 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-12 border border-gray-700/30"
                                                placeholder="MM/YY"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                maxLength={5}
                                            />
                                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="cc-cvc w-full bg-[#2A2A2E]/50 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-12 border border-gray-700/30"
                                                placeholder="CVC"
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value)}
                                                maxLength={4}
                                            />
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-4 rounded-xl bg-gray-700/30 text-white hover:bg-gray-700/50 transition duration-300 flex items-center justify-center"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleSendOtp}
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
                                    >
                                        {isLoading ? (
                                            <ClipLoader size={20} color="#ffffff" />
                                        ) : (
                                            <>
                                                <KeySquare className="w-5 h-5" />
                                                <span className="font-medium">Request OTP</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,6}$/.test(value)) {
                                                setOtp(value);
                                            }
                                        }}
                                        className="w-full bg-[#2A2A2E]/50 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-12 border border-gray-700/30"
                                        maxLength={6}
                                    />
                                    <KeySquare className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-6 py-4 rounded-xl bg-gray-700/30 text-white hover:bg-gray-700/50 transition duration-300 flex items-center justify-center"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleTopUp}
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-600 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                                    >
                                        {isLoading ? (
                                            <ClipLoader size={20} color="#ffffff" />
                                        ) : (
                                            <>
                                                <Wallet className="w-5 h-5" />
                                                <span className="font-medium">Confirm Top-Up</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        </>
    );
};

export default UserPayment;
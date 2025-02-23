import { useState } from "react";

const UserEmailPage = () => {
    const [subscribed, setSubscribed] = useState(true);

    return (
        <div className="bg-gray-100 w-full mx-auto min-h-screen py-2">
            <div className="max-w-3xl bg-gray-100 rounded-lg p-12">
                <h1 className="text-2xl font-semibold mb-4">Email Preferences</h1>
                <p className="text-gray-700 w-full mb-6">
                    Manage your GameVerse Hub email subscription preferences for news, surveys, and special offers. Transactional emails such as purchase receipts, email verification, password resets, and two-factor authentication are not affected by your subscription preference.
                </p>

                <h2 className="text-xl font-bold mb-4">Subscribe/Unsubscribe</h2>

                <label className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={subscribed}
                        onChange={() => setSubscribed(!subscribed)}
                        className="w-6 h-6 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                    />
                    <span className="text-gray-800">I would like to receive news, surveys, and special offers from GameVerse Hub.</span>
                </label>

                <button className="mt-6 text-blue-600 hover:underline text-sm">MANAGE EMAIL PREFERENCES ▼</button>
            </div >

        </div >

    );
};

export default UserEmailPage;
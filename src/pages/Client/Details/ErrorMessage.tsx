import React from 'react';

interface ErrorProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorProps> = ({ message }) => {
    return (
        <div className="w-full py-10 bg-[#101014] text-white px-4 md:px-10">
            <div className="text-red-400 text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default ErrorMessage;
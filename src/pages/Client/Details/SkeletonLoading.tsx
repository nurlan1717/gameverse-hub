import React from 'react';

const SkeletonLoading: React.FC = () => {
    return (
        <div className="w-full py-10 bg-[#101014] text-white px-4 md:px-10 animate-pulse">
            <div className="mb-8">
                <div className="h-8 bg-[#121216] rounded w-1/2 mb-4"></div>
                <div className="flex items-center gap-4">
                    <div className="h-4 bg-[#121216] rounded w-1/4"></div>
                    <div className="h-4 bg-[#121216] rounded w-1/4"></div>
                    <div className="h-4 bg-[#121216] rounded w-1/4"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <div className="h-96 bg-[#121216] rounded-lg"></div>
                </div>
                <div className="bg-[#121216] rounded-lg p-6 shadow-lg">
                    <div className="h-48 bg-[#1F1F23] rounded-lg mb-4"></div>
                    <div className="h-8 bg-[#1F1F23] rounded w-1/2 mb-4"></div>
                    <div className="flex flex-col gap-4">
                        <div className="h-12 bg-[#1F1F23] rounded"></div>
                        <div className="h-12 bg-[#1F1F23] rounded"></div>
                        <div className="h-12 bg-[#1F1F23] rounded"></div>
                    </div>
                </div>
            </div>

            <div className="bg-[#121216] rounded-lg p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                        <div className="h-8 bg-[#1F1F23] rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-[#1F1F23] rounded w-full mb-2"></div>
                        <div className="h-4 bg-[#1F1F23] rounded w-full mb-2"></div>
                        <div className="h-4 bg-[#1F1F23] rounded w-full mb-2"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                        <div className="h-8 bg-[#1F1F23] rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-[#1F1F23] rounded w-full mb-2"></div>
                        <div className="h-4 bg-[#1F1F23] rounded w-full mb-2"></div>
                        <div className="h-4 bg-[#1F1F23] rounded w-full mb-2"></div>
                    </div>
                    <div>
                        <div className="h-8 bg-[#1F1F23] rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-[#1F1F23] rounded w-full mb-2"></div>
                    </div>
                    <div>
                        <div className="h-8 bg-[#1F1F23] rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-[#1F1F23] rounded w-full mb-2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoading;
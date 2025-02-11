
const SkeletonLoading = () => {
    return (
        <div className="animate-pulse">
            <div className="w-full max-w-6xl bg-gray-100 rounded-lg p-8 shadow-md">
                <h1 className="h-8 bg-gray-300 rounded w-1/4 mb-6"></h1>
                <p className="h-4 bg-gray-300 rounded w-1/2 mb-8"></p>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr>
                                {[...Array(6)].map((_, index) => (
                                    <th key={index} className="px-6 py-3">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[...Array(5)].map((_, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    {[...Array(6)].map((_, index) => (
                                        <td key={index} className="px-6 py-4">
                                            <div className="h-16 bg-gray-300 rounded"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoading;
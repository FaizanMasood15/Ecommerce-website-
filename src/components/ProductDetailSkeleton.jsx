import React from 'react';

const ProductDetailSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="bg-hero-box py-6 md:py-8">
                <div className="container mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
            </div>

            {/* Product Details Section Skeleton */}
            <div className="py-16">
                <div className="container mx-auto max-w-7xl px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left Side: Images Skeleton */}
                    <div className="flex space-x-4">
                        {/* Thumbnails Column */}
                        <div className="flex flex-col space-y-4 pr-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-24 h-24 bg-gray-300 rounded-lg"></div>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-grow">
                            <div className="w-full h-[500px] bg-gray-300 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Right Side: Details Skeleton */}
                    <div className="space-y-6">
                        <div className="h-10 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/4"></div>

                        {/* Rating Skeleton */}
                        <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                ))}
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-24"></div>
                        </div>

                        {/* Description Skeleton */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                        </div>

                        {/* Size/Color Selectors Skeleton */}
                        <div className="space-y-3 pt-4">
                            <div className="h-5 bg-gray-300 rounded w-16"></div>
                            <div className="flex space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
                            <div className="w-32 h-12 bg-gray-300 rounded-lg"></div>
                            <div className="w-48 h-12 bg-gray-300 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailSkeleton;

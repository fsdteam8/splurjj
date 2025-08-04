"use client";
import React from "react";

const FirstContentsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Skeleton for First Post */}
      <div className="mb-16">
        <div className="lg:flex items-center gap-4 mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 py-2 px-4 rounded text-sm md:text-base h-8 w-24 animate-pulse"></div>
            <div className="bg-gray-200 py-2 px-4 rounded text-sm md:text-base h-8 w-24 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-200 h-10 w-3/4 rounded animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-full rounded animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-5/6 rounded animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-2/3 rounded animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-1/4 rounded animate-pulse"></div>
        </div>
        <div className="mt-8">
          <div className="bg-gray-200 w-full h-[680px] rounded animate-pulse"></div>
        </div>
      </div>

      {/* Skeleton for Second Post */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="col-span-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gray-200 py-1 px-3 rounded text-sm h-6 w-20 animate-pulse"></div>
            <div className="bg-gray-200 py-1 px-3 rounded text-sm h-6 w-20 animate-pulse"></div>
          </div>
          <div className="bg-gray-200 h-8 w-2/3 rounded animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-1/3 rounded mt-2 animate-pulse"></div>
          <div className="flex items-center gap-3 mt-2">
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
          </div>
          <div className="bg-gray-200 h-4 w-full rounded mt-2 animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-5/6 rounded mt-1 animate-pulse"></div>
        </div>
        <div className="col-span-5 lg:col-span-3">
          <div className="bg-gray-200 w-full h-[315px] rounded animate-pulse"></div>
        </div>
      </div>

      {/* Skeleton for Third Post */}
      <div className="mb-8">
        <div className="bg-gray-200 w-full h-[443px] rounded animate-pulse"></div>
        <div className="py-4">
          <div className="md:flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 py-1 px-3 rounded text-sm h-6 w-20 animate-pulse"></div>
              <div className="bg-gray-200 py-1 px-3 rounded text-sm h-6 w-20 animate-pulse"></div>
            </div>
            <div className="bg-gray-200 h-4 w-1/3 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="bg-gray-200 h-8 w-2/3 rounded animate-pulse"></div>
          <div className="flex items-center gap-3 mt-2">
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
          </div>
          <div className="bg-gray-200 h-4 w-full rounded mt-2 animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-5/6 rounded mt-1 animate-pulse"></div>
        </div>
      </div>

      {/* Skeleton for Fourth and Fifth Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 py-1 px-3 rounded text-sm h-6 w-20 animate-pulse"></div>
              <div className="bg-gray-200 py-1 px-3 rounded text-sm h-6 w-20 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0 lg:mt-4">
              <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
              <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
              <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="bg-gray-200 h-8 w-2/3 rounded animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-1/3 rounded mt-2 animate-pulse"></div>
          <div className="bg-gray-200 w-full h-[300px] rounded animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 py-1 px-3 rounded text-sm h-6 w-20 animate-pulse"></div>
              <div className="bg-gray-200 py-1 px-3 rounded text-sm h-6 w-20 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0 lg:mt-4">
              <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
              <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
              <div className="bg-gray-200 h-6 w-6 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="bg-gray-200 h-8 w-2/3 rounded animate-pulse"></div>
          <div className="bg-gray-200 h-4 w-1/3 rounded mt-2 animate-pulse"></div>
          <div className="bg-gray-200 w-full h-[300px] rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FirstContentsSkeleton;
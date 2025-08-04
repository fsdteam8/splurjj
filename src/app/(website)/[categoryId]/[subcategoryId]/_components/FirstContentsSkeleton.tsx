import React from "react";

const FirstContentsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Featured Article (firstPost) */}
      <div className="mb-16">
        <div className="space-y-4">
          {/* Category/Subcategory and Icons */}
          <div className="lg:flex block items-center gap-4 mb-4 space-y-4 md:space-y-0">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 h-8 w-24 rounded" />
              <div className="bg-gray-200 h-8 w-28 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 h-6 w-6 rounded-full" />
              <div className="bg-gray-200 h-6 w-6 rounded-full" />
              <div className="bg-gray-200 h-6 w-6 rounded-full" />
            </div>
          </div>
          {/* Heading, Body, Author/Date */}
          <div className="space-y-4">
            <div className="bg-gray-200 h-12 w-3/4 rounded" />
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 w-full rounded" />
              <div className="bg-gray-200 h-4 w-5/6 rounded" />
              <div className="bg-gray-200 h-4 w-4/5 rounded" />
            </div>
            <div className="bg-gray-200 h-4 w-1/3 rounded" />
          </div>
        </div>
        {/* Image */}
        <div className="mt-8">
          <div className="bg-gray-200 w-full h-[680px] rounded" />
        </div>
      </div>

      {/* Second Post (Text left, Image right) */}
      <div>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 lg:col-span-2 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gray-200 h-6 w-20 rounded" />
              <div className="bg-gray-200 h-6 w-24 rounded" />
            </div>
            <div className="bg-gray-200 h-8 w-3/4 rounded" />
            <div className="bg-gray-200 h-4 w-1/2 rounded" />
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 h-6 w-6 rounded-full" />
              <div className="bg-gray-200 h-6 w-6 rounded-full" />
              <div className="bg-gray-200 h-6 w-6 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 w-full rounded" />
              <div className="bg-gray-200 h-4 w-5/6 rounded" />
              <div className="bg-gray-200 h-4 w-4/5 rounded" />
            </div>
          </div>
          <div className="col-span-5 lg:col-span-3">
            <div className="bg-gray-200 w-full h-[315px] rounded" />
          </div>
        </div>
      </div>

      {/* Third Post (Image top, Text bottom) */}
      <div className="mt-8">
        <div className="bg-gray-200 w-full h-[443px] rounded" />
        <div className="py-4 space-y-2">
          <div className="md:flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 h-6 w-20 rounded" />
              <div className="bg-gray-200 h-6 w-24 rounded" />
            </div>
            <div className="bg-gray-200 h-4 w-1/3 rounded" />
          </div>
          <div className="bg-gray-200 h-8 w-3/4 rounded" />
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 h-6 w-6 rounded-full" />
            <div className="bg-gray-200 h-6 w-6 rounded-full" />
            <div className="bg-gray-200 h-6 w-6 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="bg-gray-200 h-4 w-full rounded" />
            <div className="bg-gray-200 h-4 w-5/6 rounded" />
            <div className="bg-gray-200 h-4 w-4/5 rounded" />
          </div>
        </div>
      </div>

      {/* Fourth and Fifth Posts (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-200 h-6 w-20 rounded" />
                <div className="bg-gray-200 h-6 w-24 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 h-6 w-6 rounded-full" />
                <div className="bg-gray-200 h-6 w-6 rounded-full" />
                <div className="bg-gray-200 h-6 w-6 rounded-full" />
              </div>
            </div>
            <div className="bg-gray-200 h-8 w-3/4 rounded" />
            <div className="bg-gray-200 h-4 w-1/2 rounded" />
            <div className="bg-gray-200 w-full h-[300px] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstContentsSkeleton;
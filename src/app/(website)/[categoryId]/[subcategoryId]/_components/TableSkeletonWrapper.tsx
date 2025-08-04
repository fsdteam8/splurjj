import React from "react";

const TableSkeletonWrapper: React.FC<{ ariaLabel?: string }> = ({
  ariaLabel = "Loading content",
}) => {
  return (
    <div className="container mx-auto px-4" aria-label={ariaLabel}>
      {/* Grid layout matching AllContentContainer */}
      <div className="grid grid-cols-8 gap-4 pt-16 pb-2">
        {/* Main content area (col-span-6 for lg screens) */}
        <div className="col-span-8 md:col-span-5 lg:col-span-6 pb-16">
          <div className="space-y-6 animate-pulse">
            {/* Placeholder for FirstContents (assuming a larger featured article) */}
            <div className="space-y-4">
              <div className="bg-gray-200 h-[400px] w-full rounded" /> {/* Featured image */}
              <div className="space-y-2">
                <div className="bg-gray-200 h-8 w-3/4 rounded" /> {/* Heading */}
                <div className="bg-gray-200 h-4 w-1/2 rounded" /> {/* Subheading */}
                <div className="bg-gray-200 h-4 w-1/3 rounded" /> {/* Author/Date */}
              </div>
            </div>

            {/* Placeholder for SecondContents (grid of cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2 overflow-hidden">
                  <div className="bg-gray-200 h-[300px] w-full rounded" /> {/* Card image */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 h-6 w-20 rounded" /> {/* Category */}
                        <div className="bg-gray-200 h-6 w-24 rounded" /> {/* Subcategory */}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-200 h-6 w-6 rounded-full" /> {/* Share icon */}
                        <div className="bg-gray-200 h-6 w-6 rounded-full" /> {/* Target icon */}
                        <div className="bg-gray-200 h-6 w-6 rounded-full" /> {/* Comment icon */}
                      </div>
                    </div>
                    <div className="bg-gray-200 h-8 w-3/4 rounded" /> {/* Heading */}
                    <div className="bg-gray-200 h-4 w-1/2 rounded" /> {/* Author/Date */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Vertical ad placeholder) */}
        <div className="col-span-8 md:col-span-3 lg:col-span-2">
          <div className="sticky top-[120px] mb-2">
            <div className="bg-gray-200 h-[600px] w-full rounded animate-pulse" /> {/* Vertical ad */}
          </div>
        </div>
      </div>

      {/* Horizontal ad placeholder */}
      <div className="my-4">
        <div className="bg-gray-200 h-[100px] w-full rounded animate-pulse" /> {/* Horizontal ad */}
      </div>
    </div>
  );
};

export default TableSkeletonWrapper;
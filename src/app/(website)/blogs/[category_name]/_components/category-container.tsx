"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiResponse } from "./blog-post-types";
import Vertical from "@/components/adds/vertical";
import CategoryContents from "./categoryContents";

interface CategoryContainerProps {
  categoryName: string;
}

function CategoryContainer({ categoryName }: CategoryContainerProps) {
  const limit = 9;
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async ({ pageParam = 1 }) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ;
    const response = await fetch(
      `${backendUrl}/api/home/${categoryName}?page=${pageParam}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json() as Promise<ApiResponse>;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["category-all-blogs", categoryName],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.meta) {
        return lastPage.meta.current_page < lastPage.meta.last_page
          ? lastPage.meta.current_page + 1
          : undefined;
      }
      return lastPage.data.length === limit ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const capitalize = (str: string) =>
    decodeURIComponent(str)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="container mx-auto px-1 md:px-4">
      <div className="text-center pt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          {capitalize(categoryName)} Content
        </h1>
      </div>
      <div className="grid grid-cols-8 gap-4 py-16">
        <div className="col-span-8 md:col-span-5 lg:col-span-6">
          <CategoryContents
            posts={posts}
            loading={isLoading}
            error={error?.message || null}
          />
          {hasNextPage && (
            <div ref={observerRef} className="h-10">
              {isFetchingNextPage && (
                <div className="text-center py-4">
                  <Loader2 className="animate-spin w-8 h-8 mx-auto" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="col-span-8 md:col-span-3 lg:col-span-2">
          <div className="sticky top-[120px]">
            <Vertical />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryContainer;










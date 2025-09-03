"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { BlogPost, ApiResponse } from "./blog-post-types";
import Vertical from "@/components/adds/vertical";
import CategoryContents from "./categoryContents";

function CategoryContainer({ categoryName }: { categoryName: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const limit = 9;

  const fetchData = useCallback(
    async (page: number, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setPosts([]);
          setCurrentPage(1);
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://default-api-url.com";
        const response = await fetch(
          `${backendUrl}/api/home/${categoryName}?page=${page}&limit=${limit}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data: ApiResponse = await response.json();

        if (isLoadMore) {
          setPosts((prev) => [...prev, ...data.data]);
        } else {
          setPosts(data.data || []);
        }

        if (data.meta) {
          setHasMore(page < data.meta.last_page);
        } else {
          setHasMore(data.data.length === limit);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [categoryName, limit]
  );

  useEffect(() => {
    fetchData(1);
  }, [categoryName, fetchData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchData(nextPage, true);
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
  }, [currentPage, hasMore, loadingMore, loading, fetchData]);

  const capitalize = (str: string) =>
    decodeURIComponent(str)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="container mx-auto px-4">
      <div className="text-center pt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          {capitalize(categoryName)} Content
        </h1>
      </div>
      <div className="grid grid-cols-8 gap-4 py-16">
        <div className="col-span-8 md:col-span-5 lg:col-span-6">
          <CategoryContents
            posts={posts}
            loading={loading}
            error={error}
          />
          {hasMore && (
            <div ref={observerRef} className="h-10">
              {loadingMore && (
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
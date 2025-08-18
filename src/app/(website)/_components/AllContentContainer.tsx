"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import FirstContents from "../[categoryId]/[subcategoryId]/_components/FeaturedArticle";
import SecondContents from "../[categoryId]/[subcategoryId]/_components/ContentCard";
import Horizontal from "@/components/adds/horizontal";
import Vertical from "@/components/adds/vertical";

interface Post {
  id: number;
  heading: string;
  sub_heading: string;
  author: string;
  date: string;
  body1: string;
  category_name: string;
  sub_category_name: string;
  image1: string | null;
  imageLink: string | null;
  advertising_image: string | null;
  advertisingLink: string | null;
  status: string;
  tags: string[];
  category_id: number;
  subcategory_id: number;
}

interface ContentAllDataTypeResponse {
  success: boolean;
  data: Post[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

const AllContentContainer = ({
  categoryId,
  subcategoryId,
}: {
  categoryId: string;
  subcategoryId: string;
}) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  console.log(error)

  const fetchData = useCallback(
    async (page: number, isLoadMore = false) => {
      if (isLoadMore) setLoadingMore(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${categoryId}/${subcategoryId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }

        const result: ContentAllDataTypeResponse = await response.json();
        if (!result.success) {
          throw new Error("API returned unsuccessful response");
        }

        const newPosts = result.data || [];
        const filteredPosts = newPosts.map((post) => ({
          ...post,
          tags: post.tags.filter((tag) => tag.trim() !== ""),
        }));

        setAllPosts((prev) =>
          isLoadMore ? [...prev, ...filteredPosts] : filteredPosts
        );
        setHasMore(page < result.meta.last_page);
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasMore(false);
        setError("Failed to load more content. Please try again later.");
      } finally {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false); // Update loading state
        }
      }
    },
    [categoryId, subcategoryId]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = Math.ceil(allPosts.length / 10) + 1;
          fetchData(nextPage, true);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [allPosts.length, hasMore, loadingMore, fetchData]);

  if (!allPosts.length && !loading && !loadingMore) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-8 h-screen" role="alert" aria-live="polite">
          <p className="text-lg text-gray-700">
            No content available for this category and subcategory.
          </p>
        </div>
      </div>
    );
  }

  const featuredPosts = allPosts.length > 0 ? allPosts.slice(0, 5) : [];
  const remainingPosts = allPosts.length > 5 ? allPosts.slice(5) : [];

  return (
    <div className="">
      <div className="container grid grid-cols-8 gap-4 pt-16 pb-2">
        <div className="col-span-8 md:col-span-3 lg:col-span-2">
          <div className="sticky top-[120px] mb-2">
            <Vertical />
          </div>
        </div>
        <div className="col-span-8 md:col-span-5 lg:col-span-6 pb-16">
          <FirstContents posts={featuredPosts} loading={loading} />
        </div>
      </div>
      <Horizontal />
      {remainingPosts.length > 0 && (
        <div className="container grid grid-cols-8 gap-4 pt-16 pb-2">
        <div className="col-span-8 md:col-span-5 lg:col-span-6 pb-16">
          <SecondContents
            categoryId={categoryId}
            subcategoryId={subcategoryId}
          />
        </div>
        <div className="col-span-8 md:col-span-3 lg:col-span-2">
          <div className="sticky top-[120px] mb-2">
            <Vertical />
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AllContentContainer;
"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
// import { ApiResponse } from "./blog-post-types";
import Vertical from "@/components/adds/vertical";
import { ApiResponse } from "../blogs/[category_name]/_components/blog-post-types";
import CategoryContents from "../blogs/[category_name]/_components/categoryContents";
// import CategoryContents from "./categoryContents";

interface CategoryContainerProps {
  categoryId: string;
  subcategoryId: string;
}

function CategoryContainer({ categoryId, subcategoryId }: CategoryContainerProps) {
  const limit = 9;
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async ({ pageParam = 1 }) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ;
    const response = await fetch(
      `${backendUrl}/api/contents/${categoryId}/${subcategoryId}?page=${pageParam}&limit=${limit}`
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
    queryKey: ["category-all-blogs", categoryId, subcategoryId],
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
          {capitalize(subcategoryId)} Content
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












// "use client";
// import { useState, useRef, useCallback, useEffect } from "react";
// import FirstContents from "../[categoryId]/[subcategoryId]/_components/FeaturedArticle";
// import SecondContents from "../[categoryId]/[subcategoryId]/_components/ContentCard";
// import Horizontal from "@/components/adds/horizontal";
// import Vertical from "@/components/adds/vertical";

// interface Post {
//   id: number;
//   heading: string;
//   sub_heading: string;
//   author: string;
//   date: string;
//   body1: string;
//   category_name: string;
//   sub_category_name: string;
//   image1: string | null;
//   imageLink: string | null;
//   advertising_image: string | null;
//   advertisingLink: string | null;
//   status: string;
//   tags: string[];
//   category_id: number;
//   subcategory_id: number;
//   cat_slug: string;
//   sub_slug: string;
//   slug: string;
//   likes_count: number;
//   shares_count: number;
//   comment_count: number;
// }

// interface ContentAllDataTypeResponse {
//   success: boolean;
//   data: Post[];
//   meta: {
//     current_page: number;
//     per_page: number;
//     total: number;
//     last_page: number;
//   };
// }

// const AllContentContainer = ({
//   categoryId,
//   subcategoryId,
// }: {
//   categoryId: string;
//   subcategoryId: string;
// }) => {
//   const [allPosts, setAllPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true); // Added loading state
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const observerRef = useRef<HTMLDivElement>(null);

//   // console.log(categoryId, subcategoryId, "categoryId");

//   console.log(error);

//   const fetchData = useCallback(
//     async (page: number, isLoadMore = false) => {
//       if (isLoadMore) setLoadingMore(true);
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${categoryId}/${subcategoryId}`
//         );
//         if (!response.ok) {
//           throw new Error(`Failed to fetch content: ${response.statusText}`);
//         }

//         const result: ContentAllDataTypeResponse = await response.json();
//         if (!result.success) {
//           throw new Error("API returned unsuccessful response");
//         }

//         const newPosts = result.data || [];
//         const filteredPosts = newPosts.map((post) => ({
//           ...post,
//           tags: post.tags.filter((tag) => tag.trim() !== ""),
//         }));

//         setAllPosts((prev) =>
//           isLoadMore ? [...prev, ...filteredPosts] : filteredPosts
//         );
//         setHasMore(page < result.meta.last_page);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setHasMore(false);
//         setError("Failed to load more content. Please try again later.");
//       } finally {
//         if (isLoadMore) {
//           setLoadingMore(false);
//         } else {
//           setLoading(false); // Update loading state
//         }
//       }
//     },
//     [categoryId, subcategoryId]
//   );

//   useEffect(() => {
//     fetchData(1);
//   }, [fetchData]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loadingMore) {
//           const nextPage = Math.ceil(allPosts.length / 10) + 1;
//           fetchData(nextPage, true);
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (observerRef.current) {
//       observer.observe(observerRef.current);
//     }

//     return () => observer.disconnect();
//   }, [allPosts.length, hasMore, loadingMore, fetchData]);

//   if (!allPosts.length && !loading && !loadingMore) {
//     return (
//       <div className="container mx-auto px-4">
//         <div
//           className="text-center py-8 h-screen"
//           role="alert"
//           aria-live="polite"
//         >
//           <p className="text-lg text-gray-700">
//             No content available for this category and subcategory.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const featuredPosts = allPosts.length > 0 ? allPosts.slice(0, 5) : [];
//   const remainingPosts = allPosts.length > 5 ? allPosts.slice(5) : [];

//   return (
//     <div className="">
//       <div className="container grid grid-cols-8 gap-4 pt-16 pb-2">
//         <div className="col-span-8 md:col-span-3 lg:col-span-2">
//           <div className="sticky top-[120px] mb-2">
//             <Vertical />
//           </div>
//         </div>
//         <div className="col-span-8 md:col-span-5 lg:col-span-6 pb-16">
//           <FirstContents posts={featuredPosts} loading={loading} />
//         </div>
//       </div>
//       {/* <Horizontal /> */}
//       <div className="hidden md:block">
//         <Horizontal />
//       </div>
//       {remainingPosts.length > 0 && (
//         <div className="container grid grid-cols-8 gap-4 pt-16 pb-2">
//           <div className="col-span-8 md:col-span-5 lg:col-span-6 pb-16">
//             <SecondContents
//               categoryId={categoryId}
//               subcategoryId={subcategoryId}
//             />
//           </div>
//           <div className="col-span-8 md:col-span-3 lg:col-span-2">
//             <div className="sticky top-[120px] mb-2">
//               <Vertical />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllContentContainer;

"use client";

import Image from "next/image";
import Link from "next/link";
import {  useRef, useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { SlLike } from "react-icons/sl";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SocialShareContent from "@/components/ui/SocialShareContent";

interface BlogPost {
  id: number;
  category_id: number;
  subcategory_id: number;
  category_name: string;
  sub_category_name: string;
  heading: string;
  author: string;
  date: string;
  sub_heading: string;
  body1: string;
  image1: string;
  image2: string[];
  advertising_image: string | null;
  tags: string | string[];
  created_at: string;
  updated_at: string;
  imageLink: string | null;
  advertisingLink: string | null;
  user_id: number;
  status: string;
  image1_url: string;
  advertising_image_url: string | null;
  likes_count: number;
  shares_count: number;
  comment_count: number;
  cat_slug: string;
  sub_slug: string;
  slug: string;
}

interface ApiResponse {
  success: boolean;
  data: BlogPost[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

interface ViewAuthorPostProps {
  userId: number;
}

function ViewAuthorPost({ userId }: ViewAuthorPostProps) {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();
  const observerRef = useRef<HTMLDivElement>(null);
  const limit = 9;

  // Like post API logic
  const { mutate: handleLike } = useMutation({
    mutationKey: ["like-post"],
    mutationFn: async (postId: number) =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${postId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["author-posts", userId] });
    },
  });

  // Fetch posts using Tanstack Query's useInfiniteQuery
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["author-posts", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/view-posts/${userId}?page=${pageParam}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (!data.success) {
        throw new Error("Failed to fetch posts");
      }
      return data;
    },
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Set up Intersection Observer for infinite scroll
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

  // Sanitize HTML content
  const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  };

  function convertToCDNUrl(image2?: string): string {
    const image2BaseUrl = "https://s3.amazonaws.com/splurjjimages/images";
    const cdnBaseUrl = "https://dsfua14fu9fn0.cloudfront.net/images";

    if (typeof image2 === "string" && image2.startsWith(image2BaseUrl)) {
      return image2.replace(image2BaseUrl, cdnBaseUrl);
    }

    return image2 || "";
  }

  function getImageUrl(image2?: string) {
    if (!image2) return "";

    try {
      const parsed = JSON.parse(image2);
      if (parsed?.image2) {
        return convertToCDNUrl(parsed.image2);
      }
    } catch {
      return convertToCDNUrl(image2);
    }

    return "";
  }

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="relative">
            <div className="bg-gray-300 w-full h-[300px] rounded-t-lg"></div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
              </div>
              <div className="bg-gray-300 h-8 w-3/4 rounded mt-2"></div>
              <div className="bg-gray-300 h-4 w-1/2 rounded mt-2"></div>
              <div className="flex items-center gap-3 mt-2">
                <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
              </div>
              <div className="bg-gray-300 h-4 w-full rounded mt-2"></div>
              <div className="bg-gray-300 h-4 w-5/6 rounded mt-2"></div>
              <div className="bg-gray-300 h-4 w-2/3 rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Flatten posts from pages
  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  if (status === "pending" && posts.length === 0) return <SkeletonLoader />;
  if (status === "error")
    return <div className="text-center py-8">Error: {error?.message}</div>;
  if (!posts.length)
    return (
      <div className="text-center py-8">No posts found for this author.</div>
    );

  return (
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="relative">
            <div className="overflow-hidden">
              <Link href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}`}>
                <Image
                  src={getImageUrl(post.image2?.[0] || "")}
                  alt={sanitizeHTML(post.heading)}
                  width={400}
                  height={300}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  priority
                />
              </Link>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/blogs/${post.cat_slug}`}
                  className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {post.category_name || "Category"}
                </Link>
                <Link
                  href={`/${post.cat_slug}/${post.sub_slug}`}
                  className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {post.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <Link href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}`}>
                <motion.p
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(post.heading),
                  }}
                  className="text-2xl font-medium line-clamp-2"
                  whileHover={{
                    scaleX: 1.05,
                    transformOrigin: "left",
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {post.author} - {post.date}
              </p>
              <div className="flex items-center gap-5 relative mt-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(post?.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {post?.likes_count || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Link
                    href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}#comment`}
                  >
                    <button className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 cursor-pointer mt-1" />
                    </button>
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {post?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={post.slug}
                  categoryId={post.cat_slug}
                  subcategoryId={post.sub_slug}
                  heading={post.heading}
                  subHeading={post.sub_heading}
                  initialSharesCount={post.shares_count || 0}
                  token={token}
                />
                <TbTargetArrow className="w-6 h-6 cursor-pointer" />
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(post.sub_heading),
                }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          </div>
        ))}
      </div>
      {isFetchingNextPage && (
       <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2 text-muted-foreground">
            Loading more content...
          </span>
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
}

export default ViewAuthorPost;



















// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { FaRegCommentDots } from "react-icons/fa";
// import { TbTargetArrow } from "react-icons/tb";
// import { Loader2 } from "lucide-react";
// import DOMPurify from "dompurify";
// import { motion } from "framer-motion";
// import { SlLike } from "react-icons/sl";
// import { useSession } from "next-auth/react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import SocialShareContent from "@/components/ui/SocialShareContent";

// interface BlogPost {
//   id: number;
//   category_id: number;
//   subcategory_id: number;
//   category_name: string;
//   sub_category_name: string;
//   heading: string;
//   author: string;
//   date: string;
//   sub_heading: string;
//   body1: string;
//   image1: string;
//   image2: string[];
//   advertising_image: string | null;
//   tags: string | string[];
//   created_at: string;
//   updated_at: string;
//   imageLink: string | null;
//   advertisingLink: string | null;
//   user_id: number;
//   status: string;
//   image1_url: string;
//   advertising_image_url: string | null;
//   likes_count: number;
//   shares_count: number;
//   comment_count: number;
//   cat_slug: string;
//   sub_slug: string;
//   slug: string;
// }

// interface ApiResponse {
//   success: boolean;
//   data: BlogPost[];
//   meta: {
//     current_page: number;
//     last_page: number;
//     total: number;
//     per_page: number;
//   };
// }

// interface ViewAuthorPostProps {
//   userId: number;
// }

// function ViewAuthorPost({ userId }: ViewAuthorPostProps) {
//   const [posts, setPosts] = useState<BlogPost[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalItems, setTotalItems] = useState(0);
//   // const shareMenuRef = useRef<HTMLDivElement>(null);
//   const observerRef = useRef<HTMLDivElement>(null);
//   const limit = 9;

//   console.log(totalItems);

//   const session = useSession();
//   const token = (session?.data?.user as { token: string })?.token;
//   const queryClient = useQueryClient();

//   // Like post API logic
//   const { mutate: handleLike } = useMutation({
//     mutationKey: ["like-post"],
//     mutationFn: async (postId: number) =>
//       await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${postId}/like`,
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       ).then((res) => res.json()),
//     onSuccess: (data) => {
//       if (!data?.success) {
//         toast.error(data?.message || "Something went wrong");
//         return;
//       }
//       queryClient.invalidateQueries({ queryKey: ["tag-posts"] });
//     },
//   });

//   // Fetch posts by user ID
//   const fetchPostsByUser = useCallback(
//     async (page: number, isLoadMore = false) => {
//       try {
//         if (isLoadMore) {
//           setLoadingMore(true);
//         } else {
//           setLoading(true);
//         }

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/view-posts/${userId}?page=${page}&limit=${limit}`
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data: ApiResponse = await response.json();
//         console.log("Fetched posts:", data);

//         if (data.success) {
//           if (isLoadMore) {
//             setPosts((prev) => [...prev, ...data.data]);
//           } else {
//             setPosts(data.data);
//           }
//           setTotalItems(data.meta.total);
//           setHasMore(page < data.meta.last_page);
//         } else {
//           throw new Error("Failed to fetch posts");
//         }
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "An unknown error occurred"
//         );
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [userId, limit]
//   );

//   // Initial fetch
//   useEffect(() => {
//     fetchPostsByUser(1);
//   }, [fetchPostsByUser]);

//   // Set up Intersection Observer for infinite scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const target = entries[0];
//         if (target.isIntersecting && hasMore && !loadingMore && !loading) {
//           const nextPage = currentPage + 1;
//           setCurrentPage(nextPage);
//           fetchPostsByUser(nextPage, true);
//         }
//       },
//       {
//         root: null,
//         rootMargin: "100px",
//         threshold: 0.1,
//       }
//     );

//     const currentObserverRef = observerRef.current;
//     if (currentObserverRef) {
//       observer.observe(currentObserverRef);
//     }

//     return () => {
//       if (currentObserverRef) {
//         observer.unobserve(currentObserverRef);
//       }
//     };
//   }, [currentPage, hasMore, loadingMore, loading, fetchPostsByUser]);

//   // Sanitize HTML content
//   const sanitizeHTML = (html: string) => {
//     return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
//   };

//   function convertToCDNUrl(image2?: string): string {
//     const image2BaseUrl = "https://s3.amazonaws.com/splurjjimages/images";
//     const cdnBaseUrl = "https://dsfua14fu9fn0.cloudfront.net/images";

//     if (typeof image2 === "string" && image2.startsWith(image2BaseUrl)) {
//       return image2.replace(image2BaseUrl, cdnBaseUrl);
//     }

//     return image2 || "";
//   }

//   function getImageUrl(image2?: string) {
//     if (!image2) return "";

//     try {
//       const parsed = JSON.parse(image2);
//       if (parsed?.image2) {
//         return convertToCDNUrl(parsed.image2);
//       }
//     } catch {
//       return convertToCDNUrl(image2);
//     }

//     return "";
//   }

//   // Skeleton Loader Component
//   const SkeletonLoader = () => (
//     <div className="animate-pulse">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {Array.from({ length: limit }).map((_, index) => (
//           <div key={index} className="relative">
//             {/* Image */}
//             <div className="bg-gray-300 w-full h-[300px] rounded-t-lg"></div>
//             {/* Content */}
//             <div className="p-4">
//               <div className="flex items-center gap-2">
//                 <div className="bg-gray-300 h-6 w-20 rounded"></div>
//                 <div className="bg-gray-300 h-6 w-20 rounded"></div>
//               </div>
//               <div className="bg-gray-300 h-8 w-3/4 rounded mt-2"></div>
//               <div className="bg-gray-300 h-4 w-1/2 rounded mt-2"></div>
//               <div className="flex items-center gap-3 mt-2">
//                 <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//                 <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//                 <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//               </div>
//               <div className="bg-gray-300 h-4 w-full rounded mt-2"></div>
//               <div className="bg-gray-300 h-4 w-5/6 rounded mt-2"></div>
//               <div className="bg-gray-300 h-4 w-2/3 rounded mt-2"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   if (loading && posts.length === 0) return <SkeletonLoader />;
//   if (error) return <div className="text-center py-8">Error: {error}</div>;
//   if (!posts.length && !loading)
//     return (
//       <div className="text-center py-8">No posts found for this author.</div>
//     );

//   return (
//     <div className="container">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {posts.map((post) => (
//           <div key={post.id} className="relative">
//             <div className="overflow-hidden">
//               <Link href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}`}>
//                 <Image
//                   src={getImageUrl(post.image2?.[0] || "")}
//                   alt={sanitizeHTML(post.heading)}
//                   width={400}
//                   height={300}
//                   className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
//                   priority
//                 />
//               </Link>
//             </div>
//             <div className="p-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Link
//                   href={`/blogs/${post.cat_slug}`}
//                   className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
//                 >
//                   {post.category_name || "Category"}
//                 </Link>
//                 <Link
//                   href={`/${post.cat_slug}/${post.sub_slug}`}
//                   className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
//                 >
//                   {post.sub_category_name || "Subcategory"}
//                 </Link>
//               </div>
//               <Link href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}`}>
//                 <motion.p
//                   dangerouslySetInnerHTML={{
//                     __html: sanitizeHTML(post.heading),
//                   }}
//                   className="text-2xl font-medium line-clamp-2"
//                   whileHover={{
//                     scaleX: 1.05,
//                     transformOrigin: "left", // Ensures scaling happens from the left side
//                     fontWeight: 900,
//                     transition: { duration: 0.3 },
//                   }}
//                 />
//               </Link>
//               <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
//                 {post.author} - {post.date}
//               </p>

//               {/* social icon start */}
//               <div className="flex items-center gap-5 relative mt-4">
//                 <div className="flex items-center gap-2">
//                   <button onClick={() => handleLike(post?.id)}>
//                     <SlLike className="w-6 h-6 cursor-pointer" />
//                   </button>
//                   <p className="text-lg font-medium text-black dark:text-white leading-normal">
//                     {post?.likes_count || 0}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Link
//                     href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}#comment`}
//                   >
//                     <button className="cursor-pointer">
//                       <FaRegCommentDots className="w-6 h-6 cursor-pointer mt-1" />
//                     </button>
//                   </Link>
//                   <p className="text-lg font-medium text-black dark:text-white leading-normal">
//                     {post?.comment_count || 0}
//                   </p>
//                 </div>
//                 <SocialShareContent
//                   postId={post.slug}
//                   categoryId={post.cat_slug}
//                   subcategoryId={post.sub_slug}
//                   heading={post.heading}
//                   subHeading={post.sub_heading}
//                   initialSharesCount={post.shares_count || 0}
//                   token={token}
//                 />
//                 <TbTargetArrow className="w-6 h-6 cursor-pointer" />
//               </div>

//               {/* social icon end  */}

//               <p
//                 dangerouslySetInnerHTML={{
//                   __html: sanitizeHTML(post.sub_heading),
//                 }}
//                 className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Loading indicator for infinite scroll */}
//       {loadingMore && (
//         <div className="flex justify-center items-center py-8">
//           <Loader2 className="w-8 h-8 animate-spin" />
//           <span className="ml-2 text-muted-foreground">
//             Loading more content...
//           </span>
//         </div>
//       )}

//       {/* Intersection observer target */}
//       <div ref={observerRef} className="h-10" />
//     </div>
//   );
// }

// export default ViewAuthorPost;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaRegCommentDots,
  FaTwitter,
} from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const limit = 9;

  console.log(totalItems);

  // Fetch posts by user ID
  const fetchPostsByUser = useCallback(
    async (page: number, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/view-posts/${userId}?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        console.log("Fetched posts:", data);

        if (data.success) {
          if (isLoadMore) {
            setPosts((prev) => [...prev, ...data.data]);
          } else {
            setPosts(data.data);
          }
          setTotalItems(data.meta.total);
          setHasMore(page < data.meta.last_page);
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId, limit]
  );

  // Initial fetch
  useEffect(() => {
    fetchPostsByUser(1);
  }, [fetchPostsByUser]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchPostsByUser(nextPage, true);
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
  }, [currentPage, hasMore, loadingMore, loading, fetchPostsByUser]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sanitize HTML content
  const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  };

  const getImageUrl = (path: string | null): string => {
    if (!path) return "/assets/videos/blog1.jpg";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.replace(/^\/+/, "")}`;
  };

  const getShareUrl = (
    categoryId: number,
    subcategoryId: number,
    postId: number
  ): string => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/${categoryId}/${subcategoryId}/${postId}`;
  };

  const handleShare = async (post: BlogPost) => {
    const shareUrl = getShareUrl(
      post.category_id,
      post.subcategory_id,
      post.id
    );
    const shareData = {
      title: sanitizeHTML(post.heading),
      text: sanitizeHTML(post.sub_heading || "Check out this blog post!"),
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      setShowShareMenu(showShareMenu === post.id ? null : post.id);
    }
  };

  const shareToTwitter = (url: string, text: string) => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(sanitizeHTML(text))}`,
      "_blank"
    );
  };

  const shareToFacebook = (url: string) => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareToLinkedIn = (url: string, title: string) => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(sanitizeHTML(title))}`,
      "_blank"
    );
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="relative">
            {/* Image */}
            <div className="bg-gray-300 w-full h-[300px] rounded-t-lg"></div>
            {/* Content */}
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

  if (loading && posts.length === 0) return <SkeletonLoader />;
  if (error) return <div className="text-center py-8">Error: {error}</div>;
  if (!posts.length && !loading)
    return (
      <div className="text-center py-8">No posts found for this author.</div>
    );

  return (
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="relative">
            <div className="overflow-hidden">
              <Link
                href={`/${post.category_id}/${post.subcategory_id}/${post.id}`}
              >
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
                  href={`/blogs/${encodeURIComponent(post.category_name)}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {post.category_name || "Category"}
                </Link>
                <Link
                  href={`/${post.category_id}/${post.subcategory_id}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {post.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <Link
                href={`/${post.category_id}/${post.subcategory_id}/${post.id}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(post.heading),
                  }}
                  className="text-2xl font-medium line-clamp-2"
                  whileHover={{
                    scaleX: 1.05,
                    transformOrigin: "left", // Ensures scaling happens from the left side
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {post.author} - {post.date}
              </p>
              <div className="flex items-center gap-3 mt-2 relative">
                <RiShareForwardLine
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleShare(post)}
                />
                {showShareMenu === post.id && (
                  <div
                    ref={shareMenuRef}
                    className="absolute top-8 right-0 bg-white shadow-md p-2 rounded-md flex gap-2 z-10"
                  >
                    <FaTwitter
                      className="w-6 h-6 cursor-pointer text-blue-500"
                      onClick={() =>
                        shareToTwitter(
                          getShareUrl(
                            post.category_id,
                            post.subcategory_id,
                            post.id
                          ),
                          post.heading
                        )
                      }
                    />
                    <FaFacebook
                      className="w-6 h-6 cursor-pointer text-blue-700"
                      onClick={() =>
                        shareToFacebook(
                          getShareUrl(
                            post.category_id,
                            post.subcategory_id,
                            post.id
                          )
                        )
                      }
                    />
                    <FaLinkedin
                      className="w-6 h-6 cursor-pointer text-blue-600"
                      onClick={() =>
                        shareToLinkedIn(
                          getShareUrl(
                            post.category_id,
                            post.subcategory_id,
                            post.id
                          ),
                          post.heading
                        )
                      }
                    />
                  </div>
                )}
                <TbTargetArrow className="w-6 h-6" />
                <Link
                  href={`/${post.category_id}/${post.subcategory_id}/${post.id}#comment`}
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
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

      {/* Loading indicator for infinite scroll */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2 text-muted-foreground">
            Loading more content...
          </span>
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerRef} className="h-10" />
    </div>
  );
}

export default ViewAuthorPost;

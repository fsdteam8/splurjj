"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  FaRegCommentDots,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Interface for ContentItem (assuming SearchResult is compatible)
interface ContentItem {
  id: number;
  category_id: number;
  subcategory_id: number;
  category_name?: string;
  sub_category_name?: string;
  heading: string;
  author: string;
  date: string;
  sub_heading: string;
  body1: string;
  image1: string | null;
  image2?: string | string[] | null;
  advertising_image: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  imageLink: string | null;
  advertisingLink: string | null;
  user_id: number;
  status: string;
}

// Interface for API Response (can be used for both home and search if data structure is similar)
interface ApiResponse {
  success: boolean;
  message: string;
  data: ContentItem[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

interface ContentsProps {
  initialSearchQuery?: string;
}

function Contents({ initialSearchQuery }: ContentsProps) {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const observerRef = useRef<HTMLDivElement>(null);
  const limit = 9;

  console.log(totalItems);

  const fetchData = useCallback(
    async (page: number, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setContents([]); // Clear contents on initial fetch or new search
          setCurrentPage(1); // Reset page for new search
        }

        let url = "";
        if (initialSearchQuery) {
          url = `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/search?q=${encodeURIComponent(
            initialSearchQuery
          )}&page=${page}&limit=${limit}`;
        } else {
          url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home?page=${page}&limit=${limit}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data: ApiResponse = await response.json();

        if (isLoadMore) {
          setContents((prev) => [...prev, ...data.data]);
        } else {
          setContents(data.data);
        }

        if (data.meta) {
          setTotalItems(data.meta.total);
          setHasMore(page < data.meta.last_page);
        } else {
          console.warn("Meta object is missing in API response");
          setTotalItems(data.data.length);
          setHasMore(data.data.length === limit);
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
    [limit, initialSearchQuery] // Depend on initialSearchQuery
  );

  useEffect(() => {
    // Reset and fetch data when initialSearchQuery changes
    setContents([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchData(1);
  }, [initialSearchQuery, fetchData]); // Re-fetch when search query changes

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

  const getImageUrl = (path: string | null): string => {
    if (!path) return "/placeholder.svg"; // Fallback image
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.replace(/^\/+/, "")}`;
  };

  const getShareUrl = (
    categoryId: number,
    subcategoryId: number,
    postId: number
  ): string => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/blogs/${categoryId}/${subcategoryId}/${postId}`;
  };

  const handleShare = async (post: ContentItem) => {
    const shareUrl = getShareUrl(
      post.category_id,
      post.subcategory_id,
      post.id
    );
    const shareData = {
      title: post.heading,
      text: post.sub_heading || "Check out this blog post!",
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
      )}&text=${encodeURIComponent(text)}`,
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
      )}&title=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

  if (loading && contents.length === 0) return <SkeletonLoader />;
  if (error) return <div>Error: {error}</div>;
  if (!contents.length && !loading) return <div>No content found</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contents.map((post) => (
          <Link href={`/${post.category_id}/${post.subcategory_id}/${post.id}`} key={post.id} className="relative">
            <div className="overflow-hidden">
              <Image
                src={getImageUrl(post.image2?.[0] || "") || "/placeholder.svg"}
                alt={post.heading}
                width={400}
                height={300}
                className="w-full h-[300px] object-cover object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                priority
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${post.category_name}`}
                  className="bg-primary py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {post.category_name || "Category"}
                </Link>
                <Link
                  href={`/${post.category_id}/${post.subcategory_id}`}
                  className="bg-primary py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {post.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <Link
                href={`/${post.category_id}/${post.subcategory_id}/${post.id}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: post.heading }}
                  className="text-2xl font-medium hover:underline"
                  whileHover={{
                    scale: 1.05,
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
                  <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
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
                  className="cursor-pointer"
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: post.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          </Link>
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
      {/* End of content indicator */}
      {/* {!hasMore && contents.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You&apos;ve reached the end! Showing all {totalItems} items.</p>
        </div>
      )} */}
      {/* Intersection observer target */}
      <div ref={observerRef} className="h-10" />
    </div>
  );
}

export default Contents;

/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import {
  FaRegCommentDots,
} from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import Link from "next/link";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import { motion } from "framer-motion";
import SocialShare from "@/components/ui/SocialShare";

// Define the expected shape of a blog post from the API
interface BlogPost {
  id: number;
  heading: string;
  sub_heading: string;
  author: string;
  date: string;
  body1: string;
  tags: string[];
  category_id: number;
  category_name: string;
  sub_category_id: number;
  sub_category_name: string;
  image1: string | null;
  image2: string[] | null;
  advertising_image: string | null;
  advertisingLink: string | null;
  imageLink: string | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface BlogResponse {
  success: boolean;
  data: {
    current_page: number;
    data: BlogPost[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface TagContainerProps {
  categoryId: string;
  subcategoryId: string;
  tag: string;
}

const TagContainer: React.FC<TagContainerProps> = ({
  categoryId,
  subcategoryId,
  tag,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 10;
  const observerRef = useRef<HTMLDivElement | null>(null);

    // share start
    const [activeSharePostId, setActiveSharePostId] = useState<number | null>(
      null
    );
  
    // Toggle share modal
    const toggleShare = (postId: number) => {
      setActiveSharePostId(activeSharePostId === postId ? null : postId);
    };
  
    // Close on outside click
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
  
        // Close only if click is outside all share containers
        if (!target.closest(".share-container")) {
          setActiveSharePostId(null);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    const getShareUrl = (
      categoryId: number,
      subcategoryId: number,
      id: number
    ): string => {
      if (typeof window === "undefined") return ""; // avoid SSR crash
      return `${window.location.origin}/${categoryId}/${subcategoryId}/${id}`;
    };
  
    // share close

  console.log(totalPages, totalPosts);

    function convertToCDNUrl(image2?: string): string {
    const image2BaseUrl = "https://s3.amazonaws.com/splurjjimages/images";
    const cdnBaseUrl = "https://dsfua14fu9fn0.cloudfront.net/images";

    if (typeof image2 === "string" && image2.startsWith(image2BaseUrl)) {
      return image2.replace(image2BaseUrl, cdnBaseUrl);
    }

    return image2 || "";
  }

  function getImageUrl(image2?: string | null): string {
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

 
  // Fetch tag-specific posts
  const fetchPosts = async (page: number = 1, append: boolean = false) => {
    if (page === 1) setIsLoading(true);
    else setLoadingMore(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/show-tags/${tag}?page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch tag posts: ${response.statusText}`);
      }
      const data: BlogResponse = await response.json();
      if (!data.success) {
        throw new Error("API request unsuccessful");
      }
      setPosts((prevPosts) =>
        append ? [...prevPosts, ...data.data.data] : data.data.data
      );
      setTotalPages(data.data.last_page);
      setTotalPosts(data.data.total);
      setHasMore(page < data.data.last_page);
      setIsLoading(false);
      setLoadingMore(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [tag, currentPage]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading && !loadingMore) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchPosts(nextPage, true);
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
  }, [currentPage, hasMore, isLoading, loadingMore]);

  if (isLoading && currentPage === 1) {
    return (
      <div className="container py-10">
        <TableSkeletonWrapper aria-label="Loading tag posts" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="text-center" role="alert" aria-live="polite">
          Error: {error}
          <button
            onClick={() => {
              setError(null);
              setCurrentPage(1);
              fetchPosts(1);
            }}
            className="ml-4 py-2 px-4 bg-primary text-white rounded-[4px]"
            aria-label="Retry fetching posts"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container py-10">
        <div className="text-center" role="alert" aria-live="polite">
          No posts found for tag: <strong>{tag}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <article
            key={post.id}
            className=""
            aria-labelledby={`post-heading-${post.id}`}
          >
            <div className="space-y-2">
              <div className="overflow-hidden mb-4">
                <Link
                  href={`/${post.category_id}/${post.sub_category_id}/${post.id}`}
                >
                  <Image
                    src={getImageUrl(post.image2?.[0] || "")}
                    alt={post.heading.replace(/<[^>]+>/g, "")}
                    width={458}
                    height={346}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${post.category_name}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                  aria-label={`View category: ${post.category_name}`}
                >
                  {post.category_name || "Category"}
                </Link>
                <Link
                  href={`/${categoryId}/${subcategoryId}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                  aria-label={`View subcategory: ${post.sub_category_name}`}
                >
                  {post.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <Link
                href={`/${post.category_id}/${post.sub_category_id}/${post.id}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: post.heading }}
                  className="text-2xl font-medium line-clamp-2"
                  whileHover={{
                    scale: 1.05,
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <p className="text-base font-semibold leading-[120%] tracking-[0%] uppercase text-[#424242] mt-4 md:mt-5 lg:mt-6">
                {post.author} - {post.date}
              </p>

             

               {/* start  */}
            <div className="flex items-center gap-3 relative share-container">
              <RiShareForwardLine
                className="w-6 h-6 cursor-pointer"
                onClick={() => toggleShare(post.id)}
              />
              {activeSharePostId === post.id && (
                <div
                  className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3 
                    flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
                >
                  <SocialShare
                    url={getShareUrl(
                      post.category_id,
                      post.sub_category_id,
                      post.id
                    )}
                    title={post.heading}
                    summary={post.sub_heading || "Check out this post!"}
                  />
                </div>
              )}
             <TbTargetArrow className="w-6 h-6 text-black" />
                <Link
                  href={`/${post.category_id}/${post.sub_category_id}/${post.id}#comment`}
                  aria-label={`Comment on post: ${post.heading.replace(
                    /<[^>]+>/g,
                    ""
                  )}`}
                >
                  <FaRegCommentDots className="w-6 h-6 text-black" />
                </Link>
            </div>

            {/* end  */}

              <p
                dangerouslySetInnerHTML={{ __html: post.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          </article>
        ))}
      </div>

      {/* Sentinel element for Intersection Observer */}
      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex justify-center items-center"
        >
          {loadingMore && (
            <div className="text-center" aria-live="polite">
              Loading more posts...
            </div>
          )}
        </div>
      )}

      {/* Display total posts */}
      {/* <div className="text-sm text-muted-foreground mt-8 text-center" aria-live="polite">
        Showing {posts.length} of {totalPosts} posts
      </div> */}
    </div>
  );
};

export default TagContainer;

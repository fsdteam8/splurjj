/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import Link from "next/link";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import SocialShareContent from "@/components/ui/SocialShareContent";
import { SlLike } from "react-icons/sl";
import { AiFillLike } from "react-icons/ai";
import { LikeApiResponse } from "@/components/types/like-get-data-type";

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
  likes_count: number;
  shares_count: number;
  comment_count: number;
  cat_slug: string;
  sub_slug: string;
  slug: string;
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
  const limit = 10;
  const observerRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  // like get api logic
  const PostLikeStatus: React.FC<{ postId: number }> = ({ postId }) => {
    const { data: likeData, isLoading: isLikeLoading } =
      useQuery<LikeApiResponse>({
        queryKey: ["like", postId],
        queryFn: () =>
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/${postId}/like-status`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).then((res) => res.json()),
      });

    return (
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => handleLike(postId)}>
          {likeData?.data?.liked ? (
            <AiFillLike className="w-6 h-6 cursor-pointer text-primary" />
          ) : (
            <SlLike className="w-6 h-6 cursor-pointer" />
          )}
        </button>
        <p className="text-lg font-medium text-black dark:text-white leading-normal">
          {isLikeLoading ? "..." : likeData?.data?.likes_count || 0}
        </p>
      </div>
    );
  };

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
    onSuccess: (postId) => {
      // toast.success(data?.message || "Liked successfully");

      // Invalidate the post query so the like count updates
      queryClient.invalidateQueries({ queryKey: ["like", postId] });
    },

    onError: (error: Error) => {
      if (!token) {
        toast.error("You need to login first");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    },
  });

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

  // Fetch tag-specific posts using useInfiniteQuery
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["tag-posts", tag],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/show-tags/${tag}?page=${pageParam}&limit=${limit}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch tag posts: ${response.statusText}`);
      }
      const data: BlogResponse = await response.json();
      if (!data.success) {
        throw new Error("API request unsuccessful");
      }
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.current_page < lastPage.data.last_page
        ? lastPage.data.current_page + 1
        : undefined,
    initialPageParam: 1,
  });

  // Flatten posts from all pages
  const posts = data?.pages.flatMap((page) => page.data.data) ?? [];
  // const totalPosts = data?.pages[0]?.data.total ?? 0;

  // Set up Intersection Observer for infinite scroll
  React.useEffect(() => {
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

  if (isLoading) {
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
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load posts"}
          <button
            onClick={() => fetchNextPage()}
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
    <div className="container py-10 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <article
            key={post.id}
            className=""
            aria-labelledby={`post-heading-${post.id}`}
          >
            <div className="space-y-2">
              <div className="overflow-hidden mb-4">
                <Link href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}`}>
                  <Image
                    src={getImageUrl(post.image2?.[0] || "")}
                    alt={post.slug || "blog image"}
                    width={458}
                    height={346}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${post.cat_slug}`}
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
              <Link href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}`}>
                <motion.p
                  dangerouslySetInnerHTML={{ __html: post.heading }}
                  className="text-2xl font-medium line-clamp-2 mt-2"
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

              {/* social icon start */}
              <div className="flex items-center gap-5 relative mt-4">
                <PostLikeStatus postId={post.id} />
                <div className="flex items-center gap-2 mt-1">
                  <Link
                    href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}#comment`}
                  >
                    <button type="button" className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 cursor-pointer mt-1" />
                    </button>
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {post?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  id={post.id}
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

              {/* social icon end  */}

              <p
                dangerouslySetInnerHTML={{ __html: post.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          </article>
        ))}
      </div>

      {/* Sentinel element for Intersection Observer */}
      {hasNextPage && (
        <div
          ref={observerRef}
          className="h-10 flex justify-center items-center"
        >
          {isFetchingNextPage && (
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


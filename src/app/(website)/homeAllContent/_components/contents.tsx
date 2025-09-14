"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { SlLike } from "react-icons/sl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SocialShareContent from "@/components/ui/SocialShareContent";
import { AiFillLike } from "react-icons/ai";
import { LikeApiResponse } from "@/components/types/like-get-data-type";

// Interface for ContentItem
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
  likes_count: number;
  shares_count: number;
  comment_count: number;
  cat_slug: string;
  sub_slug: string;
  slug: string;
}

// Interface for API Response
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
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();
  const limit = 9;
  const observerRef = useRef<HTMLDivElement>(null);

  // Fetch function for TanStack Query
  const fetchContents = async ({ pageParam = 1 }) => {
    const url = initialSearchQuery
      ? `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/search?q=${encodeURIComponent(
          initialSearchQuery
        )}&page=${pageParam}&limit=${limit}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home?page=${pageParam}&limit=${limit}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json() as Promise<ApiResponse>;
  };

  // TanStack Query hook
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["contents", initialSearchQuery],
    queryFn: fetchContents,
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

  // Flatten pages to get all contents
  const contents = data?.pages.flatMap((page) => page.data) || [];
  // const totalItems = data?.pages[0]?.meta?.total || contents.length;

  // Intersection Observer for infinite scrolling
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

  function getImageUrl(image2?: string | string[] | null): string {
    if (!image2) return "";

    if (Array.isArray(image2)) {
      return convertToCDNUrl(image2[0]);
    }

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  if (isLoading) return <SkeletonLoader />;
  if (!contents.length)
    return <div className="text-center py-8">No content found</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contents?.map((post) => (
          <div key={post.id}>
            <div className="overflow-hidden">
              <Link
                href={`/${post?.cat_slug}/${post?.sub_slug}/${post.slug}`}

                // className="relative"
              >
                <Image
                  src={getImageUrl(post.image2) || "/placeholder.svg"}
                  alt={post.slug}
                  width={400}
                  height={300}
                  className="w-full h-[300px] object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${post.cat_slug}`}
                  className="bg-primary py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {post.category_name || "Category"}
                </Link>
                <Link
                  href={`/${post.cat_slug}/${post.sub_slug}`}
                  className="bg-primary py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {post.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <Link
                href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: post.heading }}
                  className="text-2xl font-medium hover:underline pt-2"
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
              {/* social icon start */}
              <div className="flex items-center gap-3 mt-4 md:mt-2 relative">
                 <PostLikeStatus postId={post.id} />
                <div className="flex items-center gap-2">
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

export default Contents;

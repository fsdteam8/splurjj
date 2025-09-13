"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegCommentDots } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import SkeletonLoader from "./SkeletonLoader";
import { motion } from "framer-motion";
import { SlLike } from "react-icons/sl";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SocialShareContent from "@/components/ui/SocialShareContent";
import { AiFillLike } from "react-icons/ai";
import { LikeApiResponse } from "@/components/types/like-get-data-type";

interface Post {
  id: number;
  heading: string;
  sub_heading: string;
  author: string;
  date: string;
  body1: string;
  category_id: number;
  subcategory_id: number;
  category_name: string;
  sub_category_name: string;
  image1: string | null;
  image2: string[] | null;
  imageLink: string | null;
  advertising_image: string | null;
  advertisingLink: string | null;
  status: string;
  tags: string[];
  cat_slug: string;
  sub_slug: string;
  slug: string;
  likes_count: number;
  shares_count: number;
  comment_count: number;
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

const SecondContents = ({
  categoryId,
  subcategoryId,
}: {
  categoryId: string;
  subcategoryId: string;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
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

  const fetchData = useCallback(
    async (page: number, isLoadMore = false) => {
      if (isLoadMore) setLoadingMore(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${categoryId}/${subcategoryId}?page=${page}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }

        const result: ContentAllDataTypeResponse = await response.json();
        if (!result.success) {
          throw new Error("API returned unsuccessful response");
        }

        const newPosts = result.data || [];

        console.log(newPosts);
        const filteredPosts = newPosts.map((post) => ({
          ...post,
          tags: post.tags.filter((tag) => tag.trim() !== ""),
        }));

        setPosts((prev) =>
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
          setLoading(false);
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
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchData(nextPage, true);
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) observer.observe(currentObserverRef);
    return () => {
      if (currentObserverRef) observer.unobserve(currentObserverRef);
    };
  }, [currentPage, hasMore, loadingMore, fetchData]);

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

  if (loading && !loadingMore) {
    return (
      <div className="container mx-auto px-4">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <p className="text-center text-red-500 py-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="">
      {posts.length <= 5 ? (
        <p className="text-center text-muted-foreground py-8">
          No content available.
        </p>
      ) : (
        <>
          {/* Show all posts while loading */}
          {(hasMore || loadingMore) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {posts.slice(5).map((post) => (
                <article
                  key={post.id}
                  className="space-y-2 overflow-hidden"
                  aria-labelledby={`card-heading-${post.id}`}
                >
                  <div className="overflow-hidden">
                    <Link
                      href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}#comment`}
                    >
                      <Image
                        src={getImageUrl(post.image2?.[0] || "")}
                        alt={post.heading.replace(/<[^>]+>/g, "")}
                        width={400}
                        height={300}
                        className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                        priority
                      />
                    </Link>
                  </div>
                  <div className="p-4">
                    <div className="md:flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blogs/${post.cat_slug}`}
                          className="bg-primary py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                        >
                          {post.category_name || "Category"}
                        </Link>
                        <Link
                          href={`/blogs/${post.cat_slug}/${post.sub_slug}`}
                          className="bg-primary py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                        >
                          {post.sub_category_name || "Subcategory"}
                        </Link>
                      </div>

                      {/* social icon start */}
                      <div className="flex items-center gap-5 relative mt-4 md:mt-0">
                        <PostLikeStatus postId={post.id} />
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${post?.cat_slug}/${post?.sub_slug}/${post?.slug}#comment`}
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

                      {/* social icon end  */}
                    </div>
                    <div>
                      <Link
                        href={`/blogs/${post.cat_slug}/${post.sub_slug}/${post.slug}`}
                      >
                        <motion.p
                          dangerouslySetInnerHTML={{ __html: post.heading }}
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
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* After loading, show posts from index 4 */}
          {!hasMore && !loadingMore && posts.length > 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* <h2 className="col-span-full text-2xl font-bold">More Content</h2> */}
              {posts.slice(4).map((post) => (
                <article
                  key={post.id}
                  className="space-y-2 overflow-hidden"
                  aria-labelledby={`card-heading-${post.id}`}
                >
                  <div className="overflow-hidden">
                    <Link
                      href={`/${post.cat_slug}/${post.sub_slug}/${post.slug}#comment`}
                    >
                      <Image
                        src={getImageUrl(post.image2?.[0] || "")}
                        alt={post.heading.replace(/<[^>]+>/g, "")}
                        width={400}
                        height={300}
                        className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out "
                        priority
                      />
                    </Link>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blogs/${post.cat_slug}`}
                          className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                        >
                          {post.category_name || "Category"}
                        </Link>
                        <Link
                          href={`/blogs/${post.cat_slug}/${post.sub_slug}`}
                          className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                        >
                          {post.sub_category_name || "Subcategory"}
                        </Link>
                      </div>
                      {/* social icon start */}
                      <div className="flex items-center gap-5 relative mt-4 md:mt-0">
                        <PostLikeStatus postId={post.id} />
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${post?.cat_slug}/${post?.sub_slug}/${post?.slug}#comment`}
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

                      {/* social icon end  */}
                    </div>
                    <div>
                      <Link
                        href={`/blogs/${post.cat_slug}/${post.sub_slug}/${post.slug}`}
                      >
                        <motion.p
                          dangerouslySetInnerHTML={{ __html: post.heading }}
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
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Infinite scroll observer */}
          {hasMore && <div ref={observerRef} />}

          {loadingMore && (
            <div className="col-span-full flex justify-center py-8">
              <p>Loading more content...</p>
            </div>
          )}

          {/* {!hasMore && !loadingMore && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-700">
                You&apos;ve reached the end of the content.
              </p>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default SecondContents;

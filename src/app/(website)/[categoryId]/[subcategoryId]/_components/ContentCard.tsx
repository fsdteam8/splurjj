"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiShareForwardLine } from "react-icons/ri";
import {
  FaFacebook,
  FaLinkedin,
  FaRegCommentDots,
  FaTwitter,
} from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import SkeletonLoader from "./SkeletonLoader";
import { motion } from "framer-motion";

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
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async (page: number, isLoadMore = false) => {
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
  }, []);

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

  const getShareUrl = (post: Post): string => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const normalizedCategory = post.category_name
      .toLowerCase()
      .replace(/\s+/g, "-");
    const normalizedSubCategory = post.sub_category_name
      .toLowerCase()
      .replace(/\s+/g, "-");
    return `${baseUrl}/blogs/${normalizedCategory}/${normalizedSubCategory}/${post.id}`;
  };

  const handleShare = async (post: Post) => {
    const shareUrl = getShareUrl(post);
    const shareData = {
      title: post.heading.replace(/<[^>]+>/g, ""),
      text:
        post.sub_heading?.replace(/<[^>]+>/g, "") ||
        "Check out this blog post!",
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

  const shareToSocial = (platform: string, post: Post) => {
    const shareUrl = getShareUrl(post);
    const title = post.heading.replace(/<[^>]+>/g, "");

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            shareUrl
          )}&title=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
    }
  };

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
                      href={`/${post.category_id}/${post.subcategory_id}/${post.id}#comment`}
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
                          href={`/blogs/${post.category_name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="bg-primary py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                        >
                          {post.category_name || "Category"}
                        </Link>
                        <Link
                          href={`/blogs/${post.category_name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}/${post.sub_category_name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="bg-primary py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                        >
                          {post.sub_category_name || "Subcategory"}
                        </Link>
                      </div>
                      <div className="flex items-center gap-3 relative mt-4 md:mt-0 lg:mt-0">
                        <RiShareForwardLine
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => handleShare(post)}
                        />
                        {showShareMenu === post.id && (
                          <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                            <FaTwitter
                              className="w-6 h-6 cursor-pointer text-blue-500"
                              onClick={() => shareToSocial("twitter", post)}
                            />
                            <FaFacebook
                              className="w-6 h-6 cursor-pointer text-blue-700"
                              onClick={() => shareToSocial("facebook", post)}
                            />
                            <FaLinkedin
                              className="w-6 h-6 cursor-pointer text-blue-600"
                              onClick={() => shareToSocial("linkedin", post)}
                            />
                          </div>
                        )}
                        <TbTargetArrow className="w-6 h-6" />
                        <Link
                          href={`/${post.category_id}/${post.subcategory_id}/${post.id}#comment`}
                          className="w-6 h-6"
                        >
                          <FaRegCommentDots className="w-6 h-6" />
                        </Link>
                      </div>
                    </div>
                    <div>
                      <Link
                        href={`/blogs/${post.category_name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${post.sub_category_name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${post.id}`}
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
              <h2 className="col-span-full text-2xl font-bold">More Content</h2>
              {posts.slice(4).map((post) => (
                <article
                  key={post.id}
                  className="space-y-2 overflow-hidden"
                  aria-labelledby={`card-heading-${post.id}`}
                >
                  <div className="overflow-hidden">
                    <Link
                      href={`/${post.category_id}/${post.subcategory_id}/${post.id}#comment`}
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
                          href={`/blogs/${post.category_name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                        >
                          {post.category_name || "Category"}
                        </Link>
                        <Link
                          href={`/blogs/${post.category_name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}/${post.sub_category_name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                        >
                          {post.sub_category_name || "Subcategory"}
                        </Link>
                      </div>
                      <div className="flex items-center gap-3 relative">
                        <RiShareForwardLine
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => handleShare(post)}
                        />
                        {showShareMenu === post.id && (
                          <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                            <FaTwitter
                              className="w-6 h-6 cursor-pointer text-blue-500"
                              onClick={() => shareToSocial("twitter", post)}
                            />
                            <FaFacebook
                              className="w-6 h-6 cursor-pointer text-blue-700"
                              onClick={() => shareToSocial("facebook", post)}
                            />
                            <FaLinkedin
                              className="w-6 h-6 cursor-pointer text-blue-600"
                              onClick={() => shareToSocial("linkedin", post)}
                            />
                          </div>
                        )}
                        <TbTargetArrow className="w-6 h-6" />
                        <Link
                          href={`/${post.category_id}/${post.subcategory_id}/${post.id}#comment`}
                          className="w-6 h-6"
                        >
                          <FaRegCommentDots className="w-6 h-6" />
                        </Link>
                      </div>
                    </div>
                    <div>
                      <Link
                        href={`/blogs/${post.category_name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${post.sub_category_name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${post.id}`}
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

          {!hasMore && !loadingMore && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-700">
                You&apos;ve reached the end of the content.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SecondContents;

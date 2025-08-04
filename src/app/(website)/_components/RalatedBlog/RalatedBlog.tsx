import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaRegCommentDots,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import SplurjjPagination from "@/components/ui/SplurjjPagination";
import Vertical from "@/components/adds/vertical";
import { motion } from "framer-motion";

// Define the BlogPost type
interface BlogPost {
  id: number;
  category_id: number;
  subcategory_id: number;
  category_name: string;
  sub_category_name?: string;
  heading: string;
  sub_heading?: string;
  image1?: string | null;
  image2?: string[] | null; // Assuming image2 is an array of strings
  imageLink?: string | null;
  date?: string;
  author?: string;
}

type RelatedBlogsDataTypeProps = {
  subcategoryId: string;
  categoryId: string;
};

const RelatedContent = ({
  subcategoryId,
  categoryId,
}: RelatedBlogsDataTypeProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const postsPerPage = 8;

  // Fetch related blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${categoryId}/${subcategoryId}?page=${currentPage}&per_page=${postsPerPage}`
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        console.log("API Response:", data);

        // Correctly access the data and meta fields
        setPosts(data.data || []);
        setTotalPages(data.meta?.last_page || 1);
        setTotalPosts(data.meta?.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [categoryId, subcategoryId, currentPage]);

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
    return `${baseUrl}/blogs/${categoryId}/${subcategoryId}/${postId}`;
  };

  const handleShare = (post: BlogPost) => {
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
      navigator
        .share(shareData)
        .catch((err) => console.error("Error sharing:", err));
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

  if (loading)
    return <div className="loading text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="error text-center py-8 text-red-500">Error: {error}</div>
    );
  if (posts.length === 0)
    return <div className="error text-center py-8">No posts found</div>;

  console.log("Posts:", posts);

  return (
    <div className="container py-[30px] md:py-[50px] lg:py-[72px]">
      <h2 className="text-2xl md:text-[28px] lg:text-[32px] font-semibold tracking-[0%] text-[#131313] uppercase leading-[120%] pb-2">
        RELATED
      </h2>
      <div className="w-1/2 h-[2px] bg-secondary" />
      <p className="text-lg md:text-xl font-semibold leading-[120%] tracking-[0%] text-[#929292] pb-[25px] md:pb-[32px] lg:pb-[40px] pt-3 md:pt-4">
        More like this one
      </p>

      <div className="grid grid-cols-8 gap-4 pt-16">
        <div className="col-span-8 md:col-span-3 lg:col-span-2">
          <div className="sticky top-[120px] mb-2">
            <Vertical />
          </div>
        </div>
        <div className="col-span-8 md:col-span-5 lg:col-span-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] md:gap-[30px] lg:gap-[36px] capitalize">
            {posts.map((post) => (
              <div key={post.id}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blogs/${post.category_name}`}
                      className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white"
                    >
                      {post.category_name || "Category"}
                    </Link>
                    <Link
                      href={`/${post.category_id}/${post.subcategory_id}`}
                      className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white"
                    >
                      {post.sub_category_name || "Subcategory"}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <span
                      onClick={() => handleShare(post)}
                      className="cursor-pointer"
                    >
                      <RiShareForwardLine className="w-6 h-6" />
                    </span>
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
                </div>
                <div className="overflow-hidden mb-2">
                  <Link
                    href={`/${post.category_id}/${post.subcategory_id}/${post.id}`}
                  >
                    <Image
                      src={getImageUrl(post.image2?.[0] || "")}
                      alt={post.heading || "Blog Image"}
                      width={888}
                      height={552}
                      className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                      priority
                    />
                  </Link>
                </div>
                <Link
                  href={`/${post.category_id}/${post.subcategory_id}/${post.id}`}
                >
                  <motion.p
                    dangerouslySetInnerHTML={{ __html: post.heading }}
                    className="text-2xl font-medium text-[#131313]"
                    whileHover={{
                      scaleX: 1.05,
                      transformOrigin: "left", // Ensures scaling happens from the left side
                      fontWeight: 900,
                      transition: { duration: 0.3 },
                    }}
                  />
                </Link>
                <p className="text-base font-semibold leading-[120%] tracking-[0%] uppercase text-[#424242] mt-4 md:mt-5 lg:mt-6">
                  {post.author} - {post.date}
                </p>
                <p
                  dangerouslySetInnerHTML={{ __html: post.sub_heading ?? "" }}
                  className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
                />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <div className="text-sm text-muted-foreground" aria-live="polite">
                Showing {posts.length} of {totalPosts} posts
              </div>
              <SplurjjPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
                aria-label="Tag posts pagination"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedContent;

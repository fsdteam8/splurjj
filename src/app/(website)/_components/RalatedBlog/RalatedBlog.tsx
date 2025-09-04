import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegCommentDots } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import SplurjjPagination from "@/components/ui/SplurjjPagination";
import Vertical from "@/components/adds/vertical";
import { motion } from "framer-motion";
import SocialShare from "@/components/ui/SocialShare";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const postsPerPage = 8;

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

    // Only close if the click is NOT inside a share modal or share button
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
            {posts.map((post) => {
              const isActive = activeSharePostId === post.id;
              return (
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
                    {/* start */}
                    <div className="flex items-center gap-3 relative share-container">
                      <RiShareForwardLine
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => toggleShare(post.id)}
                      />

                      {isActive && (
                        <div
                          className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-4 
                        flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
                        >
                          <SocialShare
                            url={getShareUrl(
                              post.category_id,
                              post.subcategory_id,
                              post.id
                            )}
                            title={post.heading}
                            summary={post.sub_heading || "Check out this post!"}
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
                    {/* end */}
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
              );
            })}
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

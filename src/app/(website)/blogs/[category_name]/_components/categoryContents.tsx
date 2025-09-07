"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { motion } from "framer-motion";
import { BlogPost } from "./blog-post-types"; // Import from blog-post-types.ts
import SocialShare from "@/components/ui/SocialShare";
import { SlLike } from "react-icons/sl";

interface CategoryContentsProps {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

function CategoryContents({ posts, loading, error }: CategoryContentsProps) {
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

  function convertToCDNUrl(image2?: string): string {
    const image2BaseUrl = "https://s3.amazonaws.com/splurjjimages/images";
    const cdnBaseUrl = "https://dsfua14fu9fn0.cloudfront.net/images";

    if (typeof image2 === "string" && image2.startsWith(image2BaseUrl)) {
      return image2.replace(image2BaseUrl, cdnBaseUrl);
    }

    return image2 || "";
  }

  function getImageUrl(image2?: string | string[] | null): string {
    if (!image2) return ""; // Handle null or undefined

    if (Array.isArray(image2)) {
      return convertToCDNUrl(image2[0]); // Handle string array
    }

    try {
      const parsed = JSON.parse(image2);
      if (parsed?.image2) {
        return convertToCDNUrl(parsed.image2);
      }
    } catch {
      return convertToCDNUrl(image2); // Handle string
    }

    return "";
  }

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, index) => (
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
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (loading) return <SkeletonLoader />;
  if (!posts.length)
    return <div className="text-center py-8">No content found</div>;

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="relative">
            <div className="overflow-hidden">
              <Link
                href={`/${post.category_id}/${post.subcategory_id}/${post.id}#comment`}
              >
                <Image
                  src={getImageUrl(post.image2)}
                  alt={post.heading}
                  width={400}
                  height={300}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  priority
                />
              </Link>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${post.category_name}`}
                  className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {post.category_name || "Category"}
                </Link>
                <Link
                  href={`/${post.category_id}/${post.subcategory_id}`}
                  className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {post.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <Link
                href={`/${post.category_id}/${post.subcategory_id}/${post.id}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: post.heading ?? "" }}
                  className="text-2xl font-medium pt-2"
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

              {/* start  */}
              <div className="flex items-center gap-3 relative mt-2 share-container">
                <SlLike className="w-6 h-6 cursor-pointer" />
                <Link
                  href={`/${post.category_id}/${post.subcategory_id}/${post.id}#comment`}
                  className="cursor-pointer"
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
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
                        post.subcategory_id,
                        post.id
                      )}
                      title={post.heading}
                      summary={post.sub_heading || "Check out this post!"}
                    />
                  </div>
                )}
                <TbTargetArrow className="w-6 h-6 cursor-pointer" />
              </div>

              {/* end  */}
              <p
                dangerouslySetInnerHTML={{ __html: post.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryContents;

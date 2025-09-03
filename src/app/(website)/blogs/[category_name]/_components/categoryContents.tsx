"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaRegCommentDots,
  FaTwitter,
} from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { motion } from "framer-motion";
import { BlogPost } from "./blog-post-types"; // Import from blog-post-types.ts

interface CategoryContentsProps {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

function CategoryContents({
  posts,
  loading,
  error,
}: CategoryContentsProps) {
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);

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

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
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
                  className="text-2xl font-medium"
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
              <div className="flex items-center gap-3 mt-2 relative">
                <RiShareForwardLine
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleShare(post)}
                />
                {showShareMenu === post.id && (
                  <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded-md flex gap-2 z-10">
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
"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaRegCommentDots,
  FaTwitter,
} from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { motion } from "framer-motion";

// Interface for BlogPost
interface BlogPost {
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
  image2?: string[] | null;
  advertising_image: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  imageLink: string | null;
  advertisingLink: string | null;
  user_id: number;
  status: string;
}

// Interface for API Response
interface ApiResponse {
  success: boolean;
  message: string;
  data: BlogPost[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

interface ArtCultureProps {
  categoryName: { categoryName: string };
}

const Video: React.FC<ArtCultureProps> = ({ categoryName }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (categoryName.categoryName) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/${categoryName.categoryName}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }
          const data: ApiResponse = await response.json();
          setPosts(data.data || []); // Set posts from data.data, default to empty array
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [categoryName.categoryName]);

  const getImageUrl = (path: string | null): string => {
    if (!path) return "/assets/images/fallback.jpg"; // Fallback image
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

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="animate-pulse ">
      {/* Skeleton for First Post */}
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded">
          <div className="bg-gray-300 h-[455px] rounded-l-md"></div>
          <div className="bg-gray-300 h-[455px] rounded-r-md"></div>
        </div>
        <div className="pt-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-300 h-8 w-24 rounded"></div>
            <div className="bg-gray-300 h-8 w-24 rounded"></div>
            <div className="flex items-center gap-3 ml-auto">
              <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
              <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
              <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
            </div>
          </div>
          <div className="bg-gray-300 h-4 w-1/2 rounded mt-4"></div>
          <div className="bg-gray-300 h-4 w-full rounded mt-2"></div>
          <div className="bg-gray-300 h-4 w-5/6 rounded mt-2"></div>
          <div className="bg-gray-300 h-4 w-2/3 rounded mt-2"></div>
        </div>
      </div>

      {/* Skeleton for Three-Post Grid */}
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="max-h-[600px]">
              <div className="flex items-center gap-2 pb-2">
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
              </div>
              <div className="bg-gray-300 w-full h-[455px] rounded-t-md"></div>
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
          ))}
        </div>
        <div className="flex justify-end py-4 mt-[70px] lg:mt-0">
          <div className="bg-gray-300 h-8 w-32 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="error text-center py-8 text-red-600">Error: {error}</div>
    );
  if (posts.length === 0)
    return <div className="error text-center py-8">No posts found</div>;

  const firstPost = posts[0];
  const thirdPost = posts[1];
  const fourthPost = posts[2];
  const fifthPost = posts[3];

  return (
    <div className="">
      {firstPost && (
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[#DDD618] aspect-[1.5/1] w-full flex items-center justify-center">
              <Link
                href={`/${firstPost.category_id}/${firstPost.subcategory_id}/${firstPost.id}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: firstPost.heading }}
                  className="text-xl md:text-xl lg:text-4xl font-bold text-[#131313] px-4 "
                   whileHover={{
                    scaleX: 1.05,
                    transformOrigin: "left", // Ensures scaling happens from the left side
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
            </div>
            <div className="overflow-hidden">
              <Link
                href={`/${firstPost.category_id}/${firstPost.subcategory_id}/${firstPost.id}`}
              >
                <Image
                  src={getImageUrl(firstPost.image2?.[0] || "")}
                  alt={firstPost.heading || "Blog Image"}
                  width={600}
                  height={455}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  priority
                />
              </Link>
            </div>
          </div>
          <div className="pt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${firstPost.category_name}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white"
                >
                  {firstPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${firstPost.category_id}/${firstPost.subcategory_id}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white"
                >
                  {firstPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="flex items-center gap-3 relative mt-2">
                <span
                  onClick={() => handleShare(firstPost)}
                  className="cursor-pointer"
                >
                  <RiShareForwardLine className="w-6 h-6" />
                </span>
                {showShareMenu === firstPost.id && (
                  <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                    <FaTwitter
                      className="w-6 h-6 cursor-pointer text-blue-500"
                      onClick={() =>
                        shareToTwitter(
                          getShareUrl(
                            firstPost.category_id,
                            firstPost.subcategory_id,
                            firstPost.id
                          ),
                          firstPost.heading
                        )
                      }
                    />
                    <FaFacebook
                      className="w-6 h-6 cursor-pointer text-blue-700"
                      onClick={() =>
                        shareToFacebook(
                          getShareUrl(
                            firstPost.category_id,
                            firstPost.subcategory_id,
                            firstPost.id
                          )
                        )
                      }
                    />
                    <FaLinkedin
                      className="w-6 h-6 cursor-pointer text-blue-600"
                      onClick={() =>
                        shareToLinkedIn(
                          getShareUrl(
                            firstPost.category_id,
                            firstPost.subcategory_id,
                            firstPost.id
                          ),
                          firstPost.heading
                        )
                      }
                    />
                  </div>
                )}
                <TbTargetArrow className="w-6 h-6" />
                <Link
                  href={`/${firstPost.category_id}/${firstPost.subcategory_id}/${firstPost.id}#comment`}
                  className="cursor-pointer"
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
              </div>
            </div>
            <p className="text-sm font-semibold uppercase text-[#424242] pt-4">
              {firstPost.author} - {firstPost.date}
            </p>
            <p
              dangerouslySetInnerHTML={{ __html: firstPost.sub_heading }}
              className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
            />
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thirdPost && (
            <div className="">
              <div className="flex items-center gap-2 pb-2">
                <Link
                  href={`/blogs/${thirdPost.category_name}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {thirdPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {thirdPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="overflow-hidden">
                <Link
                  href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
                >
                  <Image
                    src={getImageUrl(thirdPost.image2?.[0] || "")}
                    alt={thirdPost.heading || "Blog Image"}
                    width={400}
                    height={455}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    priority
                  />
                </Link>
              </div>

              <Link
                href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: thirdPost.heading }}
                  className="text-2xl font-medium text-[#131313]  mt-2"
                   whileHover={{
                    scaleX: 1.05,
                    transformOrigin: "left", // Ensures scaling happens from the left side
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {thirdPost.author} - {thirdPost.date}
              </p>
              <div className="flex items-center gap-3 relative mt-2">
                <span
                  onClick={() => handleShare(thirdPost)}
                  className="cursor-pointer"
                >
                  <RiShareForwardLine className="w-6 h-6" />
                </span>
                {showShareMenu === thirdPost.id && (
                  <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                    <FaTwitter
                      className="w-6 h-6 cursor-pointer text-blue-500"
                      onClick={() =>
                        shareToTwitter(
                          getShareUrl(
                            thirdPost.category_id,
                            thirdPost.subcategory_id,
                            thirdPost.id
                          ),
                          thirdPost.heading
                        )
                      }
                    />
                    <FaFacebook
                      className="w-6 h-6 cursor-pointer text-blue-700"
                      onClick={() =>
                        shareToFacebook(
                          getShareUrl(
                            thirdPost.category_id,
                            thirdPost.subcategory_id,
                            thirdPost.id
                          )
                        )
                      }
                    />
                    <FaLinkedin
                      className="w-6 h-6 cursor-pointer text-blue-600"
                      onClick={() =>
                        shareToLinkedIn(
                          getShareUrl(
                            thirdPost.category_id,
                            thirdPost.subcategory_id,
                            thirdPost.id
                          ),
                          thirdPost.heading
                        )
                      }
                    />
                  </div>
                )}
                <TbTargetArrow className="w-6 h-6" />
                <Link
                  href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}#comment`}
                  className="cursor-pointer"
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: thirdPost.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          )}

          {fourthPost && (
            <div className="">
              <div className="flex items-center gap-2 pb-2">
                <Link
                  href={`/blogs/${fourthPost.category_name}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {fourthPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {fourthPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="overflow-hidden">
                <Link
                  href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}`}
                >
                  <Image
                    src={getImageUrl(fourthPost.image2?.[0] || "")}
                    alt={fourthPost.heading || "Blog Image"}
                    width={400}
                    height={455}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    priority
                  />
                </Link>
              </div>

              <Link
                href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: fourthPost.heading }}
                  className="text-2xl font-medium text-[#131313]  mt-2"
                  whileHover={{
                    scale: 1.02,
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {fourthPost.author} - {fourthPost.date}
              </p>
              <div className="flex items-center gap-3 relative mt-2">
                <span
                  onClick={() => handleShare(fourthPost)}
                  className="cursor-pointer"
                >
                  <RiShareForwardLine className="w-6 h-6" />
                </span>
                {showShareMenu === fourthPost.id && (
                  <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                    <FaTwitter
                      className="w-6 h-6 cursor-pointer text-blue-500"
                      onClick={() =>
                        shareToTwitter(
                          getShareUrl(
                            fourthPost.category_id,
                            fourthPost.subcategory_id,
                            fourthPost.id
                          ),
                          fourthPost.heading
                        )
                      }
                    />
                    <FaFacebook
                      className="w-6 h-6 cursor-pointer text-blue-700"
                      onClick={() =>
                        shareToFacebook(
                          getShareUrl(
                            fourthPost.category_id,
                            fourthPost.subcategory_id,
                            fourthPost.id
                          )
                        )
                      }
                    />
                    <FaLinkedin
                      className="w-6 h-6 cursor-pointer text-blue-600"
                      onClick={() =>
                        shareToLinkedIn(
                          getShareUrl(
                            fourthPost.category_id,
                            fourthPost.subcategory_id,
                            fourthPost.id
                          ),
                          fourthPost.heading
                        )
                      }
                    />
                  </div>
                )}
                <TbTargetArrow className="w-6 h-6" />
                <Link
                  href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}#comment`}
                  className="cursor-pointer"
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: fourthPost.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          )}

          {fifthPost && (
            <div className="">
              <div className="flex items-center gap-2 pb-2">
                <Link
                  href={`/blogs/${fifthPost.category_name}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {fifthPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {fifthPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="overflow-hidden">
                <Link
                  href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}`}
                >
                  <Image
                    src={getImageUrl(fifthPost.image2?.[0] || "")}
                    alt={fifthPost.heading || "Blog Image"}
                    width={400}
                    height={455}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    priority
                  />
                </Link>
              </div>

              <Link
                href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}`}
              ><motion.p
                  dangerouslySetInnerHTML={{ __html: fifthPost.heading }}
                  className="text-2xl font-medium text-[#131313]  mt-2"
                />
              </Link>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {fifthPost.author} - {fifthPost.date}
              </p>
              <div className="flex items-center gap-3 relative mt-2">
                <span
                  onClick={() => handleShare(fifthPost)}
                  className="cursor-pointer"
                >
                  <RiShareForwardLine className="w-6 h-6" />
                </span>
                {showShareMenu === fifthPost.id && (
                  <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                    <FaTwitter
                      className="w-6 h-6 cursor-pointer text-blue-500"
                      onClick={() =>
                        shareToTwitter(
                          getShareUrl(
                            fifthPost.category_id,
                            fifthPost.subcategory_id,
                            fifthPost.id
                          ),
                          fifthPost.heading
                        )
                      }
                    />
                    <FaFacebook
                      className="w-6 h-6 cursor-pointer text-blue-700"
                      onClick={() =>
                        shareToFacebook(
                          getShareUrl(
                            fifthPost.category_id,
                            fifthPost.subcategory_id,
                            fifthPost.id
                          )
                        )
                      }
                    />
                    <FaLinkedin
                      className="w-6 h-6 cursor-pointer text-blue-600"
                      onClick={() =>
                        shareToLinkedIn(
                          getShareUrl(
                            fifthPost.category_id,
                            fifthPost.subcategory_id,
                            fifthPost.id
                          ),
                          fifthPost.heading
                        )
                      }
                    />
                  </div>
                )}
                <TbTargetArrow className="w-6 h-6" />
                <Link
                  href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}#comment`}
                  className="cursor-pointer"
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: fifthPost.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end py-4 mt-[70px] md:mt-[100px] ">
          <Link
            href={`/blogs/${firstPost?.category_name}`}
            className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white flex items-center gap-2"
          >
            EXPLORE MORE <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Video;

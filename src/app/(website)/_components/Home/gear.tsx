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
import GearCarousel from "./GearCarousel";
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
  image2?: string | string[] | null;
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

const Gear: React.FC<ArtCultureProps> = ({ categoryName }) => {
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
    <div className="animate-pulse">
      {/* Skeleton for First Post */}
      <div className="py-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-300 h-8 w-24 rounded"></div>
            <div className="bg-gray-300 h-8 w-24 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
            <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
            <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
          </div>
        </div>
        <div className="bg-gray-300 w-full h-[433px] rounded-lg"></div>
      </div>

      {/* Skeleton for Two-Post Grid */}
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4">
              <div className="col-span-5 lg:col-span-2">
                <div className="bg-gray-300 w-full h-[213px] rounded-md"></div>
              </div>
              <div className="col-span-5 lg:col-span-3 space-y-4">
                <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-300 h-6 w-20 rounded"></div>
                    <div className="bg-gray-300 h-6 w-20 rounded"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                    <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                    <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-gray-300 h-4 w-full rounded"></div>
                <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
                <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end py-4">
          <div className="bg-gray-300 h-8 w-32 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="error text-center py-8 text-red-500">Error: {error}</div>
    );
  if (posts.length === 0)
    return <div className="error text-center py-8">No posts found</div>;

  const firstPost = posts[0];
  const secondPost = posts[1];
  const thirdPost = posts[2];

  // const sanitizedHeading = secondPost?.heading?.replace(/style="[^"]*"/g, "");

  return (
    <div className="">
      {firstPost && (
        <div className="py-1">
          <div className="md:flex items-center gap-2 mb-4">
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
            <div className="flex items-center gap-3 relative mt-4 md:mt-0 lg:mt-0">
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
          <div className="mt-8">
            <GearCarousel
              posts={[
                {
                  ...firstPost,
                  image2:
                    typeof firstPost.image2 === "string"
                      ? [firstPost.image2]
                      : firstPost.image2,
                },
              ]}
              getImageUrl={getImageUrl}
            />
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondPost && (
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-5 lg:col-span-2 overflow-hidden">
                <Link
                  href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}`}
                >
                  <Image
                    src={getImageUrl(secondPost.image2?.[0] || "")}
                    alt={secondPost.heading || "Blog Image"}
                    width={300}
                    height={200}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  />
                </Link>
              </div>
              <div className="col-span-5 lg:col-span-3 space-y-4">
                <Link
                  href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}`}
                >
                  <motion.p
                    dangerouslySetInnerHTML={{ __html: secondPost.heading }}
                    className="text-lg font-medium text-[#131313]"
                    whileHover={{
                      scaleX: 1.05,
                      transformOrigin: "left", // Ensures scaling happens from the left side
                      fontWeight: 900,
                      transition: { duration: 0.3 },
                    }}
                  />
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blogs/${secondPost.category_name}`}
                      className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                    >
                      {secondPost.category_name || "Category"}
                    </Link>
                    <Link
                      href={`/${secondPost.category_id}/${secondPost.subcategory_id}`}
                      className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                    >
                      {secondPost.sub_category_name || "Subcategory"}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <span
                      onClick={() => handleShare(secondPost)}
                      className="cursor-pointer"
                    >
                      <RiShareForwardLine className="w-6 h-6" />
                    </span>
                    {showShareMenu === secondPost.id && (
                      <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                        <FaTwitter
                          className="w-6 h-6 cursor-pointer text-blue-500"
                          onClick={() =>
                            shareToTwitter(
                              getShareUrl(
                                secondPost.category_id,
                                secondPost.subcategory_id,
                                secondPost.id
                              ),
                              secondPost.heading
                            )
                          }
                        />
                        <FaFacebook
                          className="w-6 h-6 cursor-pointer text-blue-700"
                          onClick={() =>
                            shareToFacebook(
                              getShareUrl(
                                secondPost.category_id,
                                secondPost.subcategory_id,
                                secondPost.id
                              )
                            )
                          }
                        />
                        <FaLinkedin
                          className="w-6 h-6 cursor-pointer text-blue-600"
                          onClick={() =>
                            shareToLinkedIn(
                              getShareUrl(
                                secondPost.category_id,
                                secondPost.subcategory_id,
                                secondPost.id
                              ),
                              secondPost.heading
                            )
                          }
                        />
                      </div>
                    )}
                    <TbTargetArrow className="w-6 h-6" />
                    <Link
                      href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}#comment`}
                      className="cursor-pointer"
                    >
                      <FaRegCommentDots className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
                <p
                  dangerouslySetInnerHTML={{ __html: secondPost.body1 }}
                  className="text-sm font-normal text-[#424242] line-clamp-3"
                />
                <p className="text-sm font-semibold uppercase text-[#424242]">
                  {secondPost.author} - {secondPost.date}
                </p>
              </div>
            </div>
          )}

          {thirdPost && (
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-5 lg:col-span-2 overflow-hidden">
                <Link
                  href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
                >
                  <Image
                    src={getImageUrl(thirdPost.image2?.[0] || "")}
                    alt={thirdPost.heading || "Blog Image"}
                    width={300}
                    height={200}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  />
                </Link>
              </div>
              <div className="col-span-5 lg:col-span-3 space-y-4">
                <Link
                  href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
                >
                  <motion.p
                    dangerouslySetInnerHTML={{ __html: thirdPost.heading }}
                    className="text-lg font-medium text-[#131313] "
                    whileHover={{
                      scaleX: 1.05,
                      transformOrigin: "left", // Ensures scaling happens from the left side
                      fontWeight: 900,
                      transition: { duration: 0.3 },
                    }}
                  />
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-3 relative">
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
                </div>
                <p
                  dangerouslySetInnerHTML={{ __html: thirdPost.body1 }}
                  className="text-sm font-normal text-[#424242] line-clamp-3"
                />
                <p className="text-sm font-semibold uppercase text-[#424242]">
                  {thirdPost.author} - {thirdPost.date}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end py-4">
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

export default Gear;

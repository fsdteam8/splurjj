"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaRegCommentDots,
} from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { motion } from "framer-motion";
import SocialShare from "@/components/ui/SocialShare";
import { SlLike } from "react-icons/sl";

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
  image2?: string[]; // Assuming image2 can be an array of strings
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

const ArtCulture: React.FC<ArtCultureProps> = ({ categoryName }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-lg max-h-[455px] flex items-center justify-center rounded-l-md p-4">
            <div className="bg-gray-300 h-12 w-3/4 rounded"></div>
          </div>
          <div>
            <div className="bg-gray-300 w-full h-[455px] rounded-r-md"></div>
            <div className="flex justify-end pt-4">
              <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton for Three-Post Grid */}
      <div className="py-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="max-h-[600px] relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
              </div>
              <div className="bg-gray-300 w-full h-[300px] rounded-t-md"></div>
              <div className="p-4 space-y-2">
                <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                  <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                  <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
                </div>
                <div className="bg-gray-300 h-4 w-full rounded"></div>
                <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
                <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton for Explore More Button */}
      <div className="flex justify-end py-4">
        <div className="bg-gray-300 h-8 w-32 rounded"></div>
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
  const thirdPost = posts[1];
  const fourthPost = posts[2];
  const fifthPost = posts[3];

  return (
    <div className="">
      {firstPost && (
        <div className="">
          <div className="md:flex items-center gap-2 mb-4 ">
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
{/* start  */}
              <div className="flex items-center gap-3 relative mt-4 md:mt-0 lg:mt-0 share-container">
                <SlLike className="w-6 h-6 cursor-pointer" />
                  <Link
                href={`/${firstPost.category_id}/${firstPost.subcategory_id}/${firstPost.id}#comment`}
                className="cursor-pointer"
              >
                <FaRegCommentDots className="w-6 h-6" />
              </Link>
                <RiShareForwardLine
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => toggleShare(firstPost.id)}
                />
                {activeSharePostId === firstPost.id && (
                  <div
                    className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3 
                    flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
                  >
                    <SocialShare
                      url={getShareUrl(
                        firstPost.category_id,
                        firstPost.subcategory_id,
                        firstPost.id
                      )}
                      title={firstPost.heading}
                      summary={firstPost.sub_heading || "Check out this post!"}
                    />
                  </div>
                )}
        <TbTargetArrow className="w-6 h-6 cursor-pointer" />
            
              </div>

              {/* end  */}

         


          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded overflow-hidden">
            <div className="bg-[#DDD618] aspect-[1.5/1] w-full flex items-center justify-center p-4 ">
              <Link
                href={`/${firstPost.category_id}/${firstPost.subcategory_id}/${firstPost.id}`}
                className="text-2xl font-medium text-[#131313] "
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: firstPost.heading }}
                  className="text-xl md:text-xl lg:text-4xl font-bold text-[#131313]"
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
                className="overflow-hidden"
              >
                <Image
                  src={getImageUrl(firstPost.image2?.[0] || "")}
                  alt={firstPost.heading || "Blog Image"}
                  width={888}
                  height={552}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-105 transition-all duration-500 ease-in-out"
                  priority
                />
              </Link>

              <p className="text-base font-semibold uppercase text-[#424242] pt-4 text-end">
                {firstPost.author} - {firstPost.date}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {thirdPost && (
            <div className="max-h-[600px] relative">
              <div className="flex items-center gap-2 mb-2">
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
              <div className="overflow-hidden ">
                <Link
                  href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
                >
                  <Image
                    src={getImageUrl(thirdPost.image2?.[0] || "")}
                    alt={thirdPost.heading || "Blog Image"}
                    width={400}
                    height={300}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    priority
                  />
                </Link>
              </div>

              <div className="p-4">
                <Link
                  href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
                >
                  <motion.p
                    dangerouslySetInnerHTML={{ __html: thirdPost.heading }}
                    className="text-2xl font-medium text-[#131313] "
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

               
{/* start  */}
              <div className="flex items-center gap-3 relative mt-2 share-container">
                <SlLike className="w-6 h-6 cursor-pointer" />
                <Link
                href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}#comment`}
                className="cursor-pointer"
              >
                <FaRegCommentDots className="w-6 h-6" />
              </Link>
                <RiShareForwardLine
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => toggleShare(thirdPost.id)}
                />
                {activeSharePostId === thirdPost.id && (
                  <div
                    className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3 
                    flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
                  >
                    <SocialShare
                      url={getShareUrl(
                        thirdPost.category_id,
                        thirdPost.subcategory_id,
                        thirdPost.id
                      )}
                      title={thirdPost.heading}
                      summary={thirdPost.sub_heading || "Check out this post!"}
                    />
                  </div>
                )}
        <TbTargetArrow className="w-6 h-6 cursor-pointer" />
              
              </div>

              {/* end  */}
                <p
                  dangerouslySetInnerHTML={{ __html: thirdPost.sub_heading }}
                  className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
                />
              </div>
            </div>
          )}

          {fourthPost && (
            <div className="max-h-[600px] relative">
              <div className="flex items-center gap-2 mb-2">
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
                    height={300}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    priority
                  />
                </Link>
              </div>

              <div className="p-4">
                <Link
                  href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}`}
                >
                  <motion.p
                    dangerouslySetInnerHTML={{ __html: fourthPost.heading }}
                    className="text-2xl font-medium text-[#131313] "
                    whileHover={{
                      scaleX: 1.05,
                      transformOrigin: "left", // Ensures scaling happens from the left side
                      fontWeight: 900,
                      transition: { duration: 0.3 },
                    }}
                  />
                </Link>
                <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                  {fourthPost.author} - {fourthPost.date}
                </p>
                {/* start  */}
              <div className="flex items-center gap-3 relative mt-2 share-container">
                <SlLike className="w-6 h-6 cursor-pointer" />
                 <Link
                href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}#comment`}
                className="cursor-pointer"
              >
                <FaRegCommentDots className="w-6 h-6" />
              </Link>
                <RiShareForwardLine
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => toggleShare(fourthPost.id)}
                />
                {activeSharePostId === fourthPost.id && (
                  <div
                    className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3 
                    flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
                  >
                    <SocialShare
                      url={getShareUrl(
                        fourthPost.category_id,
                        fourthPost.subcategory_id,
                        fourthPost.id
                      )}
                      title={fourthPost.heading}
                      summary={fourthPost.sub_heading || "Check out this post!"}
                    />
                  </div>
                )}
        <TbTargetArrow className="w-6 h-6 cursor-pointer" />
             
              </div>

              {/* end  */}
                <p
                  dangerouslySetInnerHTML={{ __html: fourthPost.sub_heading }}
                  className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
                />
              </div>
            </div>
          )}

          {fifthPost && (
            <div className="max-h-[600px] relative">
              <div className="flex items-center gap-2 mb-2">
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
              <div className="relative">
                <div className="overflow-hidden">
                  <Link
                    href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}`}
                  >
                    <Image
                      src={getImageUrl(fifthPost.image2?.[0] || "")}
                      alt={fifthPost.heading || "Blog Image"}
                      width={400}
                      height={300}
                      // className="w-full h-[300px] object-cover object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                      className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                      priority
                    />
                  </Link>
                </div>

                <div className="p-4">
                  <Link
                    href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}`}
                  >
                    <motion.p
                      dangerouslySetInnerHTML={{ __html: fifthPost.heading }}
                      className="text-2xl font-medium text-[#131313] "
                      whileHover={{
                        scaleX: 1.05,
                        transformOrigin: "left", // Ensures scaling happens from the left side
                        fontWeight: 900,
                        transition: { duration: 0.3 },
                      }}
                    />
                  </Link>
                  <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                    {fifthPost.author} - {fifthPost.date}
                  </p>
                {/* start  */}
              <div className="flex items-center gap-3 relative mt-2 share-container">
                <SlLike className="w-6 h-6 cursor-pointer" />
                <Link
                href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}#comment`}
                className="cursor-pointer"
              >
                <FaRegCommentDots className="w-6 h-6" />
              </Link>
                <RiShareForwardLine
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => toggleShare(fifthPost.id)}
                />
                {activeSharePostId === fifthPost.id && (
                  <div
                    className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3 
                    flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
                  >
                    <SocialShare
                      url={getShareUrl(
                        fifthPost.category_id,
                        fifthPost.subcategory_id,
                        fifthPost.id
                      )}
                      title={fifthPost.heading}
                      summary={fifthPost.sub_heading || "Check out this post!"}
                    />
                  </div>
                )}
        <TbTargetArrow className="w-6 h-6 cursor-pointer" />
              
              </div>

              {/* end  */}
                  <p
                    dangerouslySetInnerHTML={{ __html: fifthPost.sub_heading }}
                    className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
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
  );
};

export default ArtCulture;

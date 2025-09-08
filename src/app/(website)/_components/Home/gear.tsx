"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import GearCarousel from "./GearCarousel";
import { motion } from "framer-motion";
import SocialShare from "@/components/ui/SocialShare";
import { SlLike } from "react-icons/sl";
import { HomeContentApiResponse } from "@/components/types/home-page-data-type";
import { useQuery } from "@tanstack/react-query";


interface ArtCultureProps {
  categoryName: { categoryName: string };
}

const Gear: React.FC<ArtCultureProps> = ({ categoryName }) => {

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

  // Get API call for home page
  const { data, isLoading, isError, error } = useQuery<HomeContentApiResponse>({
    queryKey: ["gear"],
    queryFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/${categoryName?.categoryName}`
      ).then((res) => res.json()),
  });

  const posts = data?.data || [];

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

  if (isLoading) return <SkeletonLoader />;
  if (isError) {
    return (
      <div className="text-black text-lg font-medium">
        Error: {error.message || "Something went wrong"}
      </div>
    );
  }
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
                <div className="flex items-center gap-3 justify-between">
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

                  {/* start  */}
                  <div className="flex items-center gap-3 relative share-container ">
                    <SlLike className="w-6 h-6 cursor-pointer" />
                    <Link
                      href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}#comment`}
                      className="cursor-pointer"
                    >
                      <FaRegCommentDots className="w-6 h-6" />
                    </Link>
                    <RiShareForwardLine
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => toggleShare(secondPost.id)}
                    />
                    {activeSharePostId === secondPost.id && (
                      <div
                        className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3 
                    flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
                      >
                        <SocialShare
                          url={getShareUrl(
                            secondPost.category_id,
                            secondPost.subcategory_id,
                            secondPost.id
                          )}
                          title={secondPost.heading}
                          summary={
                            secondPost.sub_heading || "Check out this post!"
                          }
                        />
                      </div>
                    )}
               <TbTargetArrow className="w-6 h-6 cursor-pointer" />
                  </div>

                  {/* end  */}
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
                  {/* start  */}
                  <div className="flex items-center gap-3 relative mt-4 md:mt-0 lg:mt-0 share-container">
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
                          summary={
                            thirdPost.sub_heading || "Check out this post!"
                          }
                        />
                      </div>
                    )}
               <TbTargetArrow className="w-6 h-6 cursor-pointer" />
                  </div>

                  {/* end  */}
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

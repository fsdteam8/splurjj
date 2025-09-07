// components/AllContents.tsx
"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaRegCommentDots } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { TbTargetArrow } from "react-icons/tb";
import ImageCarousel from "./ImageCarousel";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HomeContentApiResponse } from "@/components/types/home-page-data-type";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SocialShareContent from "@/components/ui/SocialShareContent";

const AllContents: React.FC = () => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

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
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["home-hero-section"] });
    },
  });

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

  // Get API call for home content
  const { data, isLoading, isError, error } = useQuery<HomeContentApiResponse>({
    queryKey: ["home-hero-section"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home`).then(
        (res) => res.json()
      ),
  });

  const contents = data?.data || [];

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      {/* Skeleton for First Post */}
      <div className="mb-16">
        <div>
          <div className="flex items-center gap-4 mb-4">
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
          <div className="space-y-4">
            <div className="bg-gray-300 h-16 w-3/4 rounded"></div>
            <div className="bg-gray-300 h-4 w-full rounded"></div>
            <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
          </div>
        </div>
        <div className="mt-8">
          <div className="bg-gray-300 w-full h-[680px] rounded-lg"></div>
        </div>
      </div>

      {/* Skeleton for Grid of Three Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gray-300 h-6 w-20 rounded"></div>
              <div className="bg-gray-300 h-6 w-20 rounded"></div>
            </div>
            <div className="bg-gray-300 w-full h-[300px] rounded-t-lg"></div>
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

      {/* Skeleton for Explore More Button */}
      <div className="flex justify-end">
        <div className="bg-gray-300 h-8 w-32 rounded"></div>
      </div>
    </div>
  );

  if (isLoading) return <SkeletonLoader />;
  if (isError) {
    return (
      <div className="text-black text-lg font-medium">
        Error: {error?.message}
      </div>
    );
  }

  const firstPost = contents[0];
  const secondPost = contents[1];
  const thirdPost = contents[2];
  const fourthPost = contents[3];

  return (
    <div className="">
      {firstPost && (
        <div className="mb-6 md:mb-12 lg:mb-16">
          <div>
            <div className="md:flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${firstPost.category_name}`}
                  className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {firstPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${firstPost.category_id}/${firstPost.subcategory_id}`}
                  className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {firstPost.sub_category_name || "Subcategory"}
                </Link>
              </div>

              {/* social icon start */}
              <div className="flex items-center gap-3 relative">
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(firstPost?.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {firstPost?.likes_count || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${firstPost.category_id}/${firstPost.subcategory_id}/${firstPost.id}#comment`}
                  >
                    <button className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 cursor-pointer" />
                    </button>
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {firstPost?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={firstPost.id}
                  categoryId={firstPost.category_id}
                  subcategoryId={firstPost.subcategory_id}
                  heading={firstPost.heading}
                  subHeading={firstPost.sub_heading}
                  initialSharesCount={firstPost.shares_count || 0}
                  token={token} // Pass token to SocialShareContent
                />
                <TbTargetArrow className="w-6 h-6 cursor-pointer" />
              </div>

              {/* social icon end  */}
            </div>
            <div className="">
              <Link
                className="content-heding-text"
                href={`/${firstPost?.category_id}/${firstPost?.subcategory_id}/${firstPost?.id}`}
              >
                <h1
                  dangerouslySetInnerHTML={{ __html: firstPost.heading }}
                  className="text-3xl md:text-[40px] lg:text-[60px] font-[400] leading-[120%] transition-all duration-100 ease-in-out cursor-pointer hover:scale-102 hover:font-medium"
                />
              </Link>
              <p
                dangerouslySetInnerHTML={{ __html: firstPost.sub_heading }}
                className="text-base font-normal text-[#424242] dark:white-text line-clamp-3"
              />
              <p className="text-base font-semibold uppercase text-[#424242]">
                {firstPost.author} - {firstPost.date}
              </p>
            </div>
          </div>
          <div className="mt-8">
            <ImageCarousel posts={[firstPost]} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
        {secondPost && (
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/blogs/${secondPost.category_name}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
              >
                {secondPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${secondPost.category_id}/${secondPost.subcategory_id}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
              >
                {secondPost.sub_category_name || "Subcategory"}
              </Link>
            </div>
            <div className="overflow-hidden">
              <Link
                href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}`}
              >
                <Image
                  src={getImageUrl(secondPost.image2?.[0] || "")}
                  alt={secondPost.heading}
                  width={400}
                  height={300}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  priority
                />
              </Link>
            </div>
            <div className="p-4">
              <Link
                href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: secondPost.heading }}
                  className="text-2xl font-medium"
                  whileHover={{
                    scale: 1.05,
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {secondPost.author} - {secondPost.date}
              </p>
              <div className="flex items-center gap-3 mt-2 relative">
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(secondPost?.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {secondPost?.likes_count || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}#comment`}
                  >
                    <FaRegCommentDots className="w-6 h-6 cursor-pointer" />
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {secondPost?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={secondPost.id}
                  categoryId={secondPost.category_id}
                  subcategoryId={secondPost.subcategory_id}
                  heading={secondPost.heading}
                  subHeading={secondPost.sub_heading}
                  initialSharesCount={secondPost.shares_count || 0}
                  token={token} // Pass token to SocialShareContent
                />
                <TbTargetArrow className="w-6 h-6 cursor-pointer" />
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: secondPost.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          </div>
        )}

        {thirdPost && (
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/blogs/${thirdPost.category_name}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
              >
                {thirdPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
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
                  alt={thirdPost.heading}
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
                  className="text-2xl font-medium"
                  whileHover={{
                    scale: 1.05,
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {thirdPost.author} - {thirdPost.date}
              </p>
              <div className="flex items-center gap-3 mt-2 relative">
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(thirdPost.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {thirdPost?.likes_count || 0}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}#comment`}
                    className="cursor-pointer"
                  >
                    <FaRegCommentDots className="w-6 h-6 cursor-pointer" />
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {thirdPost?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={thirdPost.id}
                  categoryId={thirdPost.category_id}
                  subcategoryId={thirdPost.subcategory_id}
                  heading={thirdPost.heading}
                  subHeading={thirdPost.sub_heading}
                  initialSharesCount={thirdPost.shares_count || 0}
                  token={token} // Pass token to SocialShareContent
                />
                <TbTargetArrow className="w-6 h-6 cursor-pointer" />
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: thirdPost.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          </div>
        )}

        {fourthPost && (
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/blogs/${fourthPost.category_name}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
              >
                {fourthPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
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
                  alt={fourthPost.heading}
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
                  className="text-2xl font-medium"
                  whileHover={{
                    scale: 1.05,
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {fourthPost.author} - {fourthPost.date}
              </p>
              <div className="flex items-center gap-3 mt-2 relative">
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(fourthPost.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {fourthPost?.likes_count || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}#comment`}
                    className="cursor-pointer"
                  >
                    <FaRegCommentDots className="w-6 h-6 cursor-pointer" />
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {fourthPost?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={fourthPost.id}
                  categoryId={fourthPost.category_id}
                  subcategoryId={fourthPost.subcategory_id}
                  heading={fourthPost.heading}
                  subHeading={fourthPost.sub_heading}
                  initialSharesCount={fourthPost.shares_count || 0}
                  token={token} // Pass token to SocialShareContent
                />
                <TbTargetArrow className="w-6 h-6 cursor-pointer" />
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: fourthPost.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          href="/homeAllContent"
          className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white flex items-center gap-2"
        >
          EXPLORE MORE <ArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default AllContents;

// "use client";

// import { ArrowRight } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { FaRegCommentDots } from "react-icons/fa";
// import { RiShareForwardLine } from "react-icons/ri";
// import { TbTargetArrow } from "react-icons/tb";
// import { SlLike } from "react-icons/sl";
// import ImageCarousel from "./ImageCarousel";
// import { motion } from "framer-motion";
// import SocialShare from "@/components/ui/SocialShare";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { HomeContentApiResponse } from "@/components/types/home-page-data-type";
// import { useSession } from "next-auth/react";

// const AllContents: React.FC = () => {
//   const session = useSession();
//   const token = (session?.data?.user as { token: string })?.token;
//   const queryClient = useQueryClient();
//   // share start
//   const [activeSharePostId, setActiveSharePostId] = useState<number | null>(
//     null
//   );

//   // Toggle share modal
//   const toggleShare = (postId: number) => {
//     setActiveSharePostId(activeSharePostId === postId ? null : postId);
//   };

//   // Close on outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       const target = event.target as HTMLElement;

//       // Close only if click is outside all share containers
//       if (!target.closest(".share-container")) {
//         setActiveSharePostId(null);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const getShareUrl = (
//     categoryId: number,
//     subcategoryId: number,
//     id: number
//   ): string => {
//     if (typeof window === "undefined") return ""; // avoid SSR crash
//     return `${window.location.origin}/${categoryId}/${subcategoryId}/${id}`;
//   };

//   // share close

//   // console.log("home data", contents);
//   function convertToCDNUrl(image2?: string): string {
//     const image2BaseUrl = "https://s3.amazonaws.com/splurjjimages/images";
//     const cdnBaseUrl = "https://dsfua14fu9fn0.cloudfront.net/images";

//     if (typeof image2 === "string" && image2.startsWith(image2BaseUrl)) {
//       return image2.replace(image2BaseUrl, cdnBaseUrl);
//     }

//     return image2 || "";
//   }

//   function getImageUrl(image2?: string) {
//     if (!image2) return "";

//     try {
//       const parsed = JSON.parse(image2);
//       if (parsed?.image2) {
//         return convertToCDNUrl(parsed.image2);
//       }
//     } catch {
//       return convertToCDNUrl(image2);
//     }

//     return "";
//   }

//   // get api call
//   const { data, isLoading, isError, error } = useQuery<HomeContentApiResponse>({
//     queryKey: ["home-hero-section"],
//     queryFn: async () =>
//       await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home`).then(
//         (res) => res.json()
//       ),
//   });

//   // console.log("response data", data)
//   const contents = data?.data || [];
//   console.log("contes data", contents);

//   // like post api logic
//   const { mutate } = useMutation({
//     mutationKey: ["like-post"],
//     mutationFn: async (postId: number) =>
//       await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${postId}/like`,
//         { method: "POST", headers: { Authorization: `Bearer ${token}` } }
//       ).then((res) => res.json()),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["home-hero-section"] });
//     },
//   });

//   const handleLike = (postId: number) => {
//     mutate(postId);
//   };

//   // const getImageUrl = (path: string | null): string => {
//   //   if (!path) return "/fallback-image.jpg";
//   //   if (path.startsWith("http")) return path;
//   //   return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.replace(/^\/+/, "")}`;
//   // };

//   // Skeleton Loading Component
//   const SkeletonLoader = () => (
//     <div className="animate-pulse">
//       {/* Skeleton for First Post */}
//       <div className="mb-16">
//         <div>
//           <div className="flex items-center gap-4 mb-4">
//             <div className="flex items-center gap-2">
//               <div className="bg-gray-300 h-8 w-24 rounded"></div>
//               <div className="bg-gray-300 h-8 w-24 rounded"></div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//               <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//               <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div className="bg-gray-300 h-16 w-3/4 rounded"></div>
//             <div className="bg-gray-300 h-4 w-full rounded"></div>
//             <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
//             <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
//             <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
//           </div>
//         </div>
//         <div className="mt-8">
//           <div className="bg-gray-300 w-full h-[680px] rounded-lg"></div>
//         </div>
//       </div>

//       {/* Skeleton for Grid of Three Posts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
//         {[1, 2, 3].map((_, index) => (
//           <div key={index} className="relative">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="bg-gray-300 h-6 w-20 rounded"></div>
//               <div className="bg-gray-300 h-6 w-20 rounded"></div>
//             </div>
//             <div className="bg-gray-300 w-full h-[300px] rounded-t-lg"></div>
//             <div className="p-4 space-y-2">
//               <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
//               <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
//               <div className="flex items-center gap-3">
//                 <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//                 <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//                 <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
//               </div>
//               <div className="bg-gray-300 h-4 w-full rounded"></div>
//               <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
//               <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Skeleton for Explore More Button */}
//       <div className="flex justify-end">
//         <div className="bg-gray-300 h-8 w-32 rounded"></div>
//       </div>
//     </div>
//   );

//   if (isLoading) return <SkeletonLoader />;
//   if (isError) {
//     return (
//       <div className="text-black text-lg font-medium">
//         Error: {error?.message}
//       </div>
//     );
//   }

//   const firstPost = contents[0];
//   const secondPost = contents[1];
//   const thirdPost = contents[2];
//   const fourthPost = contents[3];
//   // const otherPosts = contents.slice(1); // All posts except the first

//   // console.log(firstPost)

//   return (
//     <div className="">
//       {firstPost && (
//         <div className="mb-6 md:mb-12 lg:mb-16">
//           <div>
//             <div className="md:flex items-center gap-4 mb-4">
//               <div className="flex items-center gap-2">
//                 <Link
//                   href={`/blogs/${firstPost.category_name}`}
//                   className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
//                 >
//                   {firstPost.category_name || "Category"}
//                 </Link>
//                 <Link
//                   href={`/${firstPost.category_id}/${firstPost.subcategory_id}`}
//                   className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
//                 >
//                   {firstPost.sub_category_name || "Subcategory"}
//                 </Link>
//               </div>

//               {/* start  */}
//               <div className="flex items-center gap-3 relative share-container">
//                 <div className="flex items-center gap-2">
//                   <button onClick={() => handleLike(firstPost?.id)}>
//                     <SlLike className="w-6 h-6 cursor-pointer" />
//                   </button>
//                   <p className="text-lg font-medium text-black dark:text-white leading-normal">
//                     {firstPost?.likes_count || 0}
//                   </p>
//                 </div>
//                 <div>
//                   <Link
//                     href={`/${firstPost.category_id}/${firstPost.subcategory_id}/${firstPost.id}#comment`}
//                     className="flex items-center gap-2"
//                   >
//                     <button className="cursor-pointer">
//                       <FaRegCommentDots className="w-6 h-6 cursor-pointer " />
//                     </button>
//                     <p className="text-lg font-medium text-black dark:text-white leading-normal">
//                       {firstPost?.comment_count || 0}
//                     </p>
//                   </Link>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button>
//                     <RiShareForwardLine
//                       className="w-6 h-6 cursor-pointer "
//                       onClick={() => toggleShare(firstPost.id)}
//                     />
//                   </button>
//                   <p className="text-lg font-medium text-black dark:text-white leading-normal">
//                     {firstPost?.shares_count || 0}
//                   </p>
//                 </div>
//                 {activeSharePostId === firstPost.id && (
//                   <div
//                     className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3
//                     flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
//                   >
//                     <SocialShare
//                       url={getShareUrl(
//                         firstPost.category_id,
//                         firstPost.subcategory_id,
//                         firstPost.id
//                       )}
//                       title={firstPost.heading}
//                       summary={firstPost.sub_heading || "Check out this post!"}
//                     />
//                   </div>
//                 )}

//                 <TbTargetArrow className="w-6 h-6 cursor-pointer " />
//               </div>

//               {/* end  */}
//             </div>
//             <div className=" ">
//               <Link
//                 className="content-heding-text"
//                 href={`/${firstPost?.category_id}/${firstPost?.subcategory_id}/${firstPost?.id}`}
//               >
//                 <h1
//                   dangerouslySetInnerHTML={{ __html: firstPost.heading }}
//                   className="text-3xl md:text-[40px] lg:text-[60px] font-[400]  leading-[120%] transition-all duration-100 ease-in-out cursor-pointer hover:scale-102 hover:font-medium"
//                 />
//               </Link>

//               <p
//                 dangerouslySetInnerHTML={{ __html: firstPost.sub_heading }}
//                 className="text-base font-normal text-[#424242] dark:white-text line-clamp-3"
//               />

//               <p className="text-base font-semibold uppercase text-[#424242]">
//                 {firstPost.author} - {firstPost.date}
//               </p>
//             </div>
//           </div>
//           <div className="mt-8">
//             <ImageCarousel posts={[firstPost]} />
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
//         {secondPost && (
//           <div className="relative">
//             <div className="flex items-center gap-2 mb-2">
//               <Link
//                 href={`/blogs/${secondPost.category_name}`}
//                 className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
//               >
//                 {secondPost.category_name || "Category"}
//               </Link>
//               <Link
//                 href={`/${secondPost.category_id}/${secondPost.subcategory_id}`}
//                 className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
//               >
//                 {secondPost.sub_category_name || "Subcategory"}
//               </Link>
//             </div>
//             <div className="overflow-hidden">
//               <Link
//                 href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}`}
//               >
//                 <Image
//                   src={getImageUrl(secondPost.image2?.[0] || "")}
//                   alt={secondPost.heading}
//                   width={400}
//                   height={300}
//                   className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
//                   priority
//                 />
//               </Link>
//             </div>

//             <div className="p-4">
//               <Link
//                 href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}`}
//               >
//                 <motion.p
//                   dangerouslySetInnerHTML={{ __html: secondPost.heading }}
//                   className="text-2xl font-medium "
//                   whileHover={{
//                     scale: 1.05,
//                     fontWeight: 900,
//                     transition: { duration: 0.3 },
//                   }}
//                 />
//               </Link>

//               <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
//                 {secondPost.author} - {secondPost.date}
//               </p>

//               {/* start  */}
//               <div className="flex items-center gap-3 mt-2 relative share-container">
//                 <button>
//                   <SlLike className="w-6 h-6 cursor-pointer" />
//                 </button>
//                 <Link
//                   href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}#comment`}
//                   className="cursor-pointer"
//                 >
//                   <FaRegCommentDots className="w-6 h-6 cursor-pointer" />
//                 </Link>
//                 <RiShareForwardLine
//                   className="w-6 h-6 cursor-pointer"
//                   onClick={() => toggleShare(secondPost.id)}
//                 />

//                 {activeSharePostId === secondPost.id && (
//                   <div
//                     className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3
//                      flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
//                   >
//                     <SocialShare
//                       url={getShareUrl(
//                         secondPost.category_id,
//                         secondPost.subcategory_id,
//                         secondPost.id
//                       )}
//                       title={secondPost.heading}
//                       summary={secondPost.sub_heading || "Check out this post!"}
//                     />
//                   </div>
//                 )}

//                 <TbTargetArrow className="w-6 h-6 cursor-pointer" />
//               </div>
//               {/* end  */}
//               <p
//                 dangerouslySetInnerHTML={{ __html: secondPost.sub_heading }}
//                 className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
//               />
//             </div>
//           </div>
//         )}

//         {thirdPost && (
//           <div className="relative">
//             <div className="flex items-center gap-2 mb-2">
//               <Link
//                 href={`/blogs/${thirdPost.category_name}`}
//                 className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
//               >
//                 {thirdPost.category_name || "Category"}
//               </Link>
//               <Link
//                 href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}`}
//                 className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
//               >
//                 {thirdPost.sub_category_name || "Subcategory"}
//               </Link>
//             </div>
//             <div className="overflow-hidden">
//               <Link
//                 href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
//               >
//                 <Image
//                   src={getImageUrl(thirdPost.image2?.[0] || "")}
//                   alt={thirdPost.heading}
//                   width={400}
//                   height={300}
//                   className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
//                   priority
//                 />
//               </Link>
//             </div>
//             <div className="p-4">
//               <Link
//                 href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
//               >
//                 <motion.p
//                   dangerouslySetInnerHTML={{ __html: thirdPost.heading }}
//                   className="text-2xl font-medium "
//                   whileHover={{
//                     scale: 1.05,
//                     fontWeight: 900,
//                     transition: { duration: 0.3 },
//                   }}
//                 />
//               </Link>
//               <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
//                 {thirdPost.author} - {thirdPost.date}
//               </p>
//               {/* start  */}
//               <div className="flex items-center gap-3 mt-2 relative share-container">
//                 <SlLike className="w-6 h-6 cursor-pointer" />
//                 <Link
//                   href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}#comment`}
//                   className="cursor-pointer"
//                 >
//                   <FaRegCommentDots className="w-6 h-6 cursor-pointer" />
//                 </Link>
//                 <RiShareForwardLine
//                   className="w-6 h-6 cursor-pointer"
//                   onClick={() => toggleShare(thirdPost.id)}
//                 />

//                 {activeSharePostId === thirdPost.id && (
//                   <div
//                     className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3
//                      flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
//                   >
//                     <SocialShare
//                       url={getShareUrl(
//                         thirdPost.category_id,
//                         thirdPost.subcategory_id,
//                         thirdPost.id
//                       )}
//                       title={thirdPost.heading}
//                       summary={thirdPost.sub_heading || "Check out this post!"}
//                     />
//                   </div>
//                 )}

//                 <TbTargetArrow className="w-6 h-6 cursor-pointer" />
//               </div>
//               {/* end  */}
//               <p
//                 dangerouslySetInnerHTML={{ __html: thirdPost.sub_heading }}
//                 className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
//               />
//             </div>
//           </div>
//         )}

//         {fourthPost && (
//           <div className="relative">
//             <div className="flex items-center gap-2 mb-2">
//               <Link
//                 href={`/blogs/${fourthPost.category_name}`}
//                 className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
//               >
//                 {fourthPost.category_name || "Category"}
//               </Link>
//               <Link
//                 href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}`}
//                 className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
//               >
//                 {fourthPost.sub_category_name || "Subcategory"}
//               </Link>
//             </div>
//             <div className="overflow-hidden">
//               <Link
//                 href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}`}
//               >
//                 <Image
//                   src={getImageUrl(fourthPost.image2?.[0] || "")}
//                   alt={fourthPost.heading}
//                   width={400}
//                   height={300}
//                   className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
//                   priority
//                 />
//               </Link>
//             </div>
//             <div className="p-4">
//               <Link
//                 href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}`}
//               >
//                 <motion.p
//                   dangerouslySetInnerHTML={{ __html: fourthPost.heading }}
//                   className="text-2xl font-medium "
//                   whileHover={{
//                     scale: 1.05,
//                     fontWeight: 900,
//                     transition: { duration: 0.3 },
//                   }}
//                 />
//               </Link>
//               <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
//                 {fourthPost.author} - {fourthPost.date}
//               </p>
//               {/* start  */}
//               <div className="flex items-center gap-3 mt-2 relative share-container">
//                 <SlLike className="w-6 h-6 cursor-pointer" />
//                 <Link
//                   href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}#comment`}
//                   className="cursor-pointer"
//                 >
//                   <FaRegCommentDots className="w-6 h-6 cursor-pointer" />
//                 </Link>
//                 <RiShareForwardLine
//                   className="w-6 h-6 cursor-pointer"
//                   onClick={() => toggleShare(fourthPost.id)}
//                 />

//                 {activeSharePostId === fourthPost.id && (
//                   <div
//                     className="absolute top-10 left-0 z-20 bg-white shadow-lg rounded-xl p-3
//                      flex flex-wrap gap-3 w-[220px] sm:w-auto max-w-[90vw]"
//                   >
//                     <SocialShare
//                       url={getShareUrl(
//                         fourthPost.category_id,
//                         fourthPost.subcategory_id,
//                         fourthPost.id
//                       )}
//                       title={fourthPost.heading}
//                       summary={fourthPost.sub_heading || "Check out this post!"}
//                     />
//                   </div>
//                 )}

//                 <TbTargetArrow className="w-6 h-6 cursor-pointer" />
//               </div>
//               {/* end  */}
//               <p
//                 dangerouslySetInnerHTML={{ __html: fourthPost.sub_heading }}
//                 className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end">
//         <Link
//           href="/homeAllContent"
//           className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white flex items-center gap-2"
//         >
//           EXPLORE MORE <ArrowRight />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default AllContents;

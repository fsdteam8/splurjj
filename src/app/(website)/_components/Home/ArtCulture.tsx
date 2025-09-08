"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaRegCommentDots } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { motion } from "framer-motion";
import { SlLike } from "react-icons/sl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HomeContentApiResponse } from "@/components/types/home-page-data-type";
import SocialShareContent from "@/components/ui/SocialShareContent";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface ArtCultureProps {
  categoryName: { categoryName: string };
}

const ArtCulture: React.FC<ArtCultureProps> = ({ categoryName }) => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  // Get API call for home page
  const { data, isLoading, isError, error } = useQuery<HomeContentApiResponse>({
    queryKey: ["art-culture"],
    queryFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/${categoryName.categoryName}`
      ).then((res) => res.json()),
  });

  const posts = data?.data || [];

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
      queryClient.invalidateQueries({ queryKey: ["art-culture"] });
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
  const thirdPost = posts[1];
  const fourthPost = posts[2];
  const fifthPost = posts[3];

  console.log(firstPost);

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
                    <FaRegCommentDots className="w-6 h-6 cursor-pointer mt-1" />
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
                token={token}
              />
              <TbTargetArrow className="w-6 h-6 cursor-pointer" />
            </div>

            {/* social icon end  */}
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

                {/* social icon start */}
                <div className="flex items-center gap-3 mt-2 relative">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleLike(thirdPost?.id)}>
                      <SlLike className="w-6 h-6 cursor-pointer" />
                    </button>
                    <p className="text-lg font-medium text-black dark:text-white leading-normal">
                      {thirdPost?.likes_count || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}#comment`}
                    >
                      <button className="cursor-pointer">
                        <FaRegCommentDots className="w-6 h-6 cursor-pointer mt-1" />
                      </button>
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
                    token={token}
                  />
                  <TbTargetArrow className="w-6 h-6 cursor-pointer" />
                </div>

                {/* social icon end  */}
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
                {/* social icon start */}
                <div className="flex items-center gap-3 mt-2 relative">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleLike(fourthPost?.id)}>
                      <SlLike className="w-6 h-6 cursor-pointer" />
                    </button>
                    <p className="text-lg font-medium text-black dark:text-white leading-normal">
                      {fourthPost?.likes_count || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}#comment`}
                    >
                      <button className="cursor-pointer">
                        <FaRegCommentDots className="w-6 h-6 cursor-pointer mt-1" />
                      </button>
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
                    token={token}
                  />
                  <TbTargetArrow className="w-6 h-6 cursor-pointer" />
                </div>

                {/* social icon end  */}
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
                  {/* social icon start */}
                  <div className="flex items-center gap-3 mt-2 relative">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleLike(fifthPost?.id)}>
                        <SlLike className="w-6 h-6 cursor-pointer" />
                      </button>
                      <p className="text-lg font-medium text-black dark:text-white leading-normal">
                        {fifthPost?.likes_count || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}#comment`}
                      >
                        <button className="cursor-pointer">
                          <FaRegCommentDots className="w-6 h-6 cursor-pointer mt-1" />
                        </button>
                      </Link>
                      <p className="text-lg font-medium text-black dark:text-white leading-normal">
                        {fifthPost?.comment_count || 0}
                      </p>
                    </div>
                    <SocialShareContent
                      postId={fifthPost.id}
                      categoryId={fifthPost.category_id}
                      subcategoryId={fifthPost.subcategory_id}
                      heading={fifthPost.heading}
                      subHeading={fifthPost.sub_heading}
                      initialSharesCount={fifthPost.shares_count || 0}
                      token={token}
                    />
                    <TbTargetArrow className="w-6 h-6 cursor-pointer" />
                  </div>

                  {/* social icon end  */}
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

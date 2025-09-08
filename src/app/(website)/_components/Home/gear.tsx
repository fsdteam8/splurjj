"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaRegCommentDots } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import GearCarousel from "./GearCarousel";
import { motion } from "framer-motion";
import { SlLike } from "react-icons/sl";
import { HomeContentApiResponse } from "@/components/types/home-page-data-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SocialShareContent from "@/components/ui/SocialShareContent";

interface ArtCultureProps {
  categoryName: { categoryName: string };
}

const Gear: React.FC<ArtCultureProps> = ({ categoryName }) => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  // Get API call for home page
  const { data, isLoading, isError, error } = useQuery<HomeContentApiResponse>({
    queryKey: ["gear"],
    queryFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/${categoryName?.categoryName}`
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
      queryClient.invalidateQueries({ queryKey: ["gear"] });
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
                    <FaRegCommentDots className="w-6 h-6 mt-1 cursor-pointer" />
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
                <div className="flex flex-col items-start gap-3 justify-between">
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

                  {/* social icon start */}
                  <div className="flex items-center gap-3 relative">
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
                        <button className="cursor-pointer">
                          <FaRegCommentDots className="w-6 h-6 cursor-pointer mt-1" />
                        </button>
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
                      token={token}
                    />
                    <TbTargetArrow className="w-6 h-6 cursor-pointer" />
                  </div>

                  {/* social icon end  */}
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
                <div className="flex flex-col items-start justify-between">
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

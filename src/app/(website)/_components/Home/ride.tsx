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
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SocialShareContent from "@/components/ui/SocialShareContent";
import { AiFillLike } from "react-icons/ai";
import { LikeApiResponse } from "@/components/types/like-get-data-type";

interface ArtCultureProps {
  categoryName: { categoryName: string };
}

const Ride: React.FC<ArtCultureProps> = ({ categoryName }) => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  // Get API call for home page
  const { data, isLoading, isError, error } = useQuery<HomeContentApiResponse>({
    queryKey: ["ride"],
    queryFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/${categoryName?.categoryName}`
      ).then((res) => res.json()),
  });

  const posts = data?.data || [];


  // like get api logic
  const PostLikeStatus: React.FC<{ postId: number }> = ({ postId }) => {
    const { data: likeData, isLoading: isLikeLoading } =
      useQuery<LikeApiResponse>({
        queryKey: ["like", postId],
        queryFn: () =>
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/${postId}/like-status`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).then((res) => res.json()),
      });

    return (
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => handleLike(postId)}>
          {likeData?.data?.liked ? (
            <AiFillLike className="w-6 h-6 cursor-pointer text-primary" />
          ) : (
            <SlLike className="w-6 h-6 cursor-pointer" />
          )}
        </button>
        <p className="text-lg font-medium text-black dark:text-white leading-normal">
          {isLikeLoading ? "..." : likeData?.data?.likes_count || 0}
        </p>
      </div>
    );
  };

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
    onSuccess: (postId) => {
      // toast.success(data?.message || "Liked successfully");

      // Invalidate the post query so the like count updates
      queryClient.invalidateQueries({ queryKey: ["like", postId] });
    },

    onError: (error: Error) => {
      if (!token) {
        toast.error("You need to login first");
      } else {
        toast.error(error.message || "Something went wrong");
      }
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
    <div className="animate-pulse py-8">
      {/* Skeleton for First Post */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
            <div className="flex items-center gap-2">
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
          <div className="col-span-3">
            <div className="bg-gray-300 w-full h-[213px] rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Skeleton for Second Post */}
      <div className="mb-8">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 lg:col-span-3">
            <div className="bg-gray-300 w-full h-[213px] rounded-md"></div>
          </div>
          <div className="col-span-5 lg:col-span-2 space-y-4">
            <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
            <div className="flex items-center gap-2">
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
  const secondPost = posts[1];

  return (
    <div className="py-8 ">
      {firstPost && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 ">
            <div className="col-span-2 space-y-4 border-2 border-red-500">
              <Link
                href={`/${firstPost.cat_slug}/${firstPost.sub_slug}/${firstPost.slug}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: firstPost.heading }}
                  className="text-lg font-medium text-[#131313]  text-start"
                  whileHover={{
                    scaleX: 1.02,
                    transformOrigin: "left", // Ensures scaling happens from the left side
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2">
                <div className="flex items-start md:items-center gap-2">
                  <Link
                    href={`/blogs/${firstPost.cat_slug}`}
                    className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                  >
                    {firstPost.category_name || "Category"}
                  </Link>
                  <Link
                    href={`/${firstPost.cat_slug}/${firstPost.sub_slug}`}
                    className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                  >
                    {firstPost.sub_category_name || "Subcategory"}
                  </Link>
                </div>

                {/* social icon start */}
                <div className="flex items-start md:items-center gap-5 relative mt-4 md:mt-0 ">
                  <PostLikeStatus postId={firstPost.id} />
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${firstPost.cat_slug}/${firstPost.sub_slug}/${firstPost.slug}#comment`}
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
                    postId={firstPost.slug}
                    categoryId={firstPost.cat_slug}
                    subcategoryId={firstPost.sub_slug}
                    heading={firstPost.heading}
                    subHeading={firstPost.sub_heading}
                    initialSharesCount={firstPost.shares_count || 0}
                    token={token}
                  />
                  <TbTargetArrow className="w-6 h-6 cursor-pointer" />
                </div>

                {/* social icon end  */}
              </div>
              <motion.p
                dangerouslySetInnerHTML={{ __html: firstPost.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3 text-start"
                whileHover={{
                  scale: 1.05,
                  fontWeight: 900,
                  transition: { duration: 0.3 },
                }}
              />

              <p className="text-sm font-semibold uppercase text-[#424242] text-start">
                {firstPost.author} - {firstPost.date}
              </p>
              <p
                dangerouslySetInnerHTML={{ __html: firstPost.body1 }}
                className="text-sm font-normal text-[#424242] line-clamp-3 text-end"
              />
            </div>
            <div className="col-span-3 overflow-hidden">
              <Link
                href={`/${firstPost.cat_slug}/${firstPost.sub_slug}/${firstPost.slug}`}
                className="cursor-pointer"
              >
                <Image
                  src={getImageUrl(firstPost.image2?.[0] || "")}
                  alt={firstPost.heading || "Blog Image"}
                  width={1200}
                  height={800}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out bg-contain bg-no-repeat bg-center"
                />
              </Link>
            </div>
          </div>
        </div>
      )}

      {secondPost && (
        <div className="mb-8">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 lg:col-span-3 overflow-hidden">
              <Link
                href={`/${secondPost.cat_slug}/${secondPost.sub_slug}/${secondPost.slug}`}
              >
                <Image
                  src={getImageUrl(secondPost.image2?.[0] || "")}
                  alt={secondPost.heading || "Blog Image"}
                  width={1200}
                  height={800}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out bg-contain bg-no-repeat bg-center"
                />
              </Link>
            </div>
            <div className="col-span-5 lg:col-span-2 space-y-4">
              <Link
                href={`/${secondPost.cat_slug}/${secondPost.sub_slug}/${secondPost.slug}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: secondPost.heading }}
                  className="text-lg font-medium text-[#131313] "
                  whileHover={{
                    scale: 1.05,
                    fontWeight: 900,
                    transition: { duration: 0.3 },
                  }}
                />
              </Link>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blogs/${secondPost.cat_slug}`}
                    className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                  >
                    {secondPost.category_name || "Category"}
                  </Link>
                  <Link
                    href={`/${secondPost.cat_slug}/${secondPost.sub_slug}`}
                    className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                  >
                    {secondPost.sub_category_name || "Subcategory"}
                  </Link>
                </div>
                {/* social icon start */}
                <div className="flex items-center gap-5 relative mt-4 md:mt-0">
                  <PostLikeStatus postId={secondPost.id} />
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${secondPost.cat_slug}/${secondPost.sub_slug}/${secondPost.slug}#comment`}
                    >
                      <button className="cursor-pointer">
                        <FaRegCommentDots className="w-6 h-6 mt-1 cursor-pointer" />
                      </button>
                    </Link>
                    <p className="text-lg font-medium text-black dark:text-white leading-normal">
                      {secondPost?.comment_count || 0}
                    </p>
                  </div>
                  <SocialShareContent
                    postId={secondPost.slug}
                    categoryId={secondPost.cat_slug}
                    subcategoryId={secondPost.sub_slug}
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
                dangerouslySetInnerHTML={{ __html: secondPost.sub_heading }}
                className="text-sm font-normal text-[#424242] line-clamp-3"
              />
              <p className="text-sm font-semibold uppercase text-[#424242]">
                {secondPost.author} - {secondPost.date}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end py-4">
        <Link
          href={`/blogs/${firstPost?.cat_slug}`}
          className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white flex items-center gap-2"
        >
          EXPLORE MORE <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Ride;

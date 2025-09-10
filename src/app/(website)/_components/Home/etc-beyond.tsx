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

const EtcByeond: React.FC<ArtCultureProps> = ({ categoryName }) => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  // Get API call for home page
  const { data, isLoading, isError, error } = useQuery<HomeContentApiResponse>({
    queryKey: ["etc-beyond-section"],
    queryFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/${categoryName?.categoryName}`
      ).then((res) => res.json()),
  });

  const posts = data?.data || [];
  // Function to fetch like status for a specific post
  const fetchLikeStatus = async (postId: number): Promise<LikeApiResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content/${postId}/like-status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch like status for post ${postId}`);
    }
    return response.json();
  };

  // Component to render like status for a post
  const PostLikeStatus: React.FC<{ postId: number }> = ({ postId }) => {
    const { data: likeData, isLoading: isLikeLoading } =
      useQuery<LikeApiResponse>({
        queryKey: ["like", postId],
        queryFn: () => fetchLikeStatus(postId),
        enabled: !!postId,
      });

    return (
      <div className="flex items-center gap-2">
        <button onClick={() => handleLike(postId)}>
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

  if (isLoading) return <SkeletonLoader />;
  if (isError) {
    return (
      <div className="text-black text-lg font-medium">
        Error: {error.message || "Something went wrong"}
      </div>
    );
  }
  if (posts.length === 0)
    return <div className="error text-center py-8 ">No posts found</div>;

  const firstPost = posts[0];
  const thirdPost = posts[1];
  const fourthPost = posts[2];
  const fifthPost = posts[3];

  return (
    <div className="">
      {firstPost && (
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 ">
            <div className="bg-[#DDD618] aspect-[1.5/1] w-full flex items-center justify-center">
              <Link
                href={`/${firstPost.cat_slug}/${firstPost.sub_slug}/${firstPost.slug}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: firstPost.heading }}
                  className="text-xl md:text-xl lg:text-4xl text-center md:text-left font-bold text-[#131313] px-4"
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
                href={`/${firstPost.cat_slug}/${firstPost.sub_slug}/${firstPost.slug}`}
              >
                <Image
                  src={getImageUrl(firstPost.image2?.[0] || "")}
                  alt={firstPost.heading || "Blog Image"}
                  width={1000}
                  height={600}
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
                  href={`/blogs/${firstPost.cat_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white"
                >
                  {firstPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${firstPost.cat_slug}/${firstPost.sub_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white"
                >
                  {firstPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              {/* social icon start */}
              <div className="flex items-center gap-5 relative">
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
                  href={`/blogs/${thirdPost.cat_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {thirdPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {thirdPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="overflow-hidden">
                <Link
                  href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}/${thirdPost.slug}`}
                >
                  <Image
                    src={getImageUrl(thirdPost.image2?.[0] || "")}
                    alt={thirdPost.heading || "Blog Image"}
                    width={1000}
                    height={800}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    priority
                  />
                </Link>
              </div>

              <Link
                href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}/${thirdPost.slug}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: thirdPost.heading }}
                  className="text-2xl font-medium text-[#131313] mt-2"
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
              <div className="flex items-center gap-5 mt-2 relative">
                <PostLikeStatus postId={thirdPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}/${thirdPost.slug}#comment`}
                  >
                    <button className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 mt-1 cursor-pointer" />
                    </button>
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {thirdPost?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={thirdPost.slug}
                  categoryId={thirdPost.cat_slug}
                  subcategoryId={thirdPost.sub_slug}
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
          )}

          {fourthPost && (
            <div className="">
              <div className="flex items-center gap-2 pb-2">
                <Link
                  href={`/blogs/${fourthPost.cat_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {fourthPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {fourthPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="overflow-hidden">
                <Link
                  href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}/${fourthPost.slug}`}
                >
                  <Image
                    src={getImageUrl(fourthPost.image2?.[0] || "")}
                    alt={fourthPost.heading || "Blog Image"}
                    width={1000}
                    height={800}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    priority
                  />
                </Link>
              </div>

              <Link
                href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}/${fourthPost.slug}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: fourthPost.heading }}
                  className="text-2xl font-medium text-[#131313] mt-2"
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
              <div className="flex items-center gap-5 mt-2 relative">
                <PostLikeStatus postId={fourthPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}/${fourthPost.slug}#comment`}
                  >
                    <button className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 mt-1 cursor-pointer" />
                    </button>
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {fourthPost?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={fourthPost.slug}
                  categoryId={fourthPost.cat_slug}
                  subcategoryId={fourthPost.sub_slug}
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
          )}

          {fifthPost && (
            <div className="">
              <div className="flex items-center gap-2 pb-2">
                <Link
                  href={`/blogs/${fifthPost.cat_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {fifthPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${fifthPost.cat_slug}/${fifthPost.sub_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
                >
                  {fifthPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="overflow-hidden">
                <Link
                  href={`/${fifthPost.cat_slug}/${fifthPost.sub_slug}/${fifthPost.slug}`}
                >
                  <Image
                    src={getImageUrl(fifthPost.image2?.[0] || "")}
                    alt={fifthPost.heading || "Blog Image"}
                    width={1000}
                    height={800}
                    className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    priority
                  />
                </Link>
              </div>

              <Link
                href={`/${fifthPost.cat_slug}/${fifthPost.sub_slug}/${fifthPost.slug}`}
              >
                <motion.p
                  dangerouslySetInnerHTML={{ __html: fifthPost.heading }}
                  className="text-2xl font-medium text-[#131313] mt-2"
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
              <div className="flex items-center gap-5 mt-2 relative">
                <PostLikeStatus postId={fifthPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${fifthPost.cat_slug}/${fifthPost.sub_slug}/${fifthPost.slug}#comment`}
                  >
                    <button className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 mt-1 cursor-pointer" />
                    </button>
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {fifthPost?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={fifthPost.slug}
                  categoryId={fifthPost.cat_slug}
                  subcategoryId={fifthPost.sub_slug}
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
          )}
        </div>

        <div className="flex justify-end md:py-4 mt-[60px] md:mt-[100px]">
          <Link
            href={`/blogs/${firstPost?.cat_slug}`}
            className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-sm font-extrabold uppercase text-white flex items-center gap-2"
          >
            EXPLORE MORE <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EtcByeond;

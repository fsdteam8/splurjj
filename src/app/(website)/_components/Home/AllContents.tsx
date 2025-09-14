// components/AllContents.tsx
"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaRegCommentDots } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { AiFillLike } from "react-icons/ai";
import { TbTargetArrow } from "react-icons/tb";
import ImageCarousel from "./ImageCarousel";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HomeContentApiResponse } from "@/components/types/home-page-data-type";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SocialShareContent from "@/components/ui/SocialShareContent";
import { LikeApiResponse } from "@/components/types/like-get-data-type";

const AllContents: React.FC = () => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  // console.log("token", token);

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
  console.log(firstPost);

  return (
    <div className="">
      {firstPost && (
        <div className="mb-6 md:mb-12 lg:mb-16">
          <div>
            <div className="md:flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${firstPost.cat_slug}`}
                  className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {firstPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${firstPost?.cat_slug}/${firstPost?.sub_slug}`}
                  className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {firstPost.sub_category_name || "Subcategory"}
                </Link>
              </div>

              {/* social icon start */}
              <div className="flex items-center gap-5 relative mt-4 md:mt-0">
                {/* <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(firstPost?.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                    
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {firstPost?.likes_count || 0}
                  </p>
                </div> */}
                <PostLikeStatus postId={firstPost.id} />
                <div className="flex items-center gap-2 ">
                  <Link
                    href={`/${firstPost?.cat_slug}/${firstPost?.sub_slug}/${firstPost?.slug}#comment`}
                  >
                    <button type="button" className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 cursor-pointer" />
                    </button>
                  </Link>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {firstPost?.comment_count || 0}
                  </p>
                </div>
                <SocialShareContent
                  postId={firstPost?.slug}
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
            <div className="">
              <Link
                className="content-heding-text"
                href={`/${firstPost?.cat_slug}/${firstPost?.sub_slug}/${firstPost?.slug}`}
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
                href={`/blogs/${secondPost.cat_slug}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
              >
                {secondPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${secondPost.cat_slug}/${secondPost.sub_slug}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
              >
                {secondPost.sub_category_name || "Subcategory"}
              </Link>
            </div>
            <div className="overflow-hidden">
              <Link
                href={`/${secondPost.cat_slug}/${secondPost.sub_slug}/${secondPost.slug}`}
              >
                <Image
                  src={getImageUrl(secondPost.image2?.[0] || "")}
                  alt={secondPost.slug || "blog"}
                  width={900}
                  height={800}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                    loading="lazy"
                  // priority
                />
              </Link>
            </div>
            <div className="p-4">
              <Link
                href={`/${secondPost.cat_slug}/${secondPost.sub_slug}/${secondPost.slug}`}
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
              <div className="flex items-center gap-5 mt-2 relative">
                {/* <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(secondPost?.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {secondPost?.likes_count || 0}
                  </p>
                </div> */}
                <PostLikeStatus postId={secondPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${secondPost.cat_slug}/${secondPost.sub_slug}/${secondPost.slug}#comment`}
                  >
                    <button type="button" className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 " />
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
                href={`/blogs/${thirdPost.cat_slug}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
              >
                {thirdPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
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
                  alt={thirdPost.slug || "blog"}
                  width={400}
                  height={300}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="p-4">
              <Link
                href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}/${thirdPost.slug}`}
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
              <div className="flex items-center gap-5 mt-2 relative">
                {/* <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(thirdPost.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {thirdPost?.likes_count || 0}
                  </p>
                </div> */}
                <PostLikeStatus postId={thirdPost.id} />

                <div className="flex items-center gap-2">
                  <Link
                    href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}/${thirdPost.slug}#comment`}
                    className="cursor-pointer"
                  >
                    <button type="button" className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 " />
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
                href={`/blogs/${fourthPost.cat_slug}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
              >
                {fourthPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}`}
                className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-1 px-3 rounded text-sm font-extrabold uppercase text-white"
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
                  alt={fourthPost.slug || "blog"}
                  width={400}
                  height={300}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="p-4">
              <Link
                href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}/${fourthPost.slug}`}
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
              <div className="flex items-center gap-5 mt-2 relative">
                {/* <div className="flex items-center gap-2">
                  <button onClick={() => handleLike(fourthPost.id)}>
                    <SlLike className="w-6 h-6 cursor-pointer" />
                  </button>
                  <p className="text-lg font-medium text-black dark:text-white leading-normal">
                    {fourthPost?.likes_count || 0}
                  </p>
                </div> */}
                <PostLikeStatus postId={fourthPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}/${fourthPost.slug}#comment`}
                    className="cursor-pointer"
                  >
                    <button type="button" className="cursor-pointer">
                      <FaRegCommentDots className="w-6 h-6 " />
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



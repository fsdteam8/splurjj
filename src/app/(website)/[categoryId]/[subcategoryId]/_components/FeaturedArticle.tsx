import type React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaRegCommentDots,
} from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import FirstContentsSkeleton from "./FirstContentsSkeleton";
import CategorySubCategoryCarousel from "./categorySubCategoryCarousel";
import { motion } from "framer-motion";
import { SlLike } from "react-icons/sl";
import SocialShareContent from "@/components/ui/SocialShareContent";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AiFillLike } from "react-icons/ai";
import { LikeApiResponse } from "@/components/types/like-get-data-type";

interface Post {
  id: number;
  heading: string;
  sub_heading: string;
  author: string;
  date: string;
  body1: string;
  category_name: string;
  sub_category_name: string;
  category_id: number;
  subcategory_id: number;
  image1: string | null;
  image2?: string[] | null;
  imageLink: string | null;
  advertising_image: string | null;
  advertisingLink: string | null;
  status: string;
  tags: string[];
   cat_slug: string;
  sub_slug: string;
  slug: string;
  likes_count: number;
  shares_count: number;
  comment_count: number;
}

interface FirstContentsProps {
  posts: Post[];
  loading?: boolean;
}

const FirstContents: React.FC<FirstContentsProps> = ({
  posts,
  loading = false,
}) => {

  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

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


  if (loading) {
    return <FirstContentsSkeleton />;
  }

  const firstPost = posts[0];
  const secondPost = posts[1];
  const thirdPost = posts[2];
  const fourthPost = posts[3];
  const fifthPost = posts[4];
  console.log(firstPost, "firstPost");

  return (
    <div className="">
      {firstPost ? (
        <div className="mb-16">
          <div className="lg:flex items-center gap-4 mb-4 space-y-4 md:space-y-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/blogs/${firstPost.cat_slug}`}
                className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
              >
                {firstPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${firstPost.cat_slug}/${firstPost.sub_slug}`}
                className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
              >
                {firstPost.sub_category_name || "Subcategory"}
              </Link>
            </div>


            
            {/* social icon start */}
              <div className="flex items-center gap-5 relative">
                <PostLikeStatus postId={firstPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${firstPost?.cat_slug}/${firstPost?.sub_slug}/${firstPost?.slug}#comment`}
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
          <div className="space-y-4">
            <Link
              href={`/${firstPost.cat_slug}/${firstPost.sub_slug}/${firstPost.slug}`}
            >
              <motion.p
                dangerouslySetInnerHTML={{ __html: firstPost.heading }}
                className="text-3xl lg:text-5xl font-bold text-[#131313]"
                whileHover={{
                  scaleX: 1.05,
                  transformOrigin: "left", // Ensures scaling happens from the left side
                  fontWeight: 900,
                  transition: { duration: 0.3 },
                }}
              />
            </Link>
            <p
              dangerouslySetInnerHTML={{ __html: firstPost.sub_heading }}
              className="text-[16px] font-extralight font-helvetica text-[#424242] line-clamp-3"
            />
            <p className="text-base font-semibold uppercase text-[#424242]">
              {firstPost.author} - {firstPost.date}
            </p>
          </div>
          <div className="mt-8">
            <CategorySubCategoryCarousel
              posts={firstPost}
              getImageUrl={getImageUrl}
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No featured article available.
        </p>
      )}

      {secondPost && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="col-span-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/blogs/${secondPost.cat_slug}`}
                className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
              >
                {secondPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${secondPost.cat_slug}/${secondPost.sub_slug}`}
                className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
              >
                {secondPost.sub_category_name || "Subcategory"}
              </Link>
            </div>
            <Link
              href={`/${secondPost.cat_slug}/${secondPost.sub_slug}/${secondPost.slug}`}
            >
              <motion.p
                dangerouslySetInnerHTML={{ __html: secondPost.heading }}
                className="text-2xl font-medium"
                whileHover={{
                  scaleX: 1.05,
                  transformOrigin: "left", // Ensures scaling happens from the left side
                  fontWeight: 900,
                  transition: { duration: 0.3 },
                }}
              />
            </Link>
            <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
              {secondPost.author} - {secondPost.date}
            </p>
             {/* social icon start */}
              <div className="flex items-center gap-5 mt-2 relative">
              <PostLikeStatus postId={secondPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${secondPost?.cat_slug}/${secondPost?.sub_slug}/${secondPost?.slug}#comment`}
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
            <p
              dangerouslySetInnerHTML={{ __html: secondPost.sub_heading }}
              className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
            />
          </div>
          <div className="col-span-5 lg:col-span-3 overflow-hidden">
            <Link
              href={`/${secondPost.cat_slug}/${secondPost.sub_slug}/${secondPost.slug}`}
            >
              <Image
                src={getImageUrl(secondPost.image2?.[0] || "")}
                alt={secondPost.heading.replace(/<[^>]+>/g, "")}
                width={400}
                height={315}
                className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                priority
              />
            </Link>
          </div>
        </div>
      )}

      {thirdPost && (
        <div className="mb-8 overflow-hidden">
          <div className="overflow-hidden">
            <Link
              href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}/${thirdPost.slug}`}
            >
              <Image
                src={getImageUrl(thirdPost.image2?.[0] || "")}
                alt={thirdPost.heading.replace(/<[^>]+>/g, "")}
                width={400}
                height={443}
                className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                priority
              />
            </Link>
          </div>
          <div className="pt-4 pb-14 ">
            <div className="md:flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${thirdPost.cat_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {thirdPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {thirdPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <p className="text-sm font-semibold uppercase text-[#424242] mt-2">
                {thirdPost.author} - {thirdPost.date}
              </p>
            </div>
            <Link
              href={`/${thirdPost.cat_slug}/${thirdPost.sub_slug}/${thirdPost.slug}`}
            >
              <motion.p
                dangerouslySetInnerHTML={{ __html: thirdPost.heading }}
                className="text-2xl font-medium"
                whileHover={{
                  scaleX: 1.05,
                  transformOrigin: "left", // Ensures scaling happens from the left side
                  fontWeight: 900,
                  transition: { duration: 0.3 },
                }}
              />
            </Link>
             {/* social icon start */}
              <div className="flex items-center gap-5 relative mt-2">
                <PostLikeStatus postId={thirdPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${thirdPost?.cat_slug}/${thirdPost?.sub_slug}/${thirdPost?.slug}#comment`}
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
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {fourthPost && (
          <div className="space-y-2">
            <div className="md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${fourthPost.cat_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {fourthPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {fourthPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
             {/* social icon start */}
              <div className="flex items-center gap-5 relative mt-4 md:mt-0">
                <PostLikeStatus postId={fourthPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${fourthPost?.cat_slug}/${fourthPost?.sub_slug}/${fourthPost?.slug}#comment`}
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
            </div>
            <Link
              href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}/${fourthPost.slug}`}
            >
              <motion.p
                dangerouslySetInnerHTML={{ __html: fourthPost.heading }}
                className="text-2xl font-medium pt-2"
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
            <div className="overflow-hidden">
              <Link
                href={`/${fourthPost.cat_slug}/${fourthPost.sub_slug}/${fourthPost.slug}`}
                className="overflow-hidden"
              >
                <Image
                  src={getImageUrl(fourthPost.image2?.[0] || "")}
                  alt={fourthPost.heading.replace(/<[^>]+>/g, "")}
                  width={400}
                  height={300}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  priority
                />
              </Link>
            </div>
          </div>
        )}
        {fifthPost && (
          <div className="space-y-2">
            <div className="md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${fifthPost.cat_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {fifthPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${fifthPost.cat_slug}/${fifthPost.sub_slug}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {fifthPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
             {/* social icon start */}
              <div className="flex items-center gap-5 relative mt-4 md:mt-0">
               <PostLikeStatus postId={fifthPost.id} />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${fifthPost?.cat_slug}/${fifthPost?.sub_slug}/${fifthPost?.slug}#comment`}
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
            </div>
            <Link
              href={`/${fifthPost.cat_slug}/${fifthPost.sub_slug}/${fifthPost.slug}`}
            >
              <motion.p
                dangerouslySetInnerHTML={{ __html: fifthPost.heading }}
                className="text-2xl font-medium pt-2"
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
            <div className="overflow-hidden">
              <Link
                href={`/${fifthPost.cat_slug}/${fifthPost.sub_slug}/${fifthPost.slug}`}
                className="overflow-hidden"
              >
                <Image
                  src={getImageUrl(fifthPost.image2?.[0] || "")}
                  alt={fifthPost.heading.replace(/<[^>]+>/g, "")}
                  width={400}
                  height={300}
                  className="aspect-[1.5/1] w-full object-contain hover:scale-150 transition-all duration-500 ease-in-out"
                  priority
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstContents;

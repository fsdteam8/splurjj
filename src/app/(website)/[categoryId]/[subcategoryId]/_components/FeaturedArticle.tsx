import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiShareForwardLine } from "react-icons/ri";
import {
  FaFacebook,
  FaLinkedin,
  FaRegCommentDots,
  FaTwitter,
} from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import FirstContentsSkeleton from "./FirstContentsSkeleton";
import CategorySubCategoryCarousel from "./categorySubCategoryCarousel";
import { motion } from "framer-motion";

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
}

interface FirstContentsProps {
  posts: Post[];
  loading?: boolean;
}

const FirstContents: React.FC<FirstContentsProps> = ({
  posts,
  loading = false,
}) => {
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);

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

  const getShareUrl = (
    categoryName: string,
    subCategoryName: string,
    postId: number
  ): string => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const normalizedCategory = categoryName.toLowerCase().replace(/\s+/g, "-");
    const normalizedSubCategory = subCategoryName
      .toLowerCase()
      .replace(/\s+/g, "-");
    return `${baseUrl}/blogs/${normalizedCategory}/${normalizedSubCategory}/${postId}`;
  };

  const handleShare = async (post: Post) => {
    const shareUrl = getShareUrl(
      post.category_name,
      post.sub_category_name,
      post.id
    );
    const shareData = {
      title: post.heading.replace(/<[^>]+>/g, ""),
      text:
        post.sub_heading?.replace(/<[^>]+>/g, "") ||
        "Check out this blog post!",
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
      )}&text=${encodeURIComponent(text.replace(/<[^>]+>/g, ""))}`,
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
      )}&title=${encodeURIComponent(title.replace(/<[^>]+>/g, ""))}`,
      "_blank"
    );
  };

  if (loading) {
    return <FirstContentsSkeleton />;
  }

  const firstPost = posts[0];
  const secondPost = posts[1];
  const thirdPost = posts[2];
  const fourthPost = posts[3];
  const fifthPost = posts[4];

  return (
    <div className="">
      {firstPost ? (
        <div className="mb-16">
          <div className="lg:flex items-center gap-4 mb-4 space-y-4 md:space-y-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/blogs/${firstPost.category_name}`}
                className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
              >
                {firstPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${firstPost.category_id}/${firstPost.subcategory_id}`}
                className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
              >
                {firstPost.sub_category_name || "Subcategory"}
              </Link>
            </div>
            <div className="flex items-center gap-3 relative">
              <RiShareForwardLine
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleShare(firstPost)}
              />
              {showShareMenu === firstPost.id && (
                <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                  <FaTwitter
                    className="w-6 h-6 cursor-pointer text-blue-500"
                    onClick={() =>
                      shareToTwitter(
                        getShareUrl(
                          firstPost.category_name,
                          firstPost.sub_category_name,
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
                          firstPost.category_name,
                          firstPost.sub_category_name,
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
                          firstPost.category_name,
                          firstPost.sub_category_name,
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
          <div className="space-y-4">
            <Link
              href={`/${firstPost.category_id}/${firstPost.subcategory_id}/${firstPost.id}`}
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
                href={`/blogs/${secondPost.category_name}`}
                className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
              >
                {secondPost.category_name || "Category"}
              </Link>
              <Link
                href={`/${secondPost.category_id}/${secondPost.subcategory_id}`}
                className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
              >
                {secondPost.sub_category_name || "Subcategory"}
              </Link>
            </div>
            <Link
              href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}`}
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
            <div className="flex items-center gap-3 mt-2 relative">
              <RiShareForwardLine
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleShare(secondPost)}
              />
              {showShareMenu === secondPost.id && (
                <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                  <FaTwitter
                    className="w-6 h-6 cursor-pointer text-blue-500"
                    onClick={() =>
                      shareToTwitter(
                        getShareUrl(
                          secondPost.category_name,
                          secondPost.sub_category_name,
                          secondPost.id
                        ),
                        secondPost.heading.replace(/<[^>]+>/g, "")
                      )
                    }
                  />
                  <FaFacebook
                    className="w-6 h-6 cursor-pointer text-blue-700"
                    onClick={() =>
                      shareToFacebook(
                        getShareUrl(
                          secondPost.category_name,
                          secondPost.sub_category_name,
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
                          secondPost.category_name,
                          secondPost.sub_category_name,
                          secondPost.id
                        ),
                        secondPost.heading.replace(/<[^>]+>/g, "")
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
            <p
              dangerouslySetInnerHTML={{ __html: secondPost.sub_heading }}
              className="text-sm font-normal text-[#424242] line-clamp-3 mt-2"
            />
          </div>
          <div className="col-span-5 lg:col-span-3 overflow-hidden">
            <Link
              href={`/${secondPost.category_id}/${secondPost.subcategory_id}/${secondPost.id}`}
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
              href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
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
          <div className="py-4">
            <div className="md:flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blogs/${thirdPost.category_name}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {thirdPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}`}
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
              href={`/${thirdPost.category_id}/${thirdPost.subcategory_id}/${thirdPost.id}`}
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
            <div className="flex items-center gap-3 mt-2 relative">
              <RiShareForwardLine
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleShare(thirdPost)}
              />
              {showShareMenu === thirdPost.id && (
                <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                  <FaTwitter
                    className="w-6 h-6 cursor-pointer text-blue-500"
                    onClick={() =>
                      shareToTwitter(
                        getShareUrl(
                          thirdPost.category_name,
                          thirdPost.sub_category_name,
                          thirdPost.id
                        ),
                        thirdPost.heading.replace(/<[^>]+>/g, "")
                      )
                    }
                  />
                  <FaFacebook
                    className="w-6 h-6 cursor-pointer text-blue-700"
                    onClick={() =>
                      shareToFacebook(
                        getShareUrl(
                          thirdPost.category_name,
                          thirdPost.sub_category_name,
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
                          thirdPost.category_name,
                          thirdPost.sub_category_name,
                          thirdPost.id
                        ),
                        thirdPost.heading.replace(/<[^>]+>/g, "")
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
                  href={`/blogs/${fourthPost.category_name}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {fourthPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {fourthPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="flex items-center gap-3 relative mt-4 md:mt-0 lg:mt-4">
                <RiShareForwardLine
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleShare(fourthPost)}
                />
                {showShareMenu === fourthPost.id && (
                  <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                    <FaTwitter
                      className="w-6 h-6 cursor-pointer text-blue-500"
                      onClick={() =>
                        shareToTwitter(
                          getShareUrl(
                            fourthPost.category_name,
                            fourthPost.sub_category_name,
                            fourthPost.id
                          ),
                          fourthPost.heading.replace(/<[^>]+>/g, "")
                        )
                      }
                    />
                    <FaFacebook
                      className="w-6 h-6 cursor-pointer text-blue-700"
                      onClick={() =>
                        shareToFacebook(
                          getShareUrl(
                            fourthPost.category_name,
                            fourthPost.sub_category_name,
                            fourthPost.id
                          )
                        )
                      }
                    />
                    <FaLinkedin
                      className="w-6 h-6 cursor-pointer text-blue-600"
                      onClick={() =>
                        shareToLinkedIn(
                          getShareUrl(
                            fourthPost.category_name,
                            fourthPost.sub_category_name,
                            fourthPost.id
                          ),
                          fourthPost.heading.replace(/<[^>]+>/g, "")
                        )
                      }
                    />
                  </div>
                )}
                <TbTargetArrow className="w-6 h-6" />
                <Link
                  href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}#comment`}
                  className="cursor-pointer"
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
              </div>
            </div>
            <Link
              href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}`}
            >
              <motion.p
                dangerouslySetInnerHTML={{ __html: fourthPost.heading }}
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
              {fourthPost.author} - {fourthPost.date}
            </p>
            <div className="overflow-hidden">
              <Link
                href={`/${fourthPost.category_id}/${fourthPost.subcategory_id}/${fourthPost.id}`}
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
                  href={`/blogs/${fifthPost.category_name}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {fifthPost.category_name || "Category"}
                </Link>
                <Link
                  href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}`}
                  className="bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  {fifthPost.sub_category_name || "Subcategory"}
                </Link>
              </div>
              <div className="flex items-center gap-3 relative mt-4 md:mt-0 lg:mt-4">
                <RiShareForwardLine
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleShare(fifthPost)}
                />
                {showShareMenu === fifthPost.id && (
                  <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                    <FaTwitter
                      className="w-6 h-6 cursor-pointer text-blue-500"
                      onClick={() =>
                        shareToTwitter(
                          getShareUrl(
                            fifthPost.category_name,
                            fifthPost.sub_category_name,
                            fifthPost.id
                          ),
                          fifthPost.heading.replace(/<[^>]+>/g, "")
                        )
                      }
                    />
                    <FaFacebook
                      className="w-6 h-6 cursor-pointer text-blue-700"
                      onClick={() =>
                        shareToFacebook(
                          getShareUrl(
                            fifthPost.category_name,
                            fifthPost.sub_category_name,
                            fifthPost.id
                          )
                        )
                      }
                    />
                    <FaLinkedin
                      className="w-6 h-6 cursor-pointer text-blue-600"
                      onClick={() =>
                        shareToLinkedIn(
                          getShareUrl(
                            fifthPost.category_name,
                            fifthPost.sub_category_name,
                            fifthPost.id
                          ),
                          fifthPost.heading.replace(/<[^>]+>/g, "")
                        )
                      }
                    />
                  </div>
                )}
                <TbTargetArrow className="w-6 h-6" />
                <Link
                  href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}#comment`}
                  className="cursor-pointer"
                >
                  <FaRegCommentDots className="w-6 h-6" />
                </Link>
              </div>
            </div>
            <Link
              href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}`}
            >
              <motion.p
                dangerouslySetInnerHTML={{ __html: fifthPost.heading }}
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
              {fifthPost.author} - {fifthPost.date}
            </p>
            <div className="overflow-hidden">
              <Link
                href={`/${fifthPost.category_id}/${fifthPost.subcategory_id}/${fifthPost.id}`}
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

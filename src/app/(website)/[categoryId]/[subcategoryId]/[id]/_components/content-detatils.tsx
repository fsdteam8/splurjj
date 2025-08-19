"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { FiTwitter } from "react-icons/fi";
import { LuFacebook } from "react-icons/lu";
import { PiYoutubeLogoLight } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import Link from "next/link";
import CommentSection from "@/app/(website)/_components/LeaveAComment/LeaveAComment";
import { useSession } from "next-auth/react";
import Vertical from "@/components/adds/vertical";
import Horizontal from "@/components/adds/horizontal";
import RelatedContent from "@/app/(website)/_components/RalatedBlog/RalatedBlog";
import DOMPurify from "dompurify";
import ContentsDetailsCarousel from "./contentsDetailsCarousel";

interface BlogData {
  status: boolean;
  message: string;
  data: {
    id: number;
    category_id: number;
    subcategory_id: number;
    category_name: string;
    sub_category_name?: string;
    heading: string;
    author: string;
    date: string;
    sub_heading: string;
    body1: string;
    image1: string | null;
    advertising_image: string | null;
    tags: string[];
    created_at: string;
    updated_at: string;
    imageLink: string | null;
    advertisingLink: string | null;
    user_id: number;
    status: string;
    image1_url: string | null;
    advertising_image_url: string | null;
    user: {
      id: number;
      description: string | null;
      first_name: string | null;
      facebook_link: string | null;
      instagram_link: string | null;
      youtube_link: string | null;
      twitter_link: string | null;
      profilePic: string;
    };
  };
}

const ContentBlogDetails = ({
  categoryId,
  subcategoryId,
  id,
}: {
  categoryId: string;
  subcategoryId: string;
  id: string;
}) => {
  const { data: session } = useSession();
  const commentAccess = session?.user?.role;
  const userEmail = session?.user?.email;
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);

  // Generate share URL
  const getShareUrl = (
    categoryId: number,
    subcategoryId: number,
    id: number
  ): string => {
    return `${window.location.origin}/${categoryId}/${subcategoryId}/${id}`;
  };

  // Improved cleanTags function to handle malformed JSON strings
  const cleanTags = (tags: string[]): string[] => {
    if (!tags || !Array.isArray(tags)) return [];
    if (tags.length === 1 && tags[0].startsWith("[")) {
      try {
        const parsedTags = JSON.parse(tags[0].replace(/\\"/g, '"'));
        return Array.isArray(parsedTags) ? parsedTags : [];
      } catch {
        // Fallback to string cleaning
      }
    }
    return tags
      .map((tag) =>
        tag
          .replace(/^\[|\]$/g, "")
          .replace(/^"|"$/g, "")
          .replace(/\\"/g, "")
          .trim()
      )
      .filter((tag) => tag.length > 0);
  };

  const sanitizeHTML = (html: string): string => {
    const cleanedHtml = html
      .replace(/<pre>/gi, "")
      .replace(/<\/pre>/gi, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
    return DOMPurify.sanitize(cleanedHtml, {
      ADD_TAGS: ["iframe", "a"],
      ADD_ATTR: [
        "allow",
        "allowfullscreen",
        "frameborder",
        "src",
        "title",
        "referrerpolicy",
        "href",
        "target",
        "rel",
      ],
      FORBID_ATTR: ["srcdoc"], // Prevent srcdoc in iframes
      ALLOWED_URI_REGEXP: /^(?:(?:https?):\/\/)/, // Restrict to HTTPS
    });
  };

  const { data, isLoading, error, isError } = useQuery<BlogData>({
    queryKey: ["all-content", categoryId, subcategoryId, id],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${categoryId}/${subcategoryId}/${id}`
      ).then((res) => res.json()),
  });

  const blogData = data?.data || null;

  const getImageUrl = (path: string | null): string => {
    if (!path) return "/fallback-image.jpg";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.replace(/^\/+/, "")}`;
  };

  const handleShare = async (post: BlogData["data"]) => {
    const shareUrl = getShareUrl(
      post.category_id,
      post.subcategory_id,
      post.id
    );
    const shareData = {
      title: post.heading,
      text: post.sub_heading || "Check out this blog post!",
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
      )}&text=${encodeURIComponent(text)}`,
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
      )}&title=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div
      className="animate-pulse container py-[30px] md:py-[50px] lg:py-[72px]"
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="grid grid-cols-1 md:grid-cols-7 gap-[30px] md:gap-[50px] lg:gap-[72px]">
        {/* Left Column */}
        <div className="md:col-span-2 flex flex-col gap-[25px] md:gap-[32px] lg:gap-[40px]">
          <div>
            <div className="bg-gray-300 h-10 md:h-12 w-3/4 rounded"></div>
            <div className="space-y-2 mt-4">
              <div className="bg-gray-300 h-4 w-full rounded"></div>
              <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
              <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
            </div>
            <div className="bg-gray-300 h-4 w-1/2 rounded mt-4"></div>
            <div className="bg-gray-300 h-12 w-full rounded mt-3 md:mt-4"></div>
          </div>
          <div className="sticky top-[120px]">
            <div className="bg-gray-300 h-32 w-full rounded"></div>
          </div>
        </div>
        {/* Right Column */}
        <div className="md:col-span-5">
          <div>
            <div className="space-y-2">
              <div className="bg-gray-300 h-4 w-full rounded"></div>
              <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
              <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
            </div>
            <div className="pb-[25px] md:pb-[32px] lg:pb-[40px] mt-5 md:mt-7 lg:mt-8">
              <div className="bg-gray-300 w-full h-[443px] rounded-[8px] border border-gray-400"></div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-300 h-4 w-full rounded"></div>
              <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
              <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
              <div className="bg-gray-300 h-4 w-full rounded"></div>
              <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
            </div>
            <div className="w-full flex items-center justify-center mt-5 md:mt-7 lg:mt-8">
              <div className="bg-gray-300 w-2/3 h-[2px] rounded"></div>
            </div>
          </div>
          {/* Second Part */}
          <div className="mt-[25px] md:mt-[37px] lg:mt-[51px]">
            {/* Posted In */}
            <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-7 gap-2">
              <div className="md:col-span-2 bg-gray-300 h-5 w-24 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
              </div>
            </div>
            {/* Tags */}
            <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-7 gap-2 mt-4 md:mt-5 lg:mt-6">
              <div className="md:col-span-2 bg-gray-300 h-5 w-24 rounded"></div>
              <div className="md:col-span-5 flex flex-wrap items-center gap-3 md:gap-4">
                <div className="bg-gray-300 h-6 w-24 rounded"></div>
                <div className="bg-gray-300 h-6 w-24 rounded"></div>
                <div className="bg-gray-300 h-6 w-24 rounded"></div>
              </div>
            </div>
            {/* Author */}
            <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-7 mt-[25px] md:mt-[37px] lg:mt-[51px]">
              <div className="md:col-span-2">
                <div className="bg-gray-300 h-[180px] w-[180px] rounded-full"></div>
              </div>
              <div className="md:col-span-5 flex flex-col gap-4 mt-2 md:mt-0">
                <div className="bg-gray-300 h-5 w-1/3 rounded"></div>
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 w-full rounded"></div>
                  <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
                    <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
                    <div className="bg-gray-300 h-12 w-12 rounded-full"></div>
                  </div>
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </div>
              </div>
            </div>
            {/* Comments */}
            <div className="mt-10">
              <div className="bg-gray-300 h-16 w-full rounded"></div>
              <div className="mt-4 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
                    <div className="bg-gray-300 h-4 w-full rounded"></div>
                    <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Vertical Ad */}
      <div className="sticky mb-2">
        <div className="bg-gray-300 h-64 w-full rounded"></div>
      </div>
      {/* Related Content */}
      <section className="container py-[30px] md:py-[50px] lg:py-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-gray-300 h-[300px] w-full rounded-t-lg border border-gray-400"></div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
                <div className="bg-gray-300 h-6 w-20 rounded"></div>
              </div>
              <div className="bg-gray-300 h-8 w-3/4 rounded"></div>
              <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
              <div className="bg-gray-300 h-4 w-full rounded"></div>
              <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  if (isLoading) return <SkeletonLoader />;
  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="flex items-center justify-center bg-black h-screen">
        <div
          className="text-center p-10 rounded-lg w-[500px] h-[400px] flex flex-col items-center justify-end"
          style={{
            backgroundImage: `url(/assets/images/404.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Link
            href="/"
            className="mt-6 inline-block text-black underline bg-white p-2 rounded"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const cleanedTags = cleanTags(blogData.tags || []);

  return (
    <div>
      <div className="container py-[30px] md:py-[50px] lg:py-[72px]">
        {/* First part */}
        <div className="grid grid-cols-7 gap-[30px] md:gap-[50px] lg:gap-[72px]">
          <div className="col-span-7 md:col-span-3 lg:col-span-2 flex flex-col gap-[25px] md:gap-[32px] lg:gap-[40px]">
            <div>
              <h2
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(blogData.heading ?? ""),
                }}
                className="text-[24px] md:text-[32px] lg:text-[40px] font-semibold leading-[120%] text-[#131313] tracking-[0%]"
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(blogData.sub_heading ?? ""),
                }}
                className="text-base font-normal leading-[150%] tracking-[0%] text-[#424242] py-4 md:py-5 lg:py-6 line-clamp-3 mb-2"
              />
              <p className="text-base font-semibold leading-[120%] tracking-[0%] text-[#424242]">
                Credits - {blogData.date}
              </p>
              <div className="mt-3 md:mt-4">
                <button
                  onClick={() =>
                    document
                      ?.getElementById("comment")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                >
                  Leave A Comment
                </button>
              </div>
            </div>
            <div className="sticky top-[120px] mb-2">
              <Vertical />
            </div>
          </div>
          <div className="col-span-7 md:col-span-4 lg:col-span-5">
            <div>
              <p
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(blogData.sub_heading ?? ""),
                }}
                className="text-base font-normal leading-[150%] tracking-[0%] text-[#424242] pb-5 md:pb-7 lg:pb-8"
              />
              <div className="pb-[25px] md:pb-[32px] lg:pb-[40px]">
                <ContentsDetailsCarousel
                  posts={blogData}
                  getImageUrl={getImageUrl}
                />
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(blogData.body1 ?? ""),
                }}
                className="text-base font-normal leading-[150%] tracking-[0%] text-[#424242] pb-5 md:pb-7 lg:pb-8"
              />
              <div className="w-full flex items-center justify-center">
                <span className="w-2/3 h-[2px] bg-secondary" />
              </div>
            </div>
            <div className="flex items-center gap-3 relative mt-8">
              <span
                onClick={() => handleShare(blogData)}
                className="cursor-pointer"
              >
                <RiShareForwardLine className="w-6 h-6" />
              </span>
              {showShareMenu === blogData.id && (
                <div className="absolute top-8 right-0 bg-white shadow-md p-2 rounded flex gap-2 z-10">
                  <FaTwitter
                    className="w-6 h-6 cursor-pointer text-blue-500"
                    onClick={() =>
                      shareToTwitter(
                        getShareUrl(
                          blogData.category_id,
                          blogData.subcategory_id,
                          blogData.id
                        ),
                        blogData.heading
                      )
                    }
                  />
                  <FaFacebook
                    className="w-6 h-6 cursor-pointer text-blue-700"
                    onClick={() =>
                      shareToFacebook(
                        getShareUrl(
                          blogData.category_id,
                          blogData.subcategory_id,
                          blogData.id
                        )
                      )
                    }
                  />
                  <FaLinkedin
                    className="w-6 h-6 cursor-pointer text-blue-600"
                    onClick={() =>
                      shareToLinkedIn(
                        getShareUrl(
                          blogData.category_id,
                          blogData.subcategory_id,
                          blogData.id
                        ),
                        blogData.heading
                      )
                    }
                  />
                </div>
              )}
              <TbTargetArrow className="w-6 h-6" />
            </div>
            {/* Second part */}
            <div className="mt-[25px]">
              {/* Posted in */}
              <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-7 gap-2">
                <h4 className="md:col-span-2 text-lg md:text-xl text-secondary font-bold leading-[120%] tracking-[0%] uppercase">
                  Posted in
                </h4>
                <div className="md:col-span-5 w-full flex items-center gap-2">
                  <Link
                    href={`/blogs/${blogData.category_name}`}
                    className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                  >
                    {blogData?.category_name || ""}
                  </Link>
                  <Link
                    href={`/${blogData.category_id}/${blogData.subcategory_id}`}
                    className="bg-primary dark:bg-black hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white dark:text-white transition-all duration-200 ease-in-out py-2 px-4 rounded text-base font-extrabold uppercase text-white"
                  >
                    {blogData?.sub_category_name || ""}
                  </Link>
                </div>
              </div>

              {/* Tags */}
              {cleanedTags.length > 0 && (
                <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-7 gap-2 mt-4 md:mt-5 lg:mt-6">
                  <h4 className="md:col-span-2 text-lg md:text-xl text-secondary font-bold leading-[120%] tracking-[0%] uppercase">
                    Tags
                  </h4>
                  <div className="md:col-span-5 flex flex-col items-start gap-3 md:gap-4">
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                      {cleanedTags.map((tag, index) => (
                        <Link
                          href={`/${categoryId}/${subcategoryId}/${id}/${encodeURIComponent(
                            tag
                          )}`}
                          key={index}
                        >
                          <button className="bg-secondary hover:bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold leading-[120%] tracking-[0%] uppercase text-white">
                            {tag}
                          </button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Author */}
              <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-7 mt-[25px] md:mt-[37px] lg:mt-[51px]">
                <div className="md:col-span-7">
                  <Image
                    src={
                      blogData.user?.profilePic
                        ? getImageUrl(blogData.user.profilePic)
                        : "/assets/images/no-user.png"
                    }
                    alt={blogData.user?.first_name || "Author"}
                    width={120}
                    height={120}
                    className="w-[180px] h-[180px] object-cover rounded-full border"
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/images/no-user.png")
                    }
                  />
                </div>
                <div className="md:col-span-7 h-full flex flex-col justify-center mt-2 md:mt-0">
                  <h4 className="text-lg font-semibold leading-[120%] tracking-[0%] uppercase text-secondary dark:text-white text-center lg:text-left mt-4">
                    {blogData.user?.first_name || blogData.author}
                  </h4>
                  <p className="mt-4 text-base font-normal leading-[150%] tracking-[0%] text-secondary line-clamp-2">
                    {blogData.user?.description || "No description available."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="mt-4 flex items-center gap-2 md:mb-8">
                      {blogData.user?.instagram_link && (
                        <a
                          href={blogData.user.instagram_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram className="w-[48px] h-[48px] text-[#B6B6B6] hover:text-primary cursor-pointer" />
                        </a>
                      )}
                      {blogData.user?.facebook_link && (
                        <a
                          href={blogData.user.facebook_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LuFacebook className="w-[48px] h-[48px] text-[#B6B6B6] hover:text-primary cursor-pointer" />
                        </a>
                      )}
                      {blogData.user?.youtube_link && (
                        <a
                          href={blogData.user.youtube_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <PiYoutubeLogoLight className="w-[48px] h-[48px] text-[#B6B6B6] hover:text-primary cursor-pointer" />
                        </a>
                      )}
                      {blogData.user?.twitter_link && (
                        <a
                          href={blogData.user.twitter_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiTwitter className="w-[48px] h-[48px] text-[#B6B6B6] hover:text-primary cursor-pointer" />
                        </a>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/viewpost/${blogData.user?.id}`}
                        className="text-lg font-extrabold leading-[120%] tracking-[0%] text-secondary dark:text-white"
                      >
                        View posts
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Leave a comment */}
            <div>
              {!commentAccess && (
                <div id="comment" className="pt-[90px]">
                  <p className="font-base text-black font-normal leading-normal">
                    You must be{" "}
                    <Link href="/login" className="underline font-bold">
                      logged in
                    </Link>{" "}
                    to post
                  </p>
                </div>
              )}
              {commentAccess && (
                <div>
                  <section id="comment" className="py-5">
                    <CommentSection UserEmail={userEmail} blogId={Number(id)} />
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="sticky mb-2">
        <Horizontal />
      </div>
      {/* Related blogs */}
      <section>
        <RelatedContent categoryId={categoryId} subcategoryId={subcategoryId} />
      </section>
    </div>
  );
};

export default ContentBlogDetails;

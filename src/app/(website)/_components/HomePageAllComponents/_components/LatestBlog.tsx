"use client";
// import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
// import NotFound from "@/components/shared/NotFound/NotFound";
// import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
import { LatestBlogResponse } from "@/components/types/LatestedBlogDataType";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";

function LatestBlog() {
  const { data, isLoading, error, isError } = useQuery<LatestBlogResponse>({
    queryKey: ["latest-blog"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/landing-page/top-portion`
      ).then((res) => res.json()),
  });
if(isLoading){
    return (
        <div>loading....</div>
    )
}
else if(isError){
    return (
        <div>{error instanceof Error ? error.message : String(error)}</div>
    )
}
  console.log(data?.data?.latest);
  const content = data?.data?.latest;

  return (
    <div>
      <div className="px-5 md:px-0 py-[30px] md:py-[50px] lg:py-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-[30px] md:gap-[50px] lg:gap-[72px]">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-[1.5px]">
                <button className="bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold  leading-[120%] tracking-[0%] uppercase text-white">
                  Read
                </button>
                <button className="bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold  leading-[120%] tracking-[0%] uppercase text-white">
                  {/* {content?.[0]?.category_name} */}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Link href="#">
                  <RiShareForwardLine className="w-6 h-6 text-black" />
                </Link>
                <Link href="#">
                  <TbTargetArrow className="w-6 h-6 text-black" />
                </Link>
                <Link href="#">
                  <FaRegCommentDots className="w-6 h-6 text-black" />
                </Link>
              </div>
            </div>

            <Link href={`/${content?.id}`}>
              <h1
                dangerouslySetInnerHTML={{
                  __html: content?.heading ?? "",
                }}
                className="text-3xl md:text-[45px] lg:text-[60px]  font-extrabold leading-[120%] tracking-[0%] text-[#131313] cursor-pointer"
              />
            </Link>
            <p
              dangerouslySetInnerHTML={{
                __html: content?.sub_heading ?? "",
              }}
              className="text-base font-normal  leading-[150%] tracking-[0%] text-[#424242] my-4 md:my-5 lg:my-6"
            />

            <p className="text-base font-semibold  leading-[120%] tracking-[0%] uppercase text-[#424242]">
              Credits - {content?.date ?? ""}
            </p>
            <div className="mt-[30px] md:mt-[50px] lg:mt-[72px]">
              <Image
                src={content?.image1 || content?.imageLink || ""}
                alt="blog1"
                width={888}
                height={552}
                className="w-full h-[529px] object-cover object-contain rounded-[8px]"
              />
            </div>
            <p
              dangerouslySetInnerHTML={{ __html: content?.body1 ?? "" }}
              className="text-base font-normal  leading-normal tracking-[0%] text-[#424242] my-4 md:my-5 lg:my-6"
            />
          </div>
          <div className="md:col-span-2">
            <aside className="sticky top-0 h-[700px]">
              <div>
                <Image
                  // src="/assets/videos/blogSide1.jpg"
                  src={
                    content?.advertising_image || content?.advertisingLink || ""
                  }
                  alt="blogSide1"
                  width={336}
                  height={700}
                  className="w-full h-[700px] object-cover object-contain rounded-[8px]"
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestBlog;

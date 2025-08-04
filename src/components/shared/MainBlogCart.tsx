"use client";
import Image from "next/image";
import React from "react";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { FaRegCommentDots } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type BlogType = {
  id: number;
  heading: string;
  subHeading: string;
  image: string;
  date: string;
  firstAd: string;
  secondAd: string;
  tags: string[];
  body: string;
};

const MainBlogCart = ({ blog }: { blog: BlogType }) => {
  const pathName = usePathname();
  // console.log("pathName", pathName)
const newPathName =
  pathName === "/art-and-culture" ? "ART & CULTURE" : `${pathName}`;


    // console.log("newPathName", newPathName);

  return (
    <div>
      <div className="container py-[30px] md:py-[50px] lg:py-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-[30px] md:gap-[50px] lg:gap-[72px]">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-[1.5px]">
                <button className="bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold  leading-[120%] tracking-[0%] uppercase text-white">
                  Read
                </button>
                <button className="bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold  leading-[120%] tracking-[0%] uppercase text-white">
                  {newPathName}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  <RiShareForwardLine className="w-6 h-6 text-black" />
                </span>
                <span>
                  <TbTargetArrow className="w-6 h-6 text-black" />
                </span>
                <span>
                  <FaRegCommentDots className="w-6 h-6 text-black" />
                </span>
              </div>
            </div>
            <Link href={`/music/${slugify(blog?.heading || "")}`}>
              <h1 className="text-3xl md:text-[45px] lg:text-[60px]  font-bold leading-[120%] tracking-[0%] text-[#131313]">
                {blog?.heading}
              </h1>
            </Link>
            <p className="text-base font-normal  leading-[150%] tracking-[0%] text-[#424242] my-4 md:my-5 lg:my-6">
              {blog?.subHeading}
            </p>

            <p className="text-base font-semibold  leading-[120%] tracking-[0%] uppercase text-[#424242]">
              Credits - {blog?.date}
            </p>
            <div className="mt-[30px] md:mt-[50px] lg:mt-[72px]">
              <Image
                src={blog?.image}
                alt="blog1"
                width={888}
                height={552}
                className="w-full h-[529px] object-cover rounded-[8px]"
              />
            </div>
            <p className="text-base font-normal  leading-[150%] tracking-[0%] text-[#424242] my-4 md:my-5 lg:my-6">
              {blog?.body?.slice(0, 500)}
            </p>
          </div>
          <div className="md:col-span-2 flex flex-col gap-[30px] md:gap-[50px] lg:gap-[72px]">
            <div>
              <Image
                src={blog?.firstAd}
                alt="blogSide1"
                width={336}
                height={529}
                className="w-full h-[500px] object-cover rounded-[8px]"
              />
            </div>
            <div>
              <Image
                src={blog?.secondAd}
                alt="blogSide1"
                width={336}
                height={353}
                className="w-full h-[353px] object-cover rounded-[8px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBlogCart;

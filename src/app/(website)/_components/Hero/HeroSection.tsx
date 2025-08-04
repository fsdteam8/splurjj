import { ContentDataTypeResponse } from "@/components/types/ContentDataType";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";

function HeroSection({
  subcategoryId,
  categoryId,
  content,
}: {
  subcategoryId: string;
  categoryId: string;
  content?: ContentDataTypeResponse[];
}) {
  console.log(content);
  return (
    <div className="px-5 md:px-0 py-[30px] md:py-[50px] lg:py-[72px]">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-[30px] md:gap-[50px] lg:gap-[72px]">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-[1.5px]">
              <button className="bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold  leading-[120%] tracking-[0%] uppercase text-white">
                Read
              </button>
              <button className="bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold  leading-[120%] tracking-[0%] uppercase text-white">
                {content?.[0]?.category_name}
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

          <Link href={`/${categoryId}/${subcategoryId}/${content?.[0]?.id}`}>
            <h1
              dangerouslySetInnerHTML={{ __html: content?.[0]?.heading ?? "" }}
              className="text-3xl md:text-[45px] lg:text-[60px]  font-extrabold leading-[120%] tracking-[0%] text-[#131313] cursor-pointer"
            />
          </Link>
          <p
            dangerouslySetInnerHTML={{ __html: content?.[0]?.sub_heading ?? "" }}
            className="text-base font-normal  leading-[150%] tracking-[0%] text-[#424242] my-4 md:my-5 lg:my-6"
          />

          <p className="text-base font-semibold  leading-[120%] tracking-[0%] uppercase text-[#424242]">
            Credits - {content?.[0]?.date ?? ""}
          </p>
          <div className="mt-[30px] md:mt-[50px] lg:mt-[72px]">
            <Image
              src={content?.[0]?.image1 || content?.[0]?.imageLink || ""}
              alt="blog1"
              width={888}
              height={552}
              className="w-full h-[529px] object-cover rounded-[8px]"
            />
          </div>
          <p
            dangerouslySetInnerHTML={{ __html: content?.[0]?.body1 ?? "" }}
            className="text-base font-normal  leading-normal tracking-[0%] text-[#424242] my-4 md:my-5 lg:my-6"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

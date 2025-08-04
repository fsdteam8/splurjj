import { ContentDataTypeResponse } from "@/components/types/ContentDataType";
import React from "react";
import Image from "next/image";
import { FaRegCommentDots } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";



const FirstContent = ({
  subcategoryId,
  categoryId,
  content,
}: {
  subcategoryId: string;
  categoryId: string;
  content?: ContentDataTypeResponse[];
}) => {
  console.log("dfdfd", subcategoryId, categoryId, content);
  return (
    <div>
      <div className="container py-[30px] md:py-[50px] lg:py-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-[25px] md:gap-[35px] lg:gap-[44px]">
          <div className="md:col-span-5 h-full flex flex-col  justify-center">
            <div className="w-full flex flex-col md:flex-row gap-5 md:gap-6">
              <div className="w-full md:w-3/7">
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

                <h1 dangerouslySetInnerHTML={{ __html: content?.[0]?.heading ?? '' }} className="text-2xl md:text-[28px] lg:text-[32px]  font-bold leading-[120%] tracking-[0%] text-[#131313]"/>
                <p dangerouslySetInnerHTML={{ __html: content?.[0]?.sub_heading?.slice(0, 100) ?? '' }} className="text-base font-normal  leading-[150%] tracking-[0%] uppercase text-[#424242] my-4"/>
                <p dangerouslySetInnerHTML={{ __html: content?.[0]?.body1?.slice(0, 250) ?? '' }} className="text-base font-normal  leading-[150%] tracking-[0%] uppercase text-[#424242] "/>
              </div>
              <div className="w-full md:w-4/7">
                <Image
                  src={content?.[0]?.image1 || content?.[0]?.imageLink || ""}
                  alt="blog1"
                  width={444}
                  height={315}
                  className="w-full h-[310px] object-cover rounded-[8px]"
                />
              </div>
            </div>

            <div className="mt-4">
              <Image
                src={content?.[1]?.image1 || content?.[1]?.imageLink || ""}
                alt="blog1"
                width={794}
                height={443}
                className="w-full h-[443px] object-cover rounded-[8px]"
              />
            </div>
            <p className="text-base font-semibold  leading-[120%] tracking-[0%] uppercase text-[#424242] text-right mt-2">
              Credits - {content?.[3]?.date ?? ''}
            </p>

            <div className="flex items-center gap-4 mb-2 mt-4">
              <div className="flex items-center gap-[1.5px]">
                <button className="bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold  leading-[120%] tracking-[0%] uppercase text-white">
                  Read
                </button>
                <button className="bg-primary py-[6px] px-[12px] rounded-[4px] text-base font-extrabold  leading-[120%] tracking-[0%] uppercase text-white">
                 {content?.[0]?.category_name}
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

            <h1 dangerouslySetInnerHTML={{ __html: content?.[1]?.heading ?? '' }} className="text-2xl md:text-[28px] lg:text-[32px]  font-bold leading-[120%] tracking-[0%] text-[#131313]"/>
            <p dangerouslySetInnerHTML={{ __html: content?.[0]?.sub_heading?.slice(0, 400) ?? '' }} className="text-base font-normal  leading-[150%] tracking-[0%] uppercase text-[#424242] mt-4"/>
          </div>
          <div className="md:col-span-3">
            {/* first part  */}
            <div>
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

              <h1 dangerouslySetInnerHTML={{ __html: content?.[2]?.heading ?? '' }} className="text-2xl md:text-[28px] lg:text-[32px]  font-bold leading-[120%] tracking-[0%] text-[#131313]"/>
              <p className="text-base font-semibold  leading-[120%] tracking-[0%] uppercase text-[#424242] mt-4 md:mt-5 lg:mt-6">
                Credits - {content?.[3]?.date ?? ''}
              </p>
              <div className="mt-4 md:mt-5 lg:mt-6">
                <Image
                  src={content?.[2]?.image1 || content?.[2]?.imageLink || ""}
                  alt="blog1"
                  width={458}
                  height={346}
                  className="w-full h-[346px] object-cover rounded-[8px]"
                />
              </div>
            </div>
            {/* second part  */}
            <div className="pt-4">
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

              <h1 dangerouslySetInnerHTML={{ __html: content?.[3]?.heading ?? '' }} className="text-2xl md:text-[28px] lg:text-[32px]  font-bold leading-[120%] tracking-[0%] text-[#131313]"/>
              <p className="text-base font-semibold  leading-[120%] tracking-[0%] uppercase text-[#424242] mt-4 md:mt-5 lg:mt-6">
                Credits - {content?.[3]?.date ?? ''}
              </p>
              <div className="mt-4 md:mt-5 lg:mt-6">
                <Image
                  src={content?.[3]?.image1 || content?.[3]?.imageLink || ""}
                  alt="blog1"
                  width={458}
                  height={346}
                  className="w-full h-[346px] object-cover rounded-[8px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstContent;

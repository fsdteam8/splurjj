"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type ContentResponse = {
  status: boolean;
  message: string;
  data: ContentItem;
};

type ContentItem = {
  id: number;
  category_id: number;
  subcategory_id: number;
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
  image2: string[];
  image2_url: string[];
  image1_url: string | null;
  advertising_image_url: string | null;
  category: {
    id: number;
    category_name: string;
    created_at: string;
    updated_at: string;
    category_icon: string;
  };
  subcategory: {
    id: number;
    category_id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
};

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import "swiper/css/virtual";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const breakpoints = {
  0: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  1024: {
    slidesPerView: 1,
    spaceBetween: 30,
  },
  1440: {
    slidesPerView: 1,
    spaceBetween: 30,
  },
};

const RecentArticleViewDetails = ({ params }: { params: { slug: string } }) => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const { data, isLoading, error } = useQuery<ContentResponse>({
    queryKey: ["recent-article-view", params.slug],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/dashboard-content/${params?.slug}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json()),
  });

  console.log(data);
  console.log(data?.data?.image2);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching article details</div>;

  return (
    <div className="pb-20">
      <div>
        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{
            delay: 3000,
            pauseOnMouseEnter: false,
            disableOnInteraction: false,
            stopOnLastSlide: false,
          }}
          speed={3000}
          allowTouchMove={true}
          breakpoints={breakpoints}
          spaceBetween={12}
        >
          {/* {JSON.parse(data?.data?.image2 || "[]")?.map(
            (item: string, index: number) => (
              <SwiperSlide key={index} className="!h-auto !md:h-full">
                <div className="relative w-full !h-full">
                  <Image
                    src={item}
                    alt={`image-${index}`}
                    width={300}
                    height={150}
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </SwiperSlide>
            )
          )} */}
          {Array.isArray(data?.data?.image2)
            ? data.data.image2.map((item: string, index: number) => (
                <SwiperSlide key={index} className="!h-auto !md:h-full">
                  <div className="relative w-full !h-full">
                    <Image
                      src={item}
                      alt={`image-${index}`}
                      width={300}
                      height={150}
                      className="w-full h-[500px] object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))
            : typeof data?.data?.image2 === "string"
            ? JSON.parse(data.data.image2)?.map(
                (item: string, index: number) => (
                  <SwiperSlide key={index} className="!h-auto !md:h-full">
                    <div className="relative w-full !h-full">
                      <Image
                        src={item}
                        alt={`image-${index}`}
                        width={300}
                        height={150}
                        className="w-full h-[500px] object-contain"
                      />
                    </div>
                  </SwiperSlide>
                )
              )
            : null}
        </Swiper>
      </div>
      <h1
        className="text-4xl font-semibold text-black mt-2 mb-1 leading-normal line-clamp-1"
        dangerouslySetInnerHTML={{
          __html: data?.data?.heading ?? "",
        }}
      />
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-semibold text-black leading-normal">
          Author :
        </h3>
        <p className="text-xl font-medium text-black leading-normal">
          {data?.data?.author}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-semibold text-black leading-normal">
          Date :
        </h3>
        <p className="text-xl font-medium text-black leading-normal">
          {data?.data?.date}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-semibold text-black leading-normal">
          Tags :
        </h3>
        <p className="text-xl font-medium text-black leading-normal">
          {data?.data?.tags?.map((item, index) => (
            <button
              key={index}
              className="bg-[#0253F7] hover:bg-black/80 dark:bg-[#0253F7] dark:border dark:border-[#0253F7] hover:dark:bg-black/80 text-white px-6 py-[2px] rounded-md mr-4"
            >
              {item}
            </button>
          ))}
        </p>
      </div>
      <h5
        className="text-[22px] font-medium text-black my-2 leading-normal line-clamp-2"
        dangerouslySetInnerHTML={{
          __html: data?.data?.sub_heading ?? "",
        }}
      />
      <p
        className="text-base font-normal text-black my-2 leading-normal text-justify"
        dangerouslySetInnerHTML={{
          __html: data?.data?.body1 ?? "",
        }}
      />
    </div>
  );
};

export default RecentArticleViewDetails;

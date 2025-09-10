"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

type AdvertisingSettingResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    slug: string;
    link: string | null;
    code: string | null;
    image: string | null;
    image_url: string | null;
    image_path: string | null;
    created_at: string; // ISO datetime string
    updated_at: string; // ISO datetime string
  };
};

function Vertical() {
  const { data, isError, isLoading, error } =
    useQuery<AdvertisingSettingResponse>({
      queryKey: ["vertical-ads"],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/advertising/vertical`
        ).then((res) => res.json()),
    });
  const adData = data?.data;
  // console.log("ads data", data?.data)

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="animate-pulse w-full h-[300px]">
      <div className="bg-gray-300 w-full h-[300px] rounded-lg"></div>
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

  // console.log("ads console", adData?.code);

  return (
    <div className="">
      {adData?.code ? (
        <div
          dangerouslySetInnerHTML={{ __html: adData.code }}
          className="vertical-adds h-[400px] md:h-[500px] lg:h-[600px]"
        />
      ) : adData?.image && adData?.link ? (
        <a
          href={adData.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[2600px] h-[400px] md:h-[500px] lg:h-[600px] "
        >
          <Image
            src={adData.image}
            alt="Advertisement"
            width={2600}
            height={1000}
            style={{ maxWidth: "100%" }}
            className="w-full h-[400px] md:h-[500px] lg:h-[600px] "
          />
        </a>
      ) : (
        <div>No advertisement available</div>
      )}
    </div>
  );
}

export default Vertical;

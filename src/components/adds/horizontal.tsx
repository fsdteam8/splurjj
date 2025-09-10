"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export interface AdvertisingHorizontalApiResponse {
  success: boolean;
  message: string;
  data: AdvertisingData;
}

export interface AdvertisingData {
  id: number;
  slug: string;
  link: string | null;
  image: string | null;
  code: string | null;
  image_path: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

function Horizontal() {
  const { data, isError, isLoading, error } =
    useQuery<AdvertisingHorizontalApiResponse>({
      queryKey: ["horizontal-ads"],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/advertising/horizontal`
        ).then((res) => res.json()),
    });
  const adData = data?.data;
  // console.log("ads data", data?.data)

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="bg-gray-300 w-[400px] h-[300px] rounded-lg"></div>
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

  return (
    <div className="w-full h-full">
      {adData?.code ? (
        <div
          dangerouslySetInnerHTML={{ __html: adData.code }}
          className="w-full h-[300px] object-cover"
        />
      ) : adData?.image && adData?.link ? (
        <a
          href={adData.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-[300px]"
        >
          <Image
            src={adData.image}
            alt="Advertisement"
            className="w-full h-[300px]"
            width={2600}
            height={600}
          />
        </a>
      ) : (
        <div>No advertisement available</div>
      )}
    </div>
  );
}

export default Horizontal;

"use client";

import Image from "next/image";
// import Link from "next/link";
// import Image from 'next/image';
import React, { useEffect, useState } from "react";
// import { toast } from 'react-toastify';

type AdData = {
  code?: string;
  image?: string;
  link?: string;
};

function Horizontal() {
  const [adData, setAdData] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/advertising/horizontal`
        );
        const result = await response.json();
        if (result.success) {
          setAdData(result.data);
        } else {
          setError("Failed to fetch advertising data");
        }
      } catch (error) {
        // toast.error(error instanceof Error ? error.message : 'Error fetching data');
        console.error("Error fetching ad data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdData();
  }, []);

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="bg-gray-300 w-[400px] h-[300px] rounded-lg"></div>
    </div>
  );

  if (loading) return <SkeletonLoader />;
  if (error) return <div>{error}</div>;

  return (
    // <div className="w-full h-full ">
    //   {adData?.code ? (
    //     <div
    //       dangerouslySetInnerHTML={{ __html: adData.code }}
    //       className="w-full h-[300px] object-cover"
    //     />
    //   ) : adData?.image && adData?.link ? (
    //     <Link
    //       href={adData.link}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="w-full h-[300px]"
    //     >
    //       <Image
    //         src={adData.image}
    //         alt="Advertisement"
    //         className="w-full h-[60px] md:h-[90px] object-cover"
    //         width={2600}
    //         height={300}
    //       />
    //     </Link>
    //   ) : (
    //     <div>No advertisement available</div>
    //   )}
    // </div>

    <div className="w-full h-full ">
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

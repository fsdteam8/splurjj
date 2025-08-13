"use client";

import Image from "next/image";
// import Link from "next/link";
// import Image from 'next/image';
import React, { useEffect, useState } from "react";

type AdData = {
  code?: string;
  image?: string;
  link?: string;
};

function Vertical() {
  const [adData, setAdData] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/advertising/vertical`
        );
        const result = await response.json();
        if (result.success) {
          setAdData(result.data);
        } else {
          setError("Failed to fetch advertising data");
        }
      } catch (error) {
        // toast.error(error instanceof Error ? error.message : 'Error fetching data');
        console.log("Error fetching ad data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdData();
  }, []);

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="animate-pulse w-full h-[300px]">
      <div className="bg-gray-300 w-full h-[300px] rounded-lg"></div>
    </div>
  );

  if (loading) return <SkeletonLoader />;
  if (error) return <div>{error}</div>;

  console.log("ads console", adData?.code);

  return (
    // <div className="border-2 border-red-500">
    //   {adData?.code ? (
    //     <div dangerouslySetInnerHTML={{ __html: adData.code }} className="vertical-adds w-[200px] md:w-[160px] lg:w-[300px] h-[200px] md:h-[600px] lg:h-[600px] " />
    //   ) : adData?.image && adData?.link ? (
    //     <Link href={adData.link} target="_blank" rel="noopener noreferrer" className='w-[200px] md:w-[160px] lg:w-[300px] h-[200px] md:h-[600px] lg:h-[600px] '>
    //       <Image
    //         src={adData.image}
    //         alt="Advertisement"
    //         width={2600}
    //         height={600}
    //         style={{ maxWidth: '100%' }}
    //         className="w-[200px] md:w-[160px] lg:w-[300px] h-[200px] md:h-[600px] lg:h-[600px] " />
    //     </Link>
    //   ) : (
    //     <div>No advertisement available</div>
    //   )}
    // </div>
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

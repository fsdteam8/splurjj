"use client";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";
// import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import SplurjjDropDownSelector from "@/components/ui/SplurjjDropDownSelector";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import ContentStatusDropDown from "../content/_components/ContentStatusDropDown";
import { DashboardOverviewResponse } from "@/components/types/DashboardOverviewDataType";
import Link from "next/link";

const numberList = [
  { id: 1, name: "5", value: 5 },
  { id: 2, name: "10", value: 10 },
  { id: 3, name: "20", value: 20 },
];

const RecentArticles = () => {
  const [selectedNumber, setSelectedNumber] = useState<
    string | number | undefined
  >(10);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;

   // cdn url link start

  function convertToCDNUrl(image2?: string): string {
    const image2BaseUrl = "https://s3.amazonaws.com/splurjjimages/images";
    const cdnBaseUrl = "https://dsfua14fu9fn0.cloudfront.net/images";

    if (typeof image2 === "string" && image2.startsWith(image2BaseUrl)) {
      return image2.replace(image2BaseUrl, cdnBaseUrl);
    }

    return image2 || "";
  }

  function getImageUrl(image2?: string) {
    if (!image2) return "";

    try {
      const parsed = JSON.parse(image2);
      if (parsed?.image2) {
        return convertToCDNUrl(parsed.image2);
      }
    } catch {
      return convertToCDNUrl(image2);
    }

    return "";
  }

  // cdn url link end 

  const { data, isLoading, isError, error } =
    useQuery<DashboardOverviewResponse>({
      queryKey: ["dashboard-recent-articles", selectedNumber],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard-overview?per_page=${selectedNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json()),
    });

  // console.log(data?.data?.recent_content?.data);

  //   const imageUrl = JSON.parse(data?.data?.recent_content?.data?.image2 || "{}") || "";

  // const cdnUrl = convertToCDNUrl(imageUrl.image2);
  // console.log({cdnUrl})
  if (isLoading) {
    return (
      <div>
        <TableSkeletonWrapper
          count={6}
          width="100%"
          height="70px"
          className="bg-white border rounded-[8px]"
        />
      </div>
    );
  }

  if (isError) {
    return <div>{error?.message || "Somethings went wrong"}</div>;
  }
  return (
    <div className="bg-white dark:bg-[#1C1C1C] rounded-lg p-6 shadow-sm">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-light text-gray-900 dark:text-white mb-6">
          Recent Articles
        </h2>
        <div>
          <SplurjjDropDownSelector
            list={numberList}
            selectedValue={selectedNumber}
            onValueChange={setSelectedNumber}
            placeholderText="Select a number"
          />
        </div>
      </div>
      <div>
        <ScrollArea className="h-[420px] w-full">
          <table className="w-full">
            <tbody className="">
              {data?.data?.recent_content?.data?.map((content) => {
                const cdnUrl = getImageUrl(content?.image2?.[0]);

                return (
                  <tr
                    key={content?.id}
                    className="w-full flex items-center justify-between pb-4 "
                  >
                    <td className="flex items-center gap-4">
                      <div className="w-[120px] h-full">
                        <Image
                          src={cdnUrl ? cdnUrl : "/assets/images/no-images.jpg"}
                          // src={
                          //   content?.image2
                          //     ? content.image2[0]
                          //     : "/assets/images/no-images.jpg"
                          // }
                          alt={content?.heading}
                          width={120}
                          height={60}
                          className="w-[120px] h-[60px] rounded-[8px] object-cover"
                        />
                      </div>
                      <Link className="" href={`/dashboard/${content?.id}`}>
                        <p
                          className="text-black dark:text-white"
                          dangerouslySetInnerHTML={{
                            __html: content?.heading.slice(0, 50),
                          }}
                        />
                      </Link>
                    </td>

                    <td>
                      <ContentStatusDropDown
                        contentId={content?.id}
                        initialStatus={
                          content?.status as
                            | "Draft"
                            | "Review"
                            | "Approved"
                            | "Published"
                            | "Archived"
                            | "Needs Revision"
                            | "Rejected"
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecentArticles;

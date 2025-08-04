"use client";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import { DashboardOverviewResponse } from "@/components/types/DashboardOverviewDataType";
import { DashboardCardSkeleton } from "@/components/ui/DashboardCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoDotFill } from "react-icons/go";

const DashboardOverviewContainer = () => {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;

  const userRole = session?.data?.user?.role;

  const isAuthor = userRole === "author";

  const { data, isLoading, isError, error } =
    useQuery<DashboardOverviewResponse>({
      queryKey: ["dashboard-overview"],
      queryFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard-overview`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json()),
    });

  if (isLoading) {
    return (
      <div>
        <DashboardCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <ErrorContainer message={error?.message || "Something went Wrong"} />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-[#131313] dark:white-text leading-[120%] tracking-[0%] ">
            Dashboard Overview
          </p>
          <p className="text-base font-medium text-[#929292] leading-[120%] tracking-[0%]  pt-[14px]">
            Dashboard
          </p>
        </div>
        <div>
          <Link href="/dashboard/add-new-post">
            <button className="text-white bg-[#0253F7] py-1 px-4 rounded-lg text-lg font-medium leading-normal ">
              Add New Post
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        {/* first div  */}
        {!isAuthor && (
          <div className="flex items-center justify-between bg-white rounded-[6px] shadow-md p-8">
            <div>
              <h3 className="text-xl font-bold text-[#131313] dark:text-black leading-[120%] tracking-[0%]">
                Total Revenue
              </h3>
              <p className="flex items-center gap-1 text-lg font-medium text-[#424242] dark:text-black leading-[120%] tracking-[0%] pt-2">
                <GoDotFill className="text-[#DDE067] w-5 h-5" /> 00000
              </p>
            </div>
            <div>
              <Image
                src="/assets/dashboard/revenue.png"
                alt="revenue icon"
                width={48}
                height={48}
              />
            </div>
          </div>
        )}

        {/* second div  */}
        <div className="flex items-center justify-between bg-white rounded-[6px] shadow-md p-8">
          <div>
            <h3 className="text-xl font-bold text-[#131313] dark:text-black leading-[120%] tracking-[0%]">
              Total Articles
            </h3>
            <p className="flex items-center gap-1 text-lg font-medium text-[#424242] dark:text-black leading-[120%] tracking-[0%] pt-2">
              <GoDotFill className="text-[#008000] w-5 h-5" />
              {data?.data?.total_content || 0}
            </p>
          </div>
          <div>
            <Image
              src="/assets/dashboard/article.png"
              alt="article icon"
              width={48}
              height={48}
            />
          </div>
        </div>
        {/* third div  */}
        <div className="flex items-center justify-between bg-white rounded-[6px] shadow-md p-8">
          <div>
            <h3 className="text-xl font-bold text-[#131313] dark:text-black leading-[120%] tracking-[0%]">
              Pending Approvals
            </h3>
            <p className="flex items-center gap-1 text-lg font-medium text-[#424242] dark:text-black leading-[120%] tracking-[0%] pt-2">
              <GoDotFill className="text-[#008000] w-5 h-5" />
              {data?.data?.total_pending_content || 0}
            </p>
          </div>
          <div>
            <Image
              src="/assets/dashboard/pending-tasks.png"
              alt="pending icon"
              width={48}
              height={48}
            />
          </div>
        </div>

        {/* fourth div  */}
        {!isAuthor && (
          <div className="flex items-center justify-between bg-white rounded-[6px] shadow-md p-8">
            <div>
              <h3 className="text-xl font-bold text-[#131313] dark:text-black leading-[120%] tracking-[0%]">
                Total Author
              </h3>
              <p className="flex items-center gap-1 text-lg font-medium text-[#424242] dark:text-black leading-[120%] tracking-[0%] pt-2">
                <GoDotFill className="text-[#DDE067] w-5 h-5" />
                {data?.data?.total_author}
              </p>
            </div>
            <div>
              <Image
                src="/assets/dashboard/authors.png"
                alt="total author icon"
                width={48}
                height={48}
              />
            </div>
          </div>
        )}
        {!isAuthor && (
          <div className="flex items-center justify-between bg-white rounded-[6px] shadow-md p-8">
            <div>
              <h3 className="text-xl font-bold text-[#131313] dark:text-black leading-[120%] tracking-[0%]">
                Total User
              </h3>
              <p className="flex items-center gap-1 text-lg font-medium text-[#424242] dark:text-black leading-[120%] tracking-[0%] pt-2">
                <GoDotFill className="text-[#424242] w-5 h-5" />{" "}
                {data?.data?.total_user}
              </p>
            </div>
            <div>
              <Image
                src="/assets/dashboard/total_User.png"
                alt="total user icon"
                width={48}
                height={48}
              />
            </div>
          </div>
        )}
        {!isAuthor && (
          <div className="flex items-center justify-between bg-white rounded-[6px] shadow-md p-8">
            <div>
              <h3 className="text-xl font-bold text-[#131313] dark:text-black leading-[120%] tracking-[0%]">
                Subscribers
              </h3>
              <p className="flex items-center  text-lg font-medium text-[#424242] dark:text-black leading-[120%] tracking-[0%] pt-2">
                <GoDotFill className="text-[#424242] w-5 h-5" />
                {data?.data?.total_subscriber}
              </p>
            </div>
            <div>
              <Image
                src="/assets/dashboard/10k-followers.png"
                alt="subscriber icon"
                width={48}
                height={48}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewContainer;

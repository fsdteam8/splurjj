"use client";
import SplurjjPagination from "@/components/ui/SplurjjPagination";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type User = {
  id: number;
  email: string;
  created_at: string;
};

type Meta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

type UsersResponse = {
  success: boolean;
  data: User[];
  meta: Meta;
};

const SubscriberPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;

  const { data, isLoading, isError, error } = useQuery<UsersResponse>({
    queryKey: ["subscriber", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscribe?paginate_count=12&page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json()),
  });

  console.log(data?.data);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError)
    return <div>{error instanceof Error ? error.message : String(error)}</div>;
  return (
    <div className="w-full">
      <table className="w-full mt-8 border border-[#E7E7E7] bg-[#FFFFFF]">
        <thead className="w-full border-b border-[#E7E7E7]">
          <tr className="w-full flex items-center justify-between  px-6 py-4">
            <th className="text-lg font-medium leading-[120%] text-[#131313] ">
              Email Address
            </th>
            <th className="text-lg font-medium leading-[120%] text-[#131313] pr-16">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="">
          {data?.data?.map((item) => {
            return (
              <tr
                key={item.id}
                className="w-full flex items-center justify-between px-6 py-[14px]"
              >
                <td className="text-base font-semibold text-[#424242] leading-[120%]">
                  {item.email}
                </td>
                <td className="text-base font-semibold text-[#424242] leading-[120%]">
                  {moment(item.created_at).format("YYYY-MM-DD hh:mm A")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        {data && data?.meta && data?.meta.last_page > 1 && (
          <div className="pb-[208px]">
            <div className="mt-[32px] w-full flex items-center justify-between py-[10px] bg-white px-[50px]">
              <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
                Showing {currentPage} to {data?.meta?.last_page} in first
                entries
              </p>
              <div>
                <SplurjjPagination
                  currentPage={currentPage}
                  totalPages={data?.meta.last_page}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriberPage;

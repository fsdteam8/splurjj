"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

const RoleManagementContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  // console.log("TTTTTTTTTTTT",token);

  const { data, isLoading, isError, error } = useQuery<RoleAllResponse>({
    queryKey: ["role", currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json()),
  });

  // console.log({ data });

  let content;
  if (isLoading) {
    content = (
      <div className="w-full p-5 rounded-[8px]">
        <TableSkeletonWrapper
          count={8}
          width="100%"
          height="70px"
          className="bg-[#E6EEF6] rounded-[8px]"
        />
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <ErrorContainer message={error?.message || "Something went Wrong"} />
      </div>
    );
  } else if (data && data?.data && data?.data.length === 0) {
    content = (
      <div>
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    );
  } else if (data && data?.data && data?.data.length > 0) {
    content = (
      <div>
        <TableContainer data={data?.data} columns={RoleManagementColumn} />
      </div>
    );
  }

  console.log(data);
  return (
    <section className="w-full">
      <div className="w-full shadow-lg h-auto  rounded-[24px] bg-white mb-10 ">
        {content}
      </div>
      <div>
        {data && data?.meta && data?.meta.last_page > 1 && (
          <div className="mt-[30px]  w-full pb-[208px]  flex justify-between">
            {/* <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
              Showing(currentPage - 1) * perPage + 1 to Math.min(currentPage * perPage, totalItems) of {data?.meta?.total} results
            </p> */}
            <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
              Showing {(currentPage - 1) * data?.meta?.per_page + 1} to{" "}
              {Math.min(currentPage * data?.meta?.per_page, data?.meta?.total)} of{" "}
              {data?.meta?.total} results
            </p>
            <div>
              <SplurjjPagination
                currentPage={currentPage}
                totalPages={data?.meta.last_page}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoleManagementContainer;
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import SplurjjPagination from "@/components/ui/SplurjjPagination";
import { RoleManagementColumn } from "./RoleManagementColumn";
import { Role, RoleAllResponse } from "./RoleManagementDataType";
import ErrorContainer from "@/components/shared/ErrorContainer/ErrorContainer";
import NotFound from "@/components/shared/NotFound/NotFound";
import TableSkeletonWrapper from "@/components/shared/TableSkeletonWrapper/TableSkeletonWrapper";

const TableContainer = ({
  data,
  columns,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: ColumnDef<Role>[];
}) => {
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <DataTable table={table} columns={columns} title="All Roles" />
    </>
  );
};

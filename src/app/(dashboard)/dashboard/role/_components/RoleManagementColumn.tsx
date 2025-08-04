"use client";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Role } from "./RoleManagementDataType";
import RoleStatusDropDown from "./RoleStatusDropDown";
// import { MoreHorizontal } from "lucide-react";

export const RoleManagementColumn: ColumnDef<Role>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    header: "Full Name",
    cell: ({ row }) => {
      return (
        <div className="flex justify-start gap-[2px]">
          <span className="text-base font-normal leading-[19px] text-[#444444] dark:text-black text-center">
            {row.original.full_name}
          </span>
        </div>
      );
    },
  },
  {
    header: "Email Address",
    cell: ({ row }) => {
      return (
        <div className="flex justify-start gap-[2px]">
          <span className="text-base font-normal leading-[19px] text-[#444444] dark:text-black text-center">
            {row.original.email}
          </span>
        </div>
      );
    },
  },
  {
    header: "Phone",
    cell: ({ row }) => {
      return (
        <div className="flex justify-start gap-[2px]">
          <span className="text-base font-normal leading-[19px] text-[#444444] dark:text-black text-center">
            {row.original.phone}
          </span>
        </div>
      );
    },
  },
  {
    header: "Role Status",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-start items-center">
          <RoleStatusDropDown
          roleId={row.original.id}
          initialRole={row.original.role as "user" | "admin" | "author" | "editor"}
        />
        </div>
      );
    },
  },
];

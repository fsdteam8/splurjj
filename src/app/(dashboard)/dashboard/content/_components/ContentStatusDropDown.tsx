"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthToken from "@/hooks/useAuthToken";
import { useState } from "react";
import { toast } from "react-toastify";
type StatusDropdownProps = {
  contentId: number;
  initialStatus:
    | "Draft"
    | "Review"
    | "Approved"
    | "Published"
    | "Archived"
    | "Needs Revision"
    | "Rejected";
};

const ContentStatusDropDown = ({
  contentId,
  initialStatus,
}: StatusDropdownProps) => {
  const [status, setStatus] = useState<
    | "Draft"
    | "Review"
    | "Approved"
    | "Published"
    | "Archived"
    | "Needs Revision"
    | "Rejected"
  >(initialStatus);
  const token = useAuthToken();
  const roleToken = token.token;

  const handleStatusChange = async (
    newStatus:
      | "Draft"
      | "Review"
      | "Approved"
      | "Published"
      | "Archived"
      | "Needs Revision"
      | "Rejected"
  ) => {
    setStatus(newStatus); // Optimistic update

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status/${contentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${roleToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.status) {
        toast.error(data.message || "Failed to update role");
        return;
      }

      toast.success(data.message || "role updated successfully");
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Network error");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-2 py-1 text-base border font-normal rounded-[30px] leading-[120%] bg-white text-black dark:text-black flex items-center gap-1">
          {status}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:text-black">
        <DropdownMenuItem
          className="cursor-pointer dark:text-black"
          onClick={() => handleStatusChange("Draft")}
        >
          Draft
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer dark:text-black"
          onClick={() => handleStatusChange("Approved")}
        >
          Approved
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer dark:text-black"
          onClick={() => handleStatusChange("Review")}
        >
          In Review
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer dark:text-black"
          onClick={() => handleStatusChange("Published")}
        >
          Published
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer dark:text-black"
          onClick={() => handleStatusChange("Archived")}
        >
          Archived
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer dark:text-black"
          onClick={() => handleStatusChange("Needs Revision")}
        >
          Needs Revision
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer dark:text-black"
          onClick={() => handleStatusChange("Rejected")}
        >
          Rejected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContentStatusDropDown;

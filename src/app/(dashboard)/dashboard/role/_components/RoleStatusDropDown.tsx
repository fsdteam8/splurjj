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
  roleId: number;
  initialRole: "user" | "admin" | "author"  | "editor";
};

const RoleStatusDropDown = ({ roleId, initialRole }: StatusDropdownProps) => {
  const [role, setRole] = useState<"user" | "admin" | "author" | "editor">(initialRole);
  const token = useAuthToken();
  const roleToken = token.token



  const handleStatusChange = async (newRole: "user" | "admin" | "author" | "editor") => {
    setRole(newRole); // Optimistic update

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles/${roleId}?_method=PUT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${roleToken}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
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
          {role}
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
        <DropdownMenuItem onClick={() => handleStatusChange("user")}>
          User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("admin")}>
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("editor")}>
          Editor
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("author")}>
          Author
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleStatusDropDown;

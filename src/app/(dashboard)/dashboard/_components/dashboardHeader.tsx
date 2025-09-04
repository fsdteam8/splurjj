"use client";

import ThemeToggle from "@/app/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutModal from "@/components/shared/modals/LogoutModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserProfileData {
  first_name: string;
  last_name: string;
  profile_pic: string;
}

interface UserSettingsResponse {
  success: boolean;
  message: string;
  data: UserProfileData;
}

export type HeaderResponse = {
  success: boolean;
  message: string;
  data: {
    logo: string | null;
    border_color: string | null;
    bg_color: string | null;
    menu_item_color: string | null;
    menu_item_active_color: string | null;
  };
};

export default function DashboardHeader() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const session = useSession();
  const role = session?.data?.user?.role || "Admin";

  const token = (session?.data?.user as { token?: string })?.token;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handLogout = async () => {
    try {
      toast.success("Logout successful!");
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // user info data
  const { data } = useQuery<UserSettingsResponse>({
    queryKey: ["user-info"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  return (
    // <header className=" px-6 py-4 sticky top-0 z-50">
    <header
      className={`px-4 py-4 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white dark:bg-[#1f1f1f] shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-end w-full">
        <div className="flex items-center justify-center gap-4">
          {/* theme toggle  */}
          <ThemeToggle />

          {/* Right Section - Notifications and User Profile */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-3">
                  <div>
                    <Avatar>
                      <AvatarImage
                        src={
                          data?.data?.profile_pic || ""
                        }
                      />
                      <AvatarFallback className="text-base font-bold leading-normal text-black border rounded-full">
                        {data?.data?.first_name?.charAt(0) || ""}
                        {data?.data?.last_name?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-[#131313] dark:text-white leading-[120%] tracking-[0%] ">
                      {data?.data?.first_name}
                    </h4>
                    <p className="text-xs font-normal text-[#424242] text-left dark:text-white leading-[120%] tracking-[0%]  pt-[2px]">
                      {role}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white w-[150px]">
                <Link href="/dashboard/settings">
                  <DropdownMenuLabel className="text-[#131313] text-sm font-semibold leading-normal hover:bg-blue-100/50">
                    Settings
                  </DropdownMenuLabel>
                </Link>
                <DropdownMenuLabel
                  onClick={() => setLogoutModalOpen(true)}
                  className="text-red-500 text-sm font-semibold leading-normal cursor-pointer"
                >
                  Log Out
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handLogout}
        />
      )}
    </header>
  );
}

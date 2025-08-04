/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ChangePasswordFormComponent from "./ChangePasswordFormComponent";



export default function ChangePasswordForm() {
  return (
    <div className="p-6">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-[35px] lg:text-10  font-semibold text-[#212121] leading-[120%] mb-2">
              Accounts
            </h1>
            <div className="flex items-center gap-1">
              <Link
                href="/dashboard"
                className="hover:underline text-xl font-normal  leading-[120%] tracking-[0%] text-[#595959] dark:text-white"
              >
                Dashboard
              </Link>
              <span>
                <ChevronRight className="text-[#595959] w-6 h-6" />
              </span>
              <Link href="/dashboard/settings">
                <button
                 
                  className="hover:underline text-xl font-normal  leading-[120%] tracking-[0%] text-[#595959] dark:text-white"
                >
                  Settings
                </button>
              </Link>
              <span>
                <ChevronRight className="text-[#595959] w-6 h-6" />
              </span>
              <span className="text-xl font-normal  leading-[120%] tracking-[0%] text-[#595959]">
                Change Password
              </span>
            </div>
          </div>
        </div>

        {/* change password form components  */}
        <div className="p-4">
          <ChangePasswordFormComponent />
        </div>
      </div>
    </div>
  );
}

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import PersonalInfoForm from "./PersonalInfoForm";



export default function PersonalInformationForm() {
  return (
    <div className="p-6">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="">
            <h1 className="text-3xl md:text-[35px] lg:text-10 font-poppins font-semibold text-[#212121] leading-[120%] mb-2">
              Accounts
            </h1>
            <div className="flex items-center gap-1">
              <Link
                href="/dashboard"
                className="hover:underline text-xl font-normal font-poppins leading-[120%] tracking-[0%] text-[#595959] dark:text-white"
              >
                Dashboard
              </Link>
              <span>
                <ChevronRight className="text-[#595959] w-6 h-6" />
              </span>
             <Link href="/dashboard/settings">
              <button
                
                className="hover:underline text-xl font-normal font-poppins leading-[120%] tracking-[0%] text-[#595959] dark:text-white"
              >
                Settings
              </button>
             </Link>
              <span>
                <ChevronRight className="text-[#595959] w-6 h-6" />
              </span>
              <span className="text-xl font-normal font-poppins leading-[120%] tracking-[0%] text-[#595959]">
                Personal Information
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <PersonalInfoForm />
        </div>
      </div>
    </div>
  );
}

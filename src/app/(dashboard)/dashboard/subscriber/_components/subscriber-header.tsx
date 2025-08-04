"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import SubscriberForm from "./subscriber-form";

const SubscriberHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#131313] leading-[120%]">
            All Subscribers
          </h2>
          <div className="flex items-center gap-2 pt-[14px]">
            <Link
              href="/dashboard"
              className="text-base text-[#929292] font-medium leading-[120%] hover:text-secondary hover:underline"
            >
              Dashboard
            </Link>
            <ChevronRight className="text-[#929292] w-[18px] h-[18px]" />
            <p className="text-base text-[#929292] font-medium leading-[120%]">
              Setting
            </p>
            <ChevronRight className="text-[#929292] w-[18px] h-[18px]" />
            <p className="text-base text-[#929292] font-medium leading-[120%]">
              All Subscribes
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-lg text-white font-medium leading-[120%] bg-[#0253F7] py-[12px] px-[24px] rounded-[8px]"
          >
            Send Mail to Subscribers
          </button>
        </div>
      </div>

      {/* subscriber form  */}
      {isOpen && (
        <div>
          <SubscriberForm open={isOpen} onOpenChange={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default SubscriberHeader;

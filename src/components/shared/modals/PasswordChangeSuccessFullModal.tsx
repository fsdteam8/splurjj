import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordChangeSuccessFullModal: React.FC<Props> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white w-full md:w-[596px] max-h-[422px] rounded-[16px] py-6 md:py-8 lg:py-10 px-5 md:px-6 lg:px-8">
        <DialogHeader>
          <div className="flex items-center justify-center">
            <Image
              src="/assets/images/success.png"
              alt="success"
              width={130}
              height={130}
              className="w-[130px] h-[130px] bg-cover"
            />
          </div>
          <DialogTitle className="text-3xl md:text-[34px] lg:text-10 text-black font-semibold text-center  mt-[10px]">
            Password Changed Successfully
          </DialogTitle>
          <DialogDescription className="text-base font-normal text-[#424242] text-center  mt-[10px] pb-4">
            Your password has been updated successfully
          </DialogDescription>
          <div className="pt-2">
            <Link href="/login" passHref>
              <button className="text-base font-bold  text-white bg-[#0253F7] rounded-[8px] h-[51px] w-full">
                Back to Login
              </button>
            </Link>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeSuccessFullModal;

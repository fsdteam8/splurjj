import React from "react";
import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";
import Image from "next/image";
import Link from "next/link";

const ForgotPassword = () => {
  return (
    <div
      className={`h-screen w-full flex flex-col justify-center items-center p-5 md:p-0`}
    >
      <Link href="/">
        <Image
          src="/assets/images/auto-logo.png"
          alt="sign in"
          width={1900}
          height={1200}
          className="w-[100px] h-[60px] object-cover"
        />
      </Link>
      <div className="pb-[30px] w-full md:w-[570px] pt-4">
        <h1 className=" text-[32px] md:text-[36px] ld:text-[40px] font-bold leading-[120%] text-[#131313] tracking-[0%]">
          Forgot Password
        </h1>
        <p className=" text-base font-bold leading-[150%] text-[#424242] pt-[5px] tracking-[0%]">
          Enter your registered email address. we’ll send you a code to reset
          your password.
        </p>
      </div>
      <div className="w-full md:w-[570px]">
        <ForgotPasswordForm />
      </div>
    </div>
    // <div className={`h-screen w-full grid grid-cols-1 md:grid-cols-2 gap-20 p-5 md:p-0`}>
    //   <div className="md:col-span-1 hidden md:block">
    //     <Image
    //       src="/assets/images/auth_image.png"
    //       alt="sign in"
    //       width={800}
    //       height={800}
    //       className="w-full h-full object-cover"
    //     />
    //   </div>
    //   <div className="md:col-span-1 w-full h-full flex flex-col items-center justify-center">
    //     <div className="pb-[30px] w-full md:w-[570px]">
    //       <h1 className=" text-[32px] md:text-[36px] ld:text-[40px] font-semibold leading-[120%] text-black tracking-[0%]">
    //         Forgot Password
    //       </h1>
    //       <p className=" text-base font-normal leading-[150%] text-[#424242] pt-[5px] tracking-[0%]">
    //         Enter your registered email address. we’ll send you a code to reset
    //         your password.
    //       </p>
    //     </div>
    //     <div className="w-full md:w-[570px]">
    //       <ForgotPasswordForm />
    //     </div>
    //   </div>
    // </div>
  );
};

export default ForgotPassword;

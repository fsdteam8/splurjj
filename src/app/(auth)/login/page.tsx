import React from "react";
import { LogingForm } from "./_components/LoginForm";
import Image from "next/image";

const Login = () => {
  return (
    <div
      className={`h-screen w-full grid grid-cols-1 md:grid-cols-2 gap-20 p-5 md:p-0`}
    >
      <div className="md:col-span-1 hidden md:block">
        <Image
          src="/assets/images/auth_image.png"
          alt="sign in"
          width={1900}
          height={1200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:col-span-1 w-full h-full flex flex-col items-center justify-center">
        <div className="pb-[30px] w-full md:w-[570px]">
          <h1 className=" text-[32px] md:text-[36px] ld:text-[40px] font-bold leading-[120%] text-[#131313] tracking-[0%]">
            Welcome 👋
          </h1>
          <p className=" text-base font-bold leading-[150%] text-[#424242] pt-[5px] tracking-[0%]">
            Please login here
          </p>
        </div>
        <div className="w-full md:w-[570px]">
          <LogingForm />
        </div>
      </div>
    </div>
  );
};

export default Login;

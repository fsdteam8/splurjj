import React, { Suspense } from "react";
import OtpForm from "./_components/OtpForm";

const Otp = () => {
  return (
    <div
      className={`h-screen w-full flex flex-col justify-center items-center p-5 md:p-0`}
    >
      <div className="w-full md:w-[570px]">
        <Suspense fallback={<div>Loading...</div>}>
          <OtpForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Otp;

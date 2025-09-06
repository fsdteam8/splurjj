import React from "react";
import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div
      className={`h-screen w-full flex flex-col justify-center items-center p-5 md:p-0`}
    >
      <div className="w-full md:w-[570px]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;

import React from "react";
import { SignUpForm } from "./_components/SignUpForm";

const Signup = () => {
  return (
    <div
      className={`h-full lg:h-screen w-full flex flex-col justify-center items-center p-5 md:p-0 `}
    >
      <div className="w-full md:w-[570px]">
        <SignUpForm />
      </div>
    </div>
  );
};

export default Signup;

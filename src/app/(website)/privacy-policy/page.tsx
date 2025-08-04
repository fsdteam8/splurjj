import React, { Suspense } from "react";
// import PrivacyPolicyContainer from "./_components/PrivacyPolicyContainer";
import dynamic from "next/dynamic";
const PrivacyPolicyContainer = dynamic(
  () => import("./_components/PrivacyPolicyContainer"),
  {
    ssr: false,
  }
);

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PrivacyPolicyContainer />
      </Suspense>
    </div>
  );
};

export default Page;

"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type TermsAndConditionResponse = {
  status: "success";
  terms_conditions: string;
  message: string;
};
const TermsAndConditionContainer = () => {
  // get api
  const { data } = useQuery<TermsAndConditionResponse>({
    queryKey: ["terms-and-condition"],
    queryFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/terms-conditions`
      ).then((res) => res.json());
    },
  });

//   console.log(data);
  return (
    <div>
      <div className="container py-10">
        <p dangerouslySetInnerHTML={{ __html: data?.terms_conditions ?? "" }} />
      </div>
    </div>
  );
};

export default TermsAndConditionContainer;

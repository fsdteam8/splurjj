"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type InvestmentPolicyResponse = {
  status: "success";
  investment_disclaimer: string;
  message: string;
};

const InvestmentDisclaimer = () => {
  // get api
  const { data } = useQuery<InvestmentPolicyResponse>({
    queryKey: ["investment-disclaimer"],
    queryFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/investment-disclaimer`
      ).then((res) => res.json());
    },
  });

  //   console.log(data);
  return (
    <div>
      <div className="container py-10">
        {/* <h1>Privacy Policy</h1> */}
        <p dangerouslySetInnerHTML={{ __html: data?.investment_disclaimer ?? "" }} />
      </div>
    </div>
  );
};

export default InvestmentDisclaimer;

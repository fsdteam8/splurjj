"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type CookiesPolicyResponse = {
  status: "success";
  cookies_policy: string;
  message: string;
};

const CookiesPolicyContainer = () => {
  // get api
  const { data } = useQuery<CookiesPolicyResponse>({
    queryKey: ["cookies-policy"],
    queryFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookies-policy`
      ).then((res) => res.json());
    },
  });

  //   console.log(data);
  return (
    <div>
      <div className="container py-10">
        {/* <h1>Privacy Policy</h1> */}
        <p dangerouslySetInnerHTML={{ __html: data?.cookies_policy ?? "" }} />
      </div>
    </div>
  );
};

export default CookiesPolicyContainer;

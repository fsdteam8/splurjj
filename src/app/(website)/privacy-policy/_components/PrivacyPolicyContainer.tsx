"use client"
import { useQuery } from '@tanstack/react-query';
import React from 'react'

type PrivacyPolicyResponse = {
  status: "success";
  privacy_policy: string;
};


const PrivacyPolicyContainer = () => {
      // get api
  const { data } = useQuery<PrivacyPolicyResponse>({
    queryKey: ["privacy-policy"],
    queryFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/privacy-policy`
      ).then((res) => res.json());
    },
  });

//   console.log(data);
  return (
    <div>
    <div className='container py-10'>
      {/* <h1>Privacy Policy</h1> */}
      <p dangerouslySetInnerHTML={{ __html: data?.privacy_policy ?? "" }} />
    </div>
    </div>
  )
}

export default PrivacyPolicyContainer

// import MainHome from "./_components/Home/mainHome";

// // Fetch data from API
// async function fetchData() {
//   const apiUrl =
//     process.env.NEXT_PUBLIC_BACKEND_URL ||
//     "https://dynamic-splurjj.scaleupdevagency.com";
//   const res = await fetch(`${apiUrl}/api/home`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// }

// // Generate dynamic metadata for SEO
// export async function generateMetadata() {
//   try {
//     const data = await fetchData();

//     const meta = Array.isArray(data) ? data[0] : data?.data ?? {};

//     console.log(meta[0]);

//     return {
//       title:
//         typeof meta[0].meta_title === "string" ? meta[0].meta_title : "Splurjj",
//       description:
//         typeof meta[0].meta_description === "string"
//           ? meta[0].meta_description
//           : "splurjj description",
//     };
//   } catch (error) {
//     console.error("Error generating metadata:", error);
//     return {
//       title: "Splurjj",
//       description: "splurjj description",
//     };
//   }
// }

// const HomePage = async () => {
//   return (
//     <div>
//       <MainHome />
//     </div>
//   );
// };

// export default HomePage;

import React, { Suspense } from "react";
import MainHome from "./_components/Home/mainHome";

const HomePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MainHome />
      </Suspense>
    </div>
  );
};

export default HomePage;

import React from "react";
import ContentBlogDetails from "./_components/content-detatils";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://dynamic-splurjj.scaleupdevagency.com";

async function fetchBlogDetails(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/details/${id}`, {
      cache: "no-store", 
    });

    if (!response.ok) {
      console.error("❌ Failed to fetch blog details:", {
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ API request error:", error);
    return null;
  }
}


export async function generateMetadata({
  params,
}: {
  params: { categoryId: string; subcategoryId: string; id: string };
}) {
  const data = await fetchBlogDetails(params?.id);
  const meta = data?.data || {};
  console.log("meta", meta)

  const title =
    typeof meta.meta_title === "string" && meta.meta_title.trim()
      ? `${meta.meta_title} | Splurjj`
      : "Splurjj";

  const description =
    typeof meta.meta_description === "string" && meta.meta_description.trim()
      ? meta.meta_description
      : "Discover the latest stories, blogs, and updates on Splurjj.";

  return { title, description };
}


const BlogDetailsPage = ({
  params,
}: {
  params: { categoryId: string; subcategoryId: string; id: string };
}) => {
  const { categoryId, subcategoryId, id } = params;

  return (
    <main className="container mx-auto px-4 py-8">
      <ContentBlogDetails
        categoryId={categoryId}
        subcategoryId={subcategoryId}
        id={id}
      />
    </main>
  );
};

export default BlogDetailsPage;



// import React from "react";
// import ContentBlogDetails from "./_components/content-detatils";

// // ✅ Safe fetch with proper error handling
// async function fetchData(id: string) {
//   try {
//     const apiUrl =
//       process.env.NEXT_PUBLIC_BACKEND_URL ||
//       "https://dynamic-splurjj.scaleupdevagency.com";

//     const res = await fetch(`${apiUrl}/api/details/${id}`, {
//       // Prevent stale data in SSR
//       cache: "no-store",
//       // Add timeout protection (optional)
//       next: { revalidate: 0 },
//     });

//     if (!res.ok) {
//       console.error("❌ Fetch failed:", res.status, res.statusText);
//       return null; // Return fallback instead of throwing
//     }

//     return res.json();
//   } catch (err) {
//     console.error("❌ API request error:", err);
//     return null;
//   }
// }

// // ✅ Generate dynamic metadata for SEO
// export async function generateMetadata({
//   params,
// }: {
//   params: { categoryId: string; subcategoryId: string; id: string };
// }) {
//   const data = await fetchData(params.id);
//   const meta = data?.data || {};

//   return {
//     title:
//       typeof meta.meta_title === "string" && meta.meta_title.trim()
//         ? `${meta.meta_title} | Splurjj`
//         : "Splurjj",
//     description:
//       typeof meta.meta_description === "string" &&
//       meta.meta_description.trim()
//         ? meta.meta_description
//         : "splurjj description",
//   };
// }

// // ✅ Page Component
// const Page = ({
//   params,
// }: {
//   params: { categoryId: string; subcategoryId: string; id: string };
// }) => {
//   return (
//     <div>
//       <ContentBlogDetails
//         categoryId={params.categoryId}
//         subcategoryId={params.subcategoryId}
//         id={params.id}
//       />
//     </div>
//   );
// };

// export default Page;

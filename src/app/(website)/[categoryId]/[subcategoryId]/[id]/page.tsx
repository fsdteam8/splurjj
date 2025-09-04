
import React from "react";
import ContentBlogDetails from "./_components/content-detatils";

// Fetch data from API
async function fetchData(id: string) {
  const apiUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://dynamic-splurjj.scaleupdevagency.com";

  const res = await fetch(`${apiUrl}/api/details/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { categoryId: string; subcategoryId: string; id: string };
}) {
  try {
    const data = await fetchData(params.id);

    // Adjust according to your API response shape
    const meta = data?.data || {};

    return {
      title:
        typeof meta.meta_title === "string" && meta.meta_title.trim()
          ? ` ${meta.meta_title} | Splurjj`
          : "Splurjj",
      description:
        typeof meta.meta_description === "string" &&
        meta.meta_description.trim()
          ? meta.meta_description
          : "splurjj description",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Splurjj",
      description: "splurjj description",
    };
  }
}

const Page = ({
  params,
}: {
  params: { categoryId: string; subcategoryId: string; id: string };
}) => {
  return (
    <div>
      <ContentBlogDetails
        categoryId={params.categoryId}
        subcategoryId={params.subcategoryId}
        id={params.id}
      />
    </div>
  );
};

export default Page;



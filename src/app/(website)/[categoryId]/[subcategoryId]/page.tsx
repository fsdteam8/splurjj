import React from "react";
import AllContentContainer from "../../_components/AllContentContainer";
import { Metadata } from "next";



export async function generateMetadata({params}: {params: {categoryId: string, subcategoryId: string}}): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.subcategoryId);

  return {
    title: ` ${categoryName} | Splurjj`,
    description: ` ${categoryName}`,
  };
}
const AllContent = ({params}: {params: {categoryId: string, subcategoryId: string}}) => {
    // console.log(params.categoryId, params.subcategoryId);
  return (
    <div>
      <AllContentContainer categoryId={params.categoryId} subcategoryId={params.subcategoryId}/>
    </div>
  );
};

export default AllContent;
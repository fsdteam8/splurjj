
import React from 'react'
import CategoryContainer from './_components/category-container'
import { Metadata } from 'next';

// This runs on the server before rendering
export async function generateMetadata({params}: {params: {category_name: string}}): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.category_name);
  // console.log(categoryName, "categoryName");

  return {
    title: ` ${categoryName} | Splurjj`,
    description: ` ${categoryName}`,
  };
}


const Page = ({params}: {params: {category_name: string}}) => {
  // const slug = decodeURIComponent(params?.category_name);
  const slug = params?.category_name;
  console.log(slug, "slug");
  return (
    <div>
      <CategoryContainer categoryName={slug}/>
    </div>
  )
}

export default Page



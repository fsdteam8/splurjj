
import React from 'react'
import CategoryContainer from './_components/category-container'
import { Metadata } from 'next';

// This runs on the server before rendering
export async function generateMetadata({params}: {params: {category_name: string}}): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.category_name);

  return {
    title: ` ${categoryName} | Splurjj`,
    description: ` ${categoryName}`,
  };
}


const Page = ({params}: {params: {category_name: string}}) => {
  return (
    <div>
      <CategoryContainer categoryName={params.category_name}/>
    </div>
  )
}

export default Page



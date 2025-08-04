import React from 'react'
import dynamic from 'next/dynamic';
const AddNewPostForm = dynamic(() => import('./_components/AddNewPostForm'), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <AddNewPostForm/>
    </div>
  )
}

export default Page

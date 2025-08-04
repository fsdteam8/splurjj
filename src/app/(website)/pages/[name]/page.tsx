import React from 'react'
import Allpage from './_components/allpage'


interface PageProps {
  params: Promise<{ name: string }>
}

async function page({params}: PageProps) {

    const { name: pagesName } = await params;
  return (
    <div className='container'>
        <Allpage  pagesName={pagesName}/>
    </div>
  )
}

export default page
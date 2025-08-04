import React from "react";
import AllContentContainer from "../../_components/AllContentContainer";



const AllContent = ({params}: {params: {categoryId: string, subcategoryId: string}}) => {
    // console.log(params.categoryId, params.subcategoryId);
  return (
    <div>
      <AllContentContainer categoryId={params.categoryId} subcategoryId={params.subcategoryId}/>
    </div>
  );
};

export default AllContent;
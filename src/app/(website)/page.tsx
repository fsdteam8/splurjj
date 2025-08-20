
import React, { Suspense } from "react";
import MainHome from "./_components/Home/mainHome";

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <MainHome />
      </Suspense>
    </div>
  );
};

export default HomePage;


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

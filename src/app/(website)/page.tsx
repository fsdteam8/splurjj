import React, { Suspense } from "react";
import MainHome from "./_components/Home/mainHome";
import { Loader2 } from "lucide-react";

const HomePage = () => {
  return (
    <div className="">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        }
      >
        <MainHome />
      </Suspense>
    </div>
  );
};

export default HomePage;

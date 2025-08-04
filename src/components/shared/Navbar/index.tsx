import React, { Suspense } from "react";
import Header from "./Navbar";

const NavbarPage = () => {
  return (
    <div className="sticky top-0 z-50">
      <Suspense fallback={<div>Loading Navbar...</div>}>
        <Header />
      </Suspense>
    </div>
  );
};

export default NavbarPage;

import Footer from "@/components/shared/Footer/Footer";
// import Navbar from "@/components/shared/Navbar/Navbar";
// import React, { Suspense } from "react";
import "@/app/globals.css";
import AppProvider from "@/components/provider/AppProvider";
import NavbarPage from "@/components/shared/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AppProvider>
        {/* <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense> */}
        <NavbarPage />
        {/* Main content area */}
        <div className="min-h-screen">{children}</div>

        <Footer />
      </AppProvider>
    </div>
  );
};

export default MainLayout;

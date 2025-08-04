
import React from "react";
import DashboardOverviewContainer from "./_components/DashboardOverviewContainer";
import { ProductsReport } from "./_components/products-report";
import { RevenueReport } from "./_components/revenue-report";
import RecentArticles from "./_components/recent-articles";

const DashboarOverview = () => {
  return (
    <div>
      <DashboardOverviewContainer />
      <div className="">
        {/* Top row - Recent Articles and Products Report */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-[35px]">
          <RecentArticles />
          <ProductsReport />
        </div>

        {/* Bottom row - Revenue Report (full width) */}
        <div className="pb-[50px]">
          <RevenueReport />
        </div>
      </div>
    </div>
  );
};

export default DashboarOverview;

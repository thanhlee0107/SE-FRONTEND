import React from "react";
import UsageStatistics from "./UsageStats";
import LastLoginCard from "./LoggingTag";

export const HomeDashBoard = () => {
  return (
    <div className="flex flex-col  ">
      <div className="flex flex-row">
        <div className="flex-grow-[6] basis-6/10">
          <UsageStatistics />
        </div>
        <div className="flex-grow-[4] basis-4/10">
          <div className="w-full">
            <LastLoginCard />
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
    </div>
  );
};

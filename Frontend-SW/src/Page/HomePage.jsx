//create fake HomePage
import React from "react";
import { LayOut } from "../Components/LayOut";
import { HomeDashBoard } from "../Components/HomePage/HomeDashBoard";

export const HomePage = () => {
  return (
    <div>
      <LayOut>
        <HomeDashBoard />
      </LayOut>
    </div>
  );
};

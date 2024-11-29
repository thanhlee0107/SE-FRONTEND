//create fake HomePage
import React from "react";
import { LayOut } from "../Components/LayOut";
import { AdminDashboard} from "../Components/AdminHomePage/AdminDashboard";

export const AdminHomePage = () => {
  return (
    <div>
      <LayOut>
        <AdminDashboard />
      </LayOut>
    </div>
  );
};
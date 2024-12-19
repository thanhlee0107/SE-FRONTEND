//create fake HomePage
import React from "react";
import { LayOut } from "../Components/LayOut";
import {AdminDashBoard} from "@/Components/AdminHomePage/AdminDashboard";

export const AdminHomePage = () => {
  return (
    <div>
      <LayOut>
        <AdminDashBoard />
      </LayOut>
    </div>
  );
};
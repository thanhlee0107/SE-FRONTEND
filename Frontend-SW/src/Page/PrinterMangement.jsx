import React from "react";
import { LayOut } from "../Components/LayOut";
import { PrinterView } from "@/Components/PrinterManagement/PrinterView";
export const PrinterMangement = () => {
  return (
    <div>
    <LayOut
      title={"Quản lý máy in"}
      breadcrumb={"Dịch Vụ In Ấn"}
      channel1={"Quản trị viên"}
      channel2={"Dịch Vụ Quản Trị"}
    >
      <PrinterView />
    </LayOut>
  </div>
  );
}
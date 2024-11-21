import React from "react";
import { PrintingSection } from "../Components/PrintingPage/PrintingSection";
import { LayOut } from "../Components/LayOut";
export const PrintingPage = () => {
  return (
    <div>
      <LayOut
        title={"Dịch Vụ Sinh viên"}
        breadcrumb={"Dịch Vụ In Ấn"}
        channel1={"Sinh viên"}
        channel2={"Dịch Vụ Sinh Viên"}
      >
        <PrintingSection />
      </LayOut>
    </div>
  );
};

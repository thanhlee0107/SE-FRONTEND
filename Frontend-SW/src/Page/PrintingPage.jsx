import React from "react";
import { PrintingSection } from "../Components/PrintingPage/PrintingSection";
import { LayOut } from "../Components/LayOut";
export const PrintingPage = () => {
    return (
        <div>
        <LayOut>
            <PrintingSection />
        </LayOut>
        </div>
    );
    };
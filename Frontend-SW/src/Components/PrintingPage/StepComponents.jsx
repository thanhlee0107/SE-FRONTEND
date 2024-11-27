import React from "react";
import FileUploadWithIndexedDB from "./UpLoadFile";
import PropTypes from "prop-types";
import { PrinterConfig } from "./PrinterConfig";
import PrintForm from "./PrintingConfig";
import { SendFile } from "./SendFileToPrint";

export const StepComponents = ( {stepID=1}) => {
  console.log(stepID);
  switch (stepID) {
    case 1:
      return <FileUploadWithIndexedDB />;
    case 2:
      return <PrintForm />;
    case 3:
      return <PrinterConfig />;
    case 4:
      return <SendFile />;
    default:
      return <FileUploadWithIndexedDB />;
  }
}

StepComponents.propTypes = {
  stepID: PropTypes.number,
};
import React from "react";
import PropTypes from "prop-types";
import Step1Icon from "@/assets/Step1.svg?react";
import Step2Icon from "@/assets/Step2.svg?react";
import Step3Icon from "@/assets/Step3.svg?react";
import Step4Icon from "@/assets/Step4.svg?react";

export const IconStep = ({ stepID = 1 }) => {

  switch (stepID) {
    case 1:
      return <Step1Icon className="h-4 w-4" />;
    case 2:
      return <Step2Icon className="h-4 w-4" />;
    case 3:
      return <Step3Icon className="h-4 w-4" />;
    case 4:
      return <Step4Icon className="h-4 w-4" />;
    default:
      return null;
  }
};

IconStep.propTypes = {
  stepID: PropTypes.number.isRequired,
};
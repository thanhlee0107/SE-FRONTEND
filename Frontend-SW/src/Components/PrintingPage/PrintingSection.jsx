import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  goToStep,
  markCompleted,
} from "@/features/PrintingStep/printingStepSlice";
import { IconStep } from "./IconStep";
import { StepComponents } from "./StepComponents";
export const PrintingSection = () => {
  const dispatch = useDispatch();
  const steps = useSelector((state) => state.steps.steps);
  const currentStep = useSelector((state) => state.steps.currentStep);

  const handleStepClick = (stepId) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);

    
    const isStepClickable = steps.slice(0, stepIndex).every((step) => step.completed);

    if (isStepClickable) {
      dispatch(goToStep(stepId));
    }
    
  };

  return (
    <div className="relative flex flex-col ml-4 mb-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-row ">
          <div className="relative mr-8 ml-4">
            {/* Vertical Line */}
            <div className={`absolute top-0  -translate-x-1/2 w-1 bg-gray-800  h-full
              ${
                step.completed
                  ? "border-green-800 bg-green-800 text-white"
                  : currentStep === step.id
                  ? "border-[#0073B7] bg-[#0073B7] text-blue-500"
                  : "border-outerSpace bg-outerSpace text-gray-500"
              }
              `}></div>

            {/* Icon */}
            <div className="relative">
              <div
                className={`absolute -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed
                    ? "border-green-800 bg-green-800 text-white"
                    : currentStep === step.id
                    ? "border-[#0073B7] bg-[#0073B7] text-blue-500"
                    : "border-outerSpace bg-outerSpace text-gray-500"
                }`}
                onClick={() => handleStepClick(step.id)}
                style={{
                  cursor: steps
                    .slice(0, steps.findIndex((s) => s.id === step.id))
                    .every((s) => s.completed)
                    ? "pointer"
                    : "not-allowed",
                }}
                
              >
                <IconStep stepID={step.id} />
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className={`flex-grow ${index==3?"mb-0":"mb-4"} ml-2 mr-4   `}>
           <div
           className={`bg-white ${
            currentStep === step.id ? "border-[#0073B7] opacity-100" : "border-gray-300 opacity-70"
          } border-1 rounded-md shadow-sm`}>
            <div className="font-semibold text-base border-b-[1px] border-gray-300 p-2 text-gray-700">
            {`${step.id}. ${step.label}`}
            </div>
            <div className={`transition-opacity duration-100 delay-100 ${
            currentStep === step.id ? "opacity-100" : "opacity-0"
          } `}>
            { currentStep === step.id ?<StepComponents />:null}
            </div>
           </div>
            
           
          </div>
          <div>
            
          </div>
        </div>
      ))}
    </div>
  );
};

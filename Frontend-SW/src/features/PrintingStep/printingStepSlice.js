import { createSlice } from "@reduxjs/toolkit";
import { reset } from "../Printing/PrintForm";

const initialState = {
  steps: [
    {
      id: 1,
      label: "Upload File",
      completed: false,
    },
    {
      id: 2,
      label: "Printing Options",
      completed: false,
    },
    {
      id: 3,
      label: "Printer Selection",
      completed: false,
    },
    {
      id: 4,
      label: "Send to Printer",
      completed: false,
    },
  ],
  currentStep: 0,
};

const stepsSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    goToStep: (state, action) => {
      const targetStep = action.payload;
      state.currentStep = targetStep;
    },
    markCompleted: (state, action) => {
      const stepIndex = state.steps.findIndex(
        (step) => step.id === action.payload
      );

      // Ensure the step exists
      if (stepIndex !== -1) {
        // Check if the previous step is completed or if it's the first step
        if (
          (stepIndex === 0 && action.payload === 1) ||
          state.steps[stepIndex - 1].completed
        ) {
          state.steps[stepIndex].completed = true;
        }
      }
    },
    markUncompleted: (state, action) => {
      const stepIndex = state.steps.findIndex(
        (step) => step.id === action.payload
      );

      // Ensure the step exists
      if (stepIndex !== -1) {
        state.steps[stepIndex].completed = false;

        for (let i = stepIndex + 1; i < state.steps.length; i++) {
          state.steps[i].completed = false;
        }
      }
    },
    resetAllSteps: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { goToStep, markCompleted, markUncompleted,resetAllSteps } = stepsSlice.actions;

export default stepsSlice.reducer;

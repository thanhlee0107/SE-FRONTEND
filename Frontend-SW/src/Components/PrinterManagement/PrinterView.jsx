import React, { useState, useReducer, useMemo, useEffect } from "react";
import { PrinterManageSection } from "./PrinterManageSection";
import {jwtDecode} from "jwt-decode";
import { addNotificationWithTimeout } from "@/features/Notification/toastNotificationSlice";
import { useSelector, useDispatch } from "react-redux";
import  PrinterAddModal  from "./PrinterAddModal";

const campusBlocks = {
  CS1: ["B1", "B3", "B2", "B4", "B6", "B9", "A4", "A1", "C5", "C6"],
  CS2: ["H1", "H2", "H3", "H6"],
};

const initialState = {
  formData: {
    spsoId: "",
    Model: "",
    Brand: "",
    Status: "online",
    Campus: "",
    Building: "",
    Floor: "",
    Description: "",
  },
  errors: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value,
        },
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    case "SET_SPSO_ID":
      return {
        ...state,
        formData: {
          ...state.formData,
          spsoId: action.payload,
        },
      };
      case "RESET_FORM":
        return {
          ...state,
          formData: {
            ...initialState.formData,
            spsoId: state.formData.spsoId, 
          },
          errors: {},
        };
    default:
      return state;
  }
};

export const PrinterView = () => {
  const [showModal, setShowModal] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const authToken = useSelector((state) => state.auth.token);
  const reduxDispatch = useDispatch();

  const { formData, errors } = state;

  
  useEffect(() => {
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      if (decodedToken?.payload?.id) {
        dispatch({ type: "SET_SPSO_ID", payload: decodedToken.payload.id });
      }
    }
  }, [authToken]);

  const campusOptions = useMemo(() => Object.keys(campusBlocks), []);
  const buildingOptions = useMemo(
    () => (formData.Campus ? campusBlocks[formData.Campus] : []),
    [formData.Campus]
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.Model.trim()) newErrors.Model = "Model không được bỏ trống";
    if (!formData.Brand.trim()) newErrors.Brand = "Brand không được bỏ trống";
    if (!formData.Campus.trim()) newErrors.Campus = "Campus không được bỏ trống";
    if (!formData.Building.trim()) newErrors.Building = "Building không được bỏ trống";
    if (!formData.Floor) newErrors.Floor = "Floor không được bỏ trống";
    if (!formData.Description.trim())
      newErrors.Description = "Description không được bỏ trống";
    dispatch({ type: "SET_ERRORS", payload: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleCreatePrinter = async () => {
    if (!validate()) {
      reduxDispatch(
        addNotificationWithTimeout({
          message: "Please fill in all required fields.",
          type: "error",
        })
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3003/printers/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create printer");
      }

      reduxDispatch(
        addNotificationWithTimeout({ message: "Máy in đã được thêm", type: "success" })
      );
      setShowModal(false);
      dispatch({type: "RESET_FORM"});
    } catch (error) {
      console.error("Error:", error.message);
      reduxDispatch(
        addNotificationWithTimeout({
          message: "Failed to create printer",
          type: "error",
        })
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", payload: { name, value } });

  };

  return (
    <div className="flex flex-col bg-white m-4 rounded-md">
      <div className="flex flex-col gap-2 w-40">
        <h3 className="text-lg font-bold ml-4 text-left">Quản lý máy in</h3>
        <button
          className="btn btn-success ml-4 btn-sm text-white w-auto"
          onClick={() => setShowModal(true)}
        >
          + Thêm Máy In
        </button>
      </div>
      <PrinterManageSection />

      {showModal && (
        <PrinterAddModal
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleCreatePrinter}
          campusOptions={campusOptions}
          buildingOptions={buildingOptions}
          onClose={() => {setShowModal(false);dispatch({type: "RESET_FORM"})}}
        />
      )}
    </div>
  );
};

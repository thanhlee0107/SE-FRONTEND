import React, { useEffect, useState } from "react";
import { PrinterList } from "./PrinterList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { useDispatch,useSelector } from "react-redux";
import { modify} from "@/features/Printing/PrintForm";

export const PrinterManageSection = () => {
  const [campus, setCampus] = useState("");
  const [block, setBlock] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(modify({IDPrinter: ""}));
  }, [dispatch]);

  // Define blocks for each campus
  const campusBlocks = {
    CS1: ["B1", "B3", "B2", "B4", "B6", "B9", "A4", "A1", "C5", "C6"],
    CS2: ["H1", "H2", "H3", "H6"],
  };

  // Get blocks for the selected campus
  const blocks = campus ? campusBlocks[campus] : [];
  

  return (
    <div className="flex flex-col gap-4 ml-4">
      <div className="flex flex-row gap-8">
        {/* Campus Selection */}
        <div>
          <label className="label font-semibold">Chọn campus</label>
          <select
            className="select select-bordered select-sm w-full"
            value={campus}
            onChange={(e) => {
              setCampus(e.target.value);
              setBlock(""); 
            }}
          >
            <option disabled selected value="">
              Chọn campus
            </option>
            <option value="CS1">CS1</option>
            <option value="CS2">CS2</option>
          </select>
        </div>

        {/* Block Selection */}
        <div>
          <label className="label font-semibold">Chọn block</label>
          <div className="flex flex-row items-center gap-4">
            <select
              className="select select-bordered select-sm w-full"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              disabled={!campus} // Disable if no campus is selected
            >
              <option  value="">
                Chọn block
              </option>
              {blocks.map((blockOption, index) => (
                <option key={index} value={blockOption}>
                  {blockOption}
                </option>
              ))}
            </select>
            <button
              className="btn btn-circle btn-xs "
              onClick={() => {
                setReloadKey((prev) => prev + 1); 
              
                setBlock("");
              }}
            >
              <FontAwesomeIcon icon={faSync} />
            </button>
          </div>
        </div>
      </div>
      <PrinterList key={reloadKey} campus={campus} block={block} 
         />
    </div>
  );
};

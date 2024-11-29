import React, { useEffect, useState, useRef } from "react";
import { fetchPrinters } from "@/API/usedAPI";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import MaintainingPrinter from "@/assets/maintainingPrinter.svg?react";
import OnlinePrinter from "@/assets/onlinePrinter.svg?react";
import OfflinePrinter from "@/assets/offlinePrinter.svg?react";

export const PrinterList = ({ campus, block }) => {
  const [printers, setPrinters] = useState([]);
  const [error, setError] = useState("");

  const token = useSelector((state) => state.auth.token);
  const isFetching = useRef(false);

  useEffect(() => {
    const getPrinters = async () => {
      if (isFetching.current) return; // Prevent double fetch
      isFetching.current = true;
      try {
        const data = await fetchPrinters(token); // Fetch printer data from API
        setPrinters(data);
      } catch (err) {
        setError("Failed to fetch printers. Please try again later.");
      }
    };

    getPrinters();
  }, []);

  // Filter printers based on campus and block props
  const filteredPrinters = printers.filter((printer) => {
    const matchesCampus = campus ? printer.Campus === campus : true;
    const matchesBlock = block ? printer.Building === block : true;
    return matchesCampus && matchesBlock;
  });

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (filteredPrinters.length === 0) {
    return (
      <div className="text-gray-500">
        No printers found for the selected campus and block.
      </div>
    );
  }

  //sort filteredPrinters by Prinwaiting

  filteredPrinters.sort((a, b) => {
    if (a.Status === "online" && b.Status !== "online") {
      return -1;
    }
    if (a.Status !== "online" && b.Status === "online") {
      return 1;
    }

    return a.printWaiting - b.printWaiting;
  });

  return (
    <div className="flex flex-wrap gap-8 justify-items-evenly item-center m-4 ">
      {filteredPrinters.map((printer) => (
        <div
          key={printer.ID}
          className="card bg-white shadow-md p-4 w-52 flex flex-col items-center border rounded-lg"
        >
          <div className=" ">
            {printer.Status === "online" ? (
              <OnlinePrinter className="h-16 w-16" />
            ) : printer.Status === "offline" ? (
              <OfflinePrinter className="h-16 w-16" />
            ) : (
              <MaintainingPrinter className="h-16 w-16" />
            )}
          </div>
          <div className="flex flex-col justify-center items-center mt-4 gap-1">
            <h2 className="text-lg font-bold ">{printer.Model}</h2>
            <p className="">{printer.Brand}</p>

            <p
              className={` text-sm ${
                printer.Status === "online" ? "text-green-500" : "text-red-500"
              }`}
            >
              Trạng thái: {printer.Status}
            </p>
            <p className=" text-sm">Floor: {printer.Floor}</p>
            <p className="text-sm text-red">
              Hàng đợi: {printer.printWaiting}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

PrinterList.propTypes = {
  campus: PropTypes.string,
  block: PropTypes.string,
};

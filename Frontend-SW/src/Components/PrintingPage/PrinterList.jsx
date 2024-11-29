import React, { useEffect, useState, useRef } from "react";
import { fetchPrinters } from "@/API/usedAPI";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/Auth/authSlice";
import PropTypes from "prop-types";
import MaintainingPrinter from "@/assets/maintainingPrinter.svg?react";
import OnlinePrinter from "@/assets/onlinePrinter.svg?react";
import OfflinePrinter from "@/assets/offlinePrinter.svg?react";
import { addNotificationWithTimeout } from "@/features/Notification/toastNotificationSlice";

export const PrinterList = ({ campus, block, selectedPrinter, onSelectPrinter }) => {
  const [printers, setPrinters] = useState([]);
  const [error, setError] = useState("");
  const [filteredPrinters, setFilteredPrinters] = useState([]);
  const token = useSelector((state) => state.auth.token);
  
  

  const isFetching = useRef(false);
  const dispatch = useDispatch();

  // Fetch printers from API
  useEffect(() => {
    const getPrinters = async () => {
      if (isFetching.current) return; // Prevent double fetch
      isFetching.current = true;
      try {
        const data = await fetchPrinters(token); // Fetch printer data from API
        setPrinters(data);
        setError(""); // Clear any previous error
      } catch (err) {
        if (err.code === 401) {
          console.error(err.message);
          dispatch(logout());
          dispatch(
            addNotificationWithTimeout({
              message: "You have been logged out.",
              type: "info",
            })
          );
        } else {
          console.error("An unexpected error occurred:", err);
        }
        setError("Failed to fetch printers. Please try again later.");
      } finally {
        isFetching.current = false; // Reset fetching state
      }
    };

    getPrinters();
  }, [token, dispatch]);

 
  useEffect(() => {
    let filtered = printers.filter((printer) => {
      const matchesCampus = campus ? printer.Campus === campus : true;
      const matchesBlock = block ? printer.Building === block : true;
      return matchesCampus && matchesBlock;
    });

    
    filtered.sort((a, b) => {
      if (a.Status === "online" && b.Status !== "online") {
        return -1;
      }
      if (a.Status !== "online" && b.Status === "online") {
        return 1;
      }
      return a.printWaiting - b.printWaiting;
    });

    setFilteredPrinters(filtered);
  }, [printers, campus, block]);

 
  useEffect(() => {
    if (selectedPrinter) {
      const foundPrinter = printers.find(
        (printer) => printer.ID === selectedPrinter.ID
      );

      if (foundPrinter) {
        console.log("Selected printer details:", foundPrinter);
        setFilteredPrinters((prevPrinters) => {
          
          if (prevPrinters.length === 1 && prevPrinters[0].ID === foundPrinter.ID) {
            return prevPrinters;
          }
          return [foundPrinter];
        });
      }
    } else {
      
      setFilteredPrinters(printers);
    }
  }, [selectedPrinter, printers]);

  const handleSelectPrinter = (printer) => {
    onSelectPrinter(printer);
  };

  if (!campus || !block) {
    return <div className="text-gray-500">Chọn campus và block để tìm máy in.</div>;
  }

  


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

  return (
    <div className="flex justify-center items-center m-2">
      <div className="flex flex-wrap gap-8 justify-center">
        {filteredPrinters.map((printer) => (
          <div
            key={printer.ID}
            className={`card hover:scale-110 hover:bg-lime-200 transition-all duration-500 bg-white shadow-md p-4 w-52 justify-center items-center border rounded-lg ${
              printer.ID === selectedPrinter?.ID ? "border-green-500" : ""
            }`}
          >
            <div>
              {printer.Status === "online" ? (
                <OnlinePrinter className="h-16 w-16" />
              ) : printer.Status === "offline" ? (
                <OfflinePrinter className="h-16 w-16" />
              ) : (
                <MaintainingPrinter className="h-16 w-16" />
              )}
            </div>
            <div className="flex flex-col justify-center items-center mt-4 gap-1">
              <h2 className="text-lg font-bold">{printer.Model}</h2>
              <p>{printer.Brand}</p>
              <p
                className={`text-sm ${
                  printer.Status === "online"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Trạng thái: {printer.Status}
              </p>
              <p className="text-sm">Floor: {printer.Floor}</p>
              <p className="text-sm text-red">
                Hàng đợi: {printer.printWaiting}
              </p>
            </div>
            <div className="card-actions justify-end mt-2">
              <button
                className={`btn btn-sm btn-success ${
                  printer.Status !== "online" ? "cursor-not-allowed" : ""
                }`}
                onClick={() => handleSelectPrinter(printer)}
                disabled={printer.Status !== "online"}
              >
                {printer.ID === selectedPrinter?.ID ? "Đã chọn" : "Chọn"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

PrinterList.propTypes = {
  campus: PropTypes.string,
  block: PropTypes.string,
  selectedPrinter: PropTypes.object,
  onSelectPrinter: PropTypes.func.isRequired,
};

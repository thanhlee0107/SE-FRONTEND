import React, { useEffect, useState, useRef } from "react";
import { fetchPrinters, updatePrinter, deletePrinter } from "@/API/usedAPI";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/Auth/authSlice";
import PropTypes from "prop-types";
import MaintainingPrinter from "@/assets/maintainingPrinter.svg?react";
import OnlinePrinter from "@/assets/onlinePrinter.svg?react";
import OfflinePrinter from "@/assets/offlinePrinter.svg?react";
import { addNotificationWithTimeout } from "@/features/Notification/toastNotificationSlice";
import { PrinterLog } from "./PrinterLog"; // Assuming PrinterLog is imported

export const PrinterList = ({ campus, block }) => {
  const [printers, setPrinters] = useState([]);
  const [error, setError] = useState("");
  const [filteredPrinters, setFilteredPrinters] = useState([]);
  const [modal, setModal] = useState(null); // For managing modals
  const [logPrinter, setLogPrinter] = useState(null); // For showing printer logs
  const token = useSelector((state) => state.auth.token);
  const isFetching = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPrinters = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      try {
        const data = await fetchPrinters(token);
        setPrinters(data);
        setError("");
      } catch (err) {
        if (err.code === 401) {
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
        isFetching.current = false;
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

  const handleUpdateStatus = async (printerId, newStatus) => {
    try {
      await updatePrinter(printerId, { Status: newStatus }, token);
      setPrinters((prev) =>
        prev.map((printer) =>
          printer.ID === printerId ? { ...printer, Status: newStatus } : printer
        )
      );
      dispatch(
        addNotificationWithTimeout({
          message: `Printer status updated to ${newStatus}.`,
          type: "success",
        })
      );
    } catch (err) {
      console.error("Failed to update printer:", err);
    }
    setModal(null);
  };

  const handleDeletePrinter = async (printerId) => {
    try {
      await deletePrinter(printerId, token);
      setPrinters((prev) => prev.filter((printer) => printer.ID !== printerId));
      dispatch(
        addNotificationWithTimeout({
          message: "Printer deleted successfully.",
          type: "success",
        })
      );
    } catch (err) {
      console.error("Failed to delete printer:", err);
    }
    setModal(null);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (filteredPrinters.length === 0) {
    return <div className="text-gray-500">No printers found for the selected campus and block.</div>;
  }

  return (
    <div className="flex justify-center items-center m-2">
      <div className="flex flex-wrap gap-8 justify-center">
        {filteredPrinters.map((printer) => (
          <div
            key={printer.ID}
            className="card relative group hover:scale-105 transition-all duration-300 bg-white shadow-md p-4 w-60 border rounded-lg flex flex-col justify-between items-center"
          >
            {/* Delete Button - Visible on Hover */}
            <button
              className="absolute top-2 right-2 btn btn-sm btn-danger opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() =>
                setModal({
                  type: "delete",
                  printer,
                })
              }
            >
              Xóa
            </button>

            {/* Printer Icon */}
            <div className="mb-4 flex justify-center">
              {printer.Status === "online" ? (
                <OnlinePrinter className="h-16 w-16" />
              ) : printer.Status === "offline" ? (
                <OfflinePrinter className="h-16 w-16" />
              ) : (
                <MaintainingPrinter className="h-16 w-16" />
              )}
            </div>

            {/* Printer Details */}
            <div className="text-center">
              <h2 className="text-lg font-bold">{printer.Model}</h2>
              <p>{printer.Brand}</p>
              <p
                className={`text-sm ${
                  printer.Status === "online" ? "text-green-500" : "text-red-500"
                }`}
              >
                Trạng thái: {printer.Status}
              </p>
              <p className="text-sm">Tầng: {printer.Floor}</p>
              <p className="text-sm text-red">Hàng đợi: {printer.printWaiting}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 w-full">
              <button
                className="btn btn-sm btn-outline w-full mb-2"
                onClick={() => setLogPrinter(printer)}
              >
                Xem lịch sử
              </button>
              <button
                className="btn btn-sm btn-outline w-full"
                onClick={() =>
                  setModal({
                    type: "update",
                    printer,
                  })
                }
              >
                Chuyển đổi trạng thái
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for status update and deletion */}
      {modal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold mb-4">
              {modal.type === "update"
                ? "Change Printer State"
                : "Delete Printer"}
            </h3>
            {modal.type === "update" ? (
              <div className="flex flex-col gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleUpdateStatus(modal.printer.ID, "online")}
                >
                  Trạng thái Online
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() =>
                    handleUpdateStatus(modal.printer.ID, "maintaining")
                  }
                >
                  Trạng thái Maintaining
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleUpdateStatus(modal.printer.ID, "offline")}
                >
                  Trạng thái Offline
                </button>
              </div>
            ) : (
              <p>Bạn có chắc là muốn xóa máy in?</p>
            )}
            <div className="modal-action">
              {modal.type === "delete" && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeletePrinter(modal.printer.ID)}
                >
                  Có, Xóa luôn
                </button>
              )}
              <button className="btn btn-sm btn-outline" onClick={() => setModal(null)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for printer log */}
      {logPrinter && (
        <PrinterLog
          printerID={logPrinter.ID}
          setmodal={() => setLogPrinter(null)}
        />
      )}
    </div>
  );
};

PrinterList.propTypes = {
  campus: PropTypes.string,
  block: PropTypes.string,
};

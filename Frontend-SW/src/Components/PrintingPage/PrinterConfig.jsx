import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { addNotification } from "@/features/Notification/toastNotificationSlice";
import {PrinterQuery} from "@/Components/PrintingPage/PrinterQuery";
const printers = [
  { name: "Máy in 1", queue: 20 },
  { name: "Máy in 2", queue: 15 },
  { name: "Máy in 3", queue: 0 },
  { name: "Máy in 4", queue: 25 },
  { name: "Máy in 5", queue: 5 },
  { name: "Máy in 6", queue: 20 },
  { name: "Máy in 7", queue: 0 },
  { name: "Máy in 8", queue: 12 },
];

export const PrinterConfig = () => {
  const [copies, setCopies] = useState("");
  const [printType, setPrintType] = useState("");
  const [pageNum, setPageNum] = useState(0);
  const [usablePages, setUsablePages] = useState(0);
  const [remainingPages, setRemainingPages] = useState(0);


  const pageNumOfFile = useSelector((state) => state.PrintForm.PageNumber);
  const dispatch = useDispatch();

  const fetchUsablePages = async () => {
    try {
      const response = await fetch("/api/usable-pages");
      const data = await response.json();
      setUsablePages(data.usablePages);
    } catch (error) {
      console.error("Error fetching usable pages:", error);
    }
  };

  // Fetch usable pages from the backend
  useEffect(() => {
    fetchUsablePages();
  }, []);

  // Calculate total pages and remaining pages
  useEffect(() => {
    let totalPage = copies * pageNumOfFile;

    if (printType === "Double") {
      totalPage = Math.ceil(totalPage / 2);
    }

    setPageNum(totalPage);

    const remaining = usablePages - totalPage;
    setRemainingPages(remaining);

    if (remaining < 0) {
      dispatch(addNotification({id: Date.now(),message: "Số trang còn lại không đủ", type: "error"}));
    } 
  }, [copies, printType, pageNumOfFile, usablePages]);

  return (
    <div className="p-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-8 ">
          {/* Number of Copies */}
          <div className="form-control">
            <label className="label font-semibold">Số bản sao</label>
            <input
              type="number"
              placeholder="Nhập số bản sao"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              className="input input-bordered w-full input-sm"
              required
            />
          </div>

          {/* Print Type */}
          <div className="form-control">
            <label className="label font-semibold">Kiểu In</label>
            <select
              value={printType}
              onChange={(e) => setPrintType(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="" disabled selected>
                Chọn kiểu in
              </option>
              <option value="Single">Một Mặt</option>
              <option value="Double">Hai Mặt</option>
            </select>
          </div>
        </div>

        {/* Total Pages, Usable Pages, and Remaining Pages */}
        <div className="flex flex-row gap-6 ">
          {/* Total Pages */}
          <div className="flex flex-col justify-center items-center">
            <label className="label font-semibold">Tổng số trang (A4)</label>
            <div className="badge badge-lg p-4 bg-blue-gray-200">{pageNum}</div>
          </div>

          {/* Usable Pages */}
          <div className="flex flex-col justify-center items-center">
            <label className="label font-semibold">Số trang khả dụng  (A4)</label>
            <div className="flex flex-row justify-center items-center gap-2">
              <div className="badge badge-lg p-4 bg-blue-gray-200">
                {usablePages}
              </div>
              <button
                className="btn btn-circle btn-xs "
                onClick={fetchUsablePages} // Reload usable pages on button click
              >
               <FontAwesomeIcon icon={faSync} />
              </button>
            </div>
          </div>

          {/* Remaining Pages */}
          <div className="flex flex-col justify-center items-center">
            <label className="label font-semibold">Số trang còn lại  (A4)</label>
            <div
              className={`badge badge-lg p-4 ${
                remainingPages < 0 ? "badge-error" : "badge-success"
              }`}
            >
              {remainingPages}
            </div>
          </div>
        </div>

        <PrinterQuery/>
      </div>

      </div>
  );
};

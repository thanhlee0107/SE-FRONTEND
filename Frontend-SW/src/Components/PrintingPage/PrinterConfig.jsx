import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { addNotification } from "@/features/Notification/toastNotificationSlice";
import { PrinterQuery } from "@/Components/PrintingPage/PrinterQuery";
import { modify } from "@/features/Printing/PrintForm";
import {
  goToStep,
  markCompleted,
  markUncompleted,
} from "@/features/PrintingStep/printingStepSlice";

export const PrinterConfig = () => {
  const [copies, setCopies] = useState("");
  const [printType, setPrintType] = useState("");
  const [pageNum, setPageNum] = useState(0);
  const [usablePages, setUsablePages] = useState(0);
  const [remainingPages, setRemainingPages] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [isReadytoPrint, setIsReadytoPrint] = useState(false);
  const [modalConfirmed, setModalConfirmed] = useState(false);

  const pageNumOfFile = useSelector((state) => state.PrintForm.PageNumber);
  const size = useSelector((state) => state.PrintForm.Size);
  const token = useSelector((state) => state.auth.token);
  const mssv = useSelector((state) => state.auth.mssv);
  const dispatch = useDispatch();
  const printForm = useSelector((state) => state.PrintForm);

  useEffect(() => {
    if (
      printForm.IDPrinter !== "" &&
      printForm.Name !== "" &&
      printForm.Type !== "" &&
      printForm.Amount !== 0 &&
      printForm.Size !== "" &&
      printForm.File !== null &&
      printForm.PageNumber !== 0
    ) {
      setIsReadytoPrint(true);
    } else {
      setIsReadytoPrint(false);
    }
  }, [printForm]);

  const fetchUsablePages = async (mssv, token) => {
    console.log(mssv);
    try {
      const response = await fetch(
        `http://localhost:3003/user/page-balance/${mssv}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data?.result?.pageBalance !== undefined) {
        setUsablePages(data.result.pageBalance);
      } else {
        console.error("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching usable pages:", error);
    }
  };

  // Fetch usable pages from the backend
  useEffect(() => {
    fetchUsablePages(mssv, token);
  }, [mssv, token]);

  // Calculate total pages and remaining pages
  useEffect(() => {
    let totalPage =
      size === "A3" ? copies * pageNumOfFile * 2 : copies * pageNumOfFile;

    if (printType === "Double") {
      totalPage = Math.ceil(totalPage / 2);
    }

    setPageNum(totalPage);

    const remaining = usablePages - totalPage;
    setRemainingPages(remaining);

    if (remaining < 0) {
      dispatch(
        addNotification({
          id: Date.now(),
          message: "Số trang còn lại không đủ",
          type: "error",
        })
      );
    }
  }, [copies, printType, usablePages]);

  const handleReset = () => {
    setReloadKey((prev) => prev + 1);
    dispatch(
      modify({
        IDPrinter: "",
        Amount: 0,
        Side: "Single",
      })
    );
    dispatch(markUncompleted(3));
  };
  const handleConfirm = () => {
    //Update the PrintForm state
    dispatch(
      modify({
        Amount: Number(copies),
        Side: printType === "Single" ? "Single" : "Double",
      })
    );
    setModalConfirmed(true);
  };
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
          <div className="form-control mr-2">
            <label className="label font-semibold">Kiểu In</label>
            <select
              value={printType}
              onChange={(e) => setPrintType(e.target.value)}
              className="select select-bordered select-sm"
            >
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
            <label className="label font-semibold">
              Số trang khả dụng (A4)
            </label>
            <div className="flex flex-row justify-center items-center gap-2">
              <div className="badge badge-lg p-4 bg-blue-gray-200">
                {usablePages}
              </div>
              <button
                className="btn btn-circle btn-xs "
                onClick={() => {
                  fetchUsablePages(mssv, token);
                }} // Reload usable pages on button click
              >
                <FontAwesomeIcon icon={faSync} />
              </button>
            </div>
          </div>

          {/* Remaining Pages */}
          <div className="flex flex-col justify-center items-center">
            <label className="label font-semibold">Số trang còn lại (A4)</label>
            <div
              className={`badge badge-lg p-4 ${
                remainingPages < 0 ? "badge-error" : "badge-success"
              }`}
            >
              {remainingPages}
            </div>
          </div>
        </div>

        <PrinterQuery key={reloadKey} />
        <div className=" flex flex-row justify-center gap-4 p-2">
          <button
            className="btn btn-sm btn-error"
            onClick={() => {
              handleReset();
            }}
          >
            Reset{" "}
          </button>
          <button
            className="btn btn-sm btn-neutral"
            onClick={() => {
              handleConfirm();
            }}
          >
            {" "}
            Xác Nhận
          </button>
          <button
            className="btn btn-sm btn-success"
            disabled={!(remainingPages >= 0 && isReadytoPrint)}
            onClick={() => {
              dispatch(goToStep(4));
              dispatch(markCompleted(3));
            }}
          >
            Tiến hành in
          </button>
        </div>
      </div>
      {modalConfirmed && (
  <div className="modal modal-open">
    <div className="modal-box w-80">
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-bold">Xác nhận IN</p>
        <button
          onClick={() => setModalConfirmed(false)}
          className="btn btn-sm btn-circle btn-error"
        >
          ✕
        </button>
      </div>

      {/* Modal Content */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Printer ID:</span>
          <span>{printForm.IDPrinter}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Số bản sao:</span>
          <span>{printForm.Amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Kiểu in:</span>
          <span>{printForm.Side==="Single"?"Một Mặt":"Hai Mặt"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Tổng số trang:</span>
          <span>{pageNum}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Số trang còn lại:</span>
          <span>{remainingPages}</span>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setModalConfirmed(false)}
          className="btn btn-success btn-sm"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

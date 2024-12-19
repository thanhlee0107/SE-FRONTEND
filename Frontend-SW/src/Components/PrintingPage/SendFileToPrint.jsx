import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPrint, faFile } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { sendFileToPrint, fetchPrinters } from "@/API/usedAPI";
import {
  markCompleted,
  resetAllSteps,
} from "@/features/PrintingStep/printingStepSlice";
import { reset } from "@/features/Printing/PrintForm";

export const SendFile = () => {
  const [modalResponse, setModalResponse] = useState(null);
  const [stages, setStages] = useState([]);
  const [progress, setProgress] = useState({
    queue: 0,
    sending: 0,
    printing: 0,
  });

  const [response, setResponse] = useState("");

  const dispatch = useDispatch();
  const printForm = useSelector((state) => state.PrintForm);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // Simulate stages of sending a file to print
    const timers = [
      setTimeout(() => setStages((prev) => [...prev, "queue"]), 0),
      setTimeout(() => setStages((prev) => [...prev, "sending"]), 5000),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  useEffect(() => {
    // Update progress for each stage
    const intervalIds = [];
    stages.forEach((stage) => {
      if (progress[stage] < 100) {
        const intervalId = setInterval(() => {
          setProgress((prev) => ({
            ...prev,
            [stage]: Math.min(prev[stage] + 0.1, 100),
          }));
        }, 5);
        intervalIds.push(intervalId);
        if (stage === "sending" && progress[stage] === 0) {
          sendFileToPrint(printForm, token)
            .then((res) => {
              setResponse(res.message);
            })
            .catch((err) => {
              setModalResponse(err.message);
            });
        }
      }
    });

    return () => intervalIds.forEach((id) => clearInterval(id));
  }, [stages]);

  useEffect(() => {
    if (response === "Yêu cầu in thành công") {
      setStages((prev) => [...prev, "printing"]);
    }
  }, [response]);

  const [printer, setPrinter] = useState({});
  useEffect(() => {
    fetchPrinters(token)
      .then((data) => {
        setPrinter(
          data.filter((printer) => printer.ID === printForm.IDPrinter)[0]
        );
      })
      .catch((err) => {
        setModalResponse(err.message);
      });
  }, []);

  useEffect(() => {
    if (progress.printing === 100) {
      dispatch(markCompleted(4));

      if (printer) {
        setModalResponse(
          `Vui lòng đến cơ sở ${printer.Campus[2]} tòa ${printer.Building} nhận file in bạn nhé !`
        );
      }

      dispatch(reset());
    }
  }, [progress.printing]);

  const handleReset = () => {
    dispatch(resetAllSteps());

    setModalResponse(null);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      {stages.includes("queue") && (
        <div className="flex flex-row items-end justify-between p-2 border rounded shadow-md bg-outerSpace">
          {/* Queue Section */}
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon className="w-6 h-6 text-white" icon={faUser} />
          </div>
          <div className="flex-grow flex flex-col gap-1 mx-4">
            <span className="text-sm text-gray-200 ">Đang trong hàng đợi</span>
            <progress
              className="progress progress-success w-full"
              value={progress.queue}
              max="100"
            ></progress>
          </div>
          <span className="text-sm text-gray-400 ml-2 mr-2">
            {Math.round(progress.queue)}/100
          </span>
        </div>
      )}

      {stages.includes("sending") && (
        <div className="flex flex-row items-end justify-between p-2 border rounded shadow-md bg-outerSpace">
          {/* Sending File Section */}
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon className="w-6 h-6 text-white" icon={faFile} />
          </div>
          <div className="flex-grow flex flex-col gap-1 mx-4">
            <span className="text-sm text-gray-200">
              {response === "" ? "Tiến hành gửi file" : response}
            </span>
            {response === "" ? (
              <progress
                className="progress progress-success w-full"
                max="100"
              ></progress>
            ) : null}
          </div>
        </div>
      )}

      {stages.includes("printing") && (
        <div className="flex flex-row items-end justify-between p-2 border rounded shadow-md bg-outerSpace">
          {/* Printing Section */}
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon className="w-6 h-6 text-white" icon={faPrint} />
          </div>
          <div className="flex-grow flex flex-col gap-1 mx-4">
            <span className="text-sm text-gray-200">
              {Math.round(progress.printing) !== 100
                ? "File đang in"
                : " Đã in xong"}
            </span>
            {Math.round(progress.printing) !== 100 ? (
              <progress
                className="progress progress-success w-full"
                max="100"
              ></progress>
            ) : null}
          </div>
        </div>
      )}

      {modalResponse && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Thông báo</h3>
            <p className="py-4">{modalResponse}</p>
            <div className="modal-action">
              <button onClick={() => handleReset()} className="btn btn-neutral">
                {progress.printing === 100 ? "OK" : "Đóng"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPrint, faFile } from "@fortawesome/free-solid-svg-icons";

export const SendFile = () => {
  const [modalResponse, setModalResponse] = useState(null);
  const [stages, setStages] = useState([]);
  const [progress, setProgress] = useState({
    queue: 0,
    sending: 0,
    printing: 0,
  });

  useEffect(() => {
    // Simulate stages of sending a file to print
    const timers = [
      setTimeout(() => setStages((prev) => [...prev, "queue"]), 0),
      setTimeout(() => setStages((prev) => [...prev, "sending"]), 5000),
      setTimeout(() => setStages((prev) => [...prev, "printing"]), 10000),
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
          console.log("Send API request to server to send file to printer");
        }
      }
    });

    return () => intervalIds.forEach((id) => clearInterval(id));
  }, [stages]);

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
            <span className="text-sm text-gray-200">Tiến hành gửi file</span>
            <progress
              className="progress progress-success w-full"
              value={progress.sending}
              max="100"
            ></progress>
          </div>
          <span className="text-sm text-gray-400 ml-2 mr-2">
            {Math.round(progress.sending)}%
          </span>
        </div>
      )}

      {stages.includes("printing") && (
        <div className="flex flex-row items-end justify-between p-2 border rounded shadow-md bg-outerSpace">
          {/* Printing Section */}
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon className="w-6 h-6 text-white" icon={faPrint} />
          </div>
          <div className="flex-grow flex flex-col gap-1 mx-4">
            <span className="text-sm text-gray-200">File đang in</span>
            <progress
              className="progress progress-success w-full"
              value={progress.printing}
              max="100"
            ></progress>
          </div>
          <span className="text-sm text-gray-400 ml-2 mr-2">
            {Math.round(progress.printing)}%
          </span>
        </div>
      )}

      {modalResponse && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Response</h3>
            <p className="py-4">{modalResponse}</p>
            <div className="modal-action">
              <button
                onClick={() => setModalResponse(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

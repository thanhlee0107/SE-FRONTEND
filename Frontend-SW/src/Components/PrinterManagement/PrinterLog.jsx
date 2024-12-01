import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const PrinterLog = ({ printerID, setmodal }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("2024-11-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const token = useSelector((state) => state.auth.token);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      page: 1,
      limit: 10,
    });

    try {
      const response = await fetch(
        `http://localhost:3003/history/printer/date/${printerID}?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error((await response.text()) || "Error fetching data");
      }

      const data = await response.json();
      setHistory(data.history);
    } catch (err) {
      setError("Không tìm thấy lịch sử máy in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [startDate, endDate]);

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white text-black">
        <h3 className="text-lg font-bold mb-4 text-center">Lịch sử Máy In</h3>

        <div className="flex flex-col gap-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold">
                Ngày Bắt Đầu
              </label>
              <input
                type="date"
                id="startDate"
                className="input input-bordered w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                id="endDate"
                className="input input-bordered w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-outline w-full" onClick={fetchHistory}>
            Xem lịch sử
          </button>
        </div>

        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}
        {!loading && !error && history.length > 0 && (
          <ul className="space-y-4">
            {history.map((logItem, index) => (
              <li
                key={index}
                className="bg-white shadow-md rounded-lg p-4 border"
              >
                <div className="flex flex-wrap justify-between">
                  <p>
                    <span className="font-semibold">Tên File:</span> {logItem.FileName}
                  </p>
                  <p>
                    <span className="font-semibold">Ngày In:</span> {logItem.Date}
                  </p>
                </div>
                <p>
                  <span className="font-semibold">Trạng Thái:</span> {logItem.Status}
                </p>
                <p>
                  <span className="font-semibold">MSSV Người In:</span> {logItem.MSSV}
                </p>
                <p>
                  <span className="font-semibold">Cơ sở:</span> {logItem.Campus}
                </p>
                <p>
                  <span className="font-semibold">Tòa:</span> {logItem.Building}
                </p>
                <p>
                  <span className="font-semibold">Tầng:</span> {logItem.Floor}
                </p>
                <p>
                  <span className="font-semibold">Báo cáo:</span> {logItem.Report ? "Có" : "Không"}
                </p>
                <p>
                  <span className="font-semibold">Tổng Số Trang:</span> {logItem.Amount}
                </p>
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && history.length === 0 && (
          <p className="text-center text-gray-500">Không có lịch sử nào được tìm thấy.</p>
        )}
        <div className="text-center mt-6">
          <button
            className="btn btn-outline"
            onClick={() => setmodal(false)}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

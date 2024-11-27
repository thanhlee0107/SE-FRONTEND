import React, { useState } from "react";
import { useEffect } from "react";
import { PDFDocument, degrees, rgb } from "pdf-lib";
import { addNotificationWithTimeout } from "@/features/Notification/toastNotificationSlice";
import { useDispatch } from "react-redux";
const checkValuesNotNull = (values) => {
  for (const [key, value] of values.entry()) {
    if (value === null || value === undefined || value === "") {
      console.error(`The value for "${key}" is missing or invalid:`, value);
      return false;
    }
  }
  return true;
};

const PrintForm = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [layout, setLayout] = useState("Portrait");
  const [paperSize, setPaperSize] = useState("A4");
  const [pagesPerSheet, setPagesPerSheet] = useState("Mặc Định");
  const [color, setColor] = useState("Đen Trắng");
  const [scale, setScale] = useState("fit với khung in");
  const [customScale, setCustomScale] = useState("");
  const [pageSelection, setPageSelection] = useState("Tất cả trang");
  const [customPageSelection, setCustomPageSelection] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const dispatch = useDispatch();

  // Function to read all files from IndexedDB
  const fetchFilesFromIndexedDB = () => {
    const request = indexedDB.open("FileStorage", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("files")) {
        console.error("Object store 'files' does not exist.");
        return;
      }

      const transaction = db.transaction("files", "readonly");
      const store = transaction.objectStore("files");

      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => {
        setFiles(getAllRequest.result); // Update state with fetched files
      };

      getAllRequest.onerror = (err) => {
        console.error("Failed to retrieve files:", err);
      };
    };

    request.onerror = () => {
      console.error("Failed to open IndexedDB.");
    };
  };

  // Fetch files when the component loads
  useEffect(() => {
    fetchFilesFromIndexedDB();
  }, []);

  // Handle file selection from the list
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (setPreviewUrl) => {
    if (!files || files.length === 0) {
      alert("Please upload a file first!");
      return;
    }

    console.log({
      layout,
      paperSize,
      color,
      scale,
      customScale,
      pageSelection,
      customPageSelection,
      pagesPerSheet,
    });

    const file = selectedFile;
    if (!file) {
      dispatch(
        addNotificationWithTimeout({
          message: "Please select a file first!",
          type: "error",
        })
      );
      return;
    }

    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
    if (!isPDF) {
      dispatch(
        addNotificationWithTimeout({
          message: "The uploaded file is not a PDF file, it will pass through the printer as is.",
          type: "info",
        })
      );
      return;
    }

    try {
      const arrayBuffer = await file.content.arrayBuffer();
      let pdfDoc = await PDFDocument.load(arrayBuffer);
      const targetDimensions =
        paperSize === "A4"
          ? layout === "Portrait"
            ? { width: 595.28, height: 841.89 }
            : { width: 841.89, height: 595.28 }
          : layout === "Portrait"
          ? { width: 841.89, height: 1190.55 }
          : { width: 1190.55, height: 841.89 };

      const { width: targetWidth, height: targetHeight } = targetDimensions;

      // Step 1: Handle Scale
      if (scale === "Fit với khung in") {
        const scaleDoc = await PDFDocument.create();

        for (const [index, page] of pdfDoc.getPages().entries()) {
          const [copiedPage] = await scaleDoc.copyPages(pdfDoc, [index]);
          const { width, height } = copiedPage.getSize();

          if (width <= 0 || height <= 0) {
            console.error("Invalid page dimensions:", { width, height });
            continue; // Skip invalid pages
          }

          const isSourceLandscape = width > height;
          
          const isTargetLandscape = targetWidth > targetHeight;
          console.log("Is target landscape:", isTargetLandscape)

          const scaleX =
            isSourceLandscape !== isTargetLandscape
              ? targetWidth / width
              : targetHeight / height;
          console.log(targetWidth, targetHeight, width, height)
        console.log("Scale X:", scaleX)
          const scaleY =
            isSourceLandscape !== isTargetLandscape
              ? targetHeight / height
              : targetWidth / width;
             
          const scaleFactor = Math.min(scaleX, scaleY);
          
          copiedPage.scaleContent(scaleFactor, scaleFactor);

          const offsetX = (targetWidth - width * scaleFactor) / 2;
          const offsetY = (targetHeight - height * scaleFactor) / 2;
          copiedPage.translateContent(offsetX, offsetY);

          copiedPage.setSize(targetWidth, targetHeight);
          scaleDoc.addPage(copiedPage);
        }

        pdfDoc = scaleDoc;
      } else if (scale === "custom" && customScale) {
        const scaleDoc = await PDFDocument.create();
        const scaleFactor = parseFloat(customScale);

        if (isNaN(scaleFactor) || scaleFactor <= 0) {
          console.error("Invalid custom scale factor:", customScale);
          return;
        }

        for (const [index, page] of pdfDoc.getPages().entries()) {
          const [copiedPage] = await scaleDoc.copyPages(pdfDoc, [index]);
          copiedPage.scaleContent(scaleFactor, scaleFactor);
          const { width, height } = copiedPage.getSize();
          const offsetX = (targetWidth - width * scaleFactor) / 2;
          const offsetY = (targetHeight - height * scaleFactor) / 2;
          copiedPage.translateContent(offsetX, offsetY);
          copiedPage.setSize(targetWidth, targetHeight);
          scaleDoc.addPage(copiedPage);
        }

        pdfDoc = scaleDoc;
      }

      // Step 2: Handle Pages Per Sheet
      if (pagesPerSheet && pagesPerSheet !== "Mặc Định") {
        const perSheet = parseInt(pagesPerSheet);
        const perSheetPdfDoc = await PDFDocument.create();

        const { width: paperWidth, height: paperHeight } =
          paperSize === "A4"
            ? { width: 595.28, height: 841.89 }
            : { width: 841.89, height: 1190.55 };

        const rows = perSheet === 2 ? 1 : perSheet === 4 ? 2 : 4;
        const cols = perSheet / rows;
        const cellWidth = paperWidth / cols;
        const cellHeight = paperHeight / rows;

        for (let i = 0; i < pdfDoc.getPageCount(); i += perSheet) {
          const newPage = perSheetPdfDoc.addPage([paperWidth, paperHeight]);

          for (let j = 0; j < perSheet && i + j < pdfDoc.getPageCount(); j++) {
            // Embed the page instead of copying
            const originalPage = pdfDoc.getPages()[i + j];
            const embeddedPage = await perSheetPdfDoc.embedPage(originalPage);

            const x = (j % cols) * cellWidth;
            const y = paperHeight - Math.floor(j / cols + 1) * cellHeight;

            newPage.drawPage(embeddedPage, {
              x,
              y,
              width: cellWidth,
              height: cellHeight,
            });
          }
        }

        // Update currentPdfDoc to use the new multi-page document
        pdfDoc = perSheetPdfDoc;
      }

      // Step 3: Handle Page Selection
      let selectedPages = [];
      if (pageSelection === "Tất cả trang") {
        selectedPages = Array.from(
          { length: pdfDoc.getPageCount() },
          (_, i) => i
        );
      } else if (pageSelection === "In trang chẵn") {
        selectedPages = Array.from(
          { length: pdfDoc.getPageCount() },
          (_, i) => i
        ).filter((page) => (page + 1) % 2 === 0);
      } else if (pageSelection === "In Trang Lẻ") {
        selectedPages = Array.from(
          { length: pdfDoc.getPageCount() },
          (_, i) => i
        ).filter((page) => (page + 1) % 2 !== 0);
      } else if (pageSelection === "Custom") {
        selectedPages = customPageSelection.split(",").flatMap((range) => {
          const [start, end] = range.split("-").map(Number);
          if (isNaN(start) || (end && isNaN(end))) {
            console.error(`Invalid page range: ${range}`);
            return [];
          }
          return end
            ? Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i)
            : [start - 1];
        });
      }

      const totalPageCount = pdfDoc.getPageCount();
      selectedPages = selectedPages.filter(
        (index) => index >= 0 && index < totalPageCount
      );

      const finalPdfDoc = await PDFDocument.create();

      try {
        const copiedPages = await finalPdfDoc.copyPages(pdfDoc, selectedPages);

        copiedPages.forEach((page) => finalPdfDoc.addPage(page));
      } catch (err) {
        console.error("Error during page copying:", err);
        return;
      }

      // Step 4: Handle Layout (Landscape/Portrait)
      if (layout === "Landscape") {
        finalPdfDoc.getPages().forEach((page) => page.setRotation(degrees(90)));
      }

      // Step 5: Handle Color

      // Final Save
      const modifiedPdfBytes = await finalPdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPreviewUrl(url);
      console.log("PDF processing completed.");
    } catch (error) {
      console.error("Error during PDF processing:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col mb-2">
        <h3 className="text-base font-semibold">Danh sách file đã tải lên</h3>
        <div className="dropdown mt-2 ">
          <label tabIndex={0} className="rounded-md bg-gray-500 p-2">
            {selectedFile ? selectedFile.name : "Chọn file đã tải lên"}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-white z-[1] rounded-b-md w-[40%] shadow gap-2"
          >
            {files.length > 0 ? (
              files.map((file, index) => (
                <li
                  key={file.id}
                  className={`cursor-pointer text-base p-2 ${
                    selectedFile && selectedFile.id === file.id
                      ? "bg-gray-500 text-white font-base rounded-lg"
                      : ""
                  } hover:bg-outerSpace hover:text-white hover:rounded-lg`}
                  onClick={() => handleFileSelect(file)}
                >
                  {index + 1}. {file.name}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">
                Chưa có file nào được tải lên.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-x-16 ">
        {/* Layout */}
        <div className="form-control">
          <label className="label font-semibold">Layout</label>
          <select
            className="select select-bordered select-sm text-base"
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
          >
            <option disabled selected value="">
              Chọn layout
            </option>
            <option value="Landscape">Landscape</option>
            <option value="Portrait">Portrait</option>
          </select>
        </div>

        {/* Paper Size */}
        <div className="form-control">
          <label className="label font-semibold">Khổ giấy</label>
          <select
            className="select select-bordered select-sm"
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
          >
            <option disabled selected value="">
              Chọn khổ giấy
            </option>
            <option value="A3">A3</option>
            <option value="A4">A4</option>
          </select>
        </div>

        {/* Pages Per Sheet */}
        <div className="form-control">
          <label className="label font-semibold">Số trang trên 1 tờ</label>
          <select
            className="select select-bordered select-sm"
            value={pagesPerSheet}
            onChange={(e) => setPagesPerSheet(e.target.value)}
          >
            <option value="Mặc Định">Mặc Định</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="8">8</option>
          </select>
        </div>

        {/* Color */}
        <div className="form-control">
          <label className="label font-semibold">Màu In</label>
          <select
            className="select select-bordered select-sm"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option disabled selected value="">
              Chọn Màu
            </option>
            <option value="Đen Trắng">Đen Trắng</option>
            <option value="Màu">Màu</option>
          </select>
        </div>

        {/* Scale */}
        <div className="form-control">
          <label className="label font-semibold">Tỉ lệ</label>
          <select
            className="select select-bordered select-sm"
            value={scale}
            onChange={(e) => setScale(e.target.value)}
          >
            <option value="Fit với khung in">Fit với khung in</option>
            <option value="Kích thước thực">Kích thước thực</option>
            <option value="custom">Custom</option>
          </select>
          {scale === "custom" && (
            <input
              type="text"
              className="input input-sm input-bordered mt-4"
              placeholder="Nhập tỉ lệ"
              value={customScale}
              onChange={(e) => setCustomScale(e.target.value)}
            />
          )}
        </div>

        {/* Page Selection */}
        <div className="form-control">
          <label className="label font-semibold ">Chọn trang</label>
          <select
            className="select select-bordered select-sm"
            value={pageSelection}
            onChange={(e) => setPageSelection(e.target.value)}
          >
            <option value="Tất cả trang">Tất cả trang</option>
            <option value="In trang chẵn">In trang chẵn</option>
            <option value="In Trang Lẻ">In Trang Lẻ</option>
            <option value="Custom">Custom</option>
          </select>
          {pageSelection === "Custom" && (
            <input
              type="text"
              className="input input-sm input-bordered mt-4"
              placeholder="Nhập trang, Ex: 2-200,300-400"
              value={customPageSelection}
              onChange={(e) => setCustomPageSelection(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          className="btn btn-success"
          onClick={() => handleSubmit(setPreviewUrl)}
        >
          Preview
        </button>
        {previewUrl && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">PDF Preview</h3>
              <iframe
                src={previewUrl}
                className="w-full h-96"
                frameBorder="0"
                title="PDF Preview"
              ></iframe>
              <div className="modal-action">
                <button className="btn" onClick={() => setPreviewUrl(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <button className="btn btn-error" onClick={() => alert("Confirmed!")}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PrintForm;

import React, { useState } from "react";
import { useEffect } from "react";
import { PDFDocument, degrees, rgb } from "pdf-lib";
import { addNotificationWithTimeout } from "@/features/Notification/toastNotificationSlice";
import { useDispatch,useSelector } from "react-redux";
import { original } from "@reduxjs/toolkit";
import { modify,reset } from "@/features/Printing/PrintForm";
import {
  goToStep,
  markCompleted,
  markUncompleted,
} from "@/features/PrintingStep/printingStepSlice";

import { truncateFileName } from "@/utils/helpers";


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
  const [filetoSend, setFiletoSend] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [pageCount, setPageCount] = useState(0);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const isCompleted = useSelector((state) => state.steps.steps[1].completed);
  const isCurrent=(useSelector((state) => state.steps.currentStep === 2))

  const handleSelectAndClose = (file) => {
    handleFileSelect(file); // Call the selection handler
    setIsDropdownOpen(false); // Close the dropdown
  };

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

  const handlePreview = async (setPreviewUrl) => {
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
    console.log("Selected file:", file);
    const isImage =
      file.type.startsWith("image/") ||
      file.name.endsWith(".png") ||
      file.name.endsWith(".jpeg");

    // Handle image preview
    if (isImage) {
      const url = URL.createObjectURL(file.content);
      setPreviewUrl(url);
      setFiletoSend(url);
      setPageCount(1);
      console.log("Image preview URL generated.");
      return;
    }

    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
    if (!isPDF) {
      dispatch(
        addNotificationWithTimeout({
          message:
            "The uploaded file is not a PDF file, it will pass through the printer as is.",
          type: "info",
        })
      );
      return;
    }

    try {
      const arrayBuffer = await file.content.arrayBuffer();
      let pdfDoc = await PDFDocument.load(arrayBuffer);
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

      pdfDoc = finalPdfDoc;

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

          const scaleX =
            isSourceLandscape !== isTargetLandscape
              ? targetWidth / width
              : targetHeight / height;

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
            ? layout === "Portrait"
              ? { width: 595.28, height: 841.89 }
              : { width: 841.89, height: 595.28 }
            : layout === "Portrait"
            ? { width: 841.89, height: 1190.55 }
            : { width: 1190.55, height: 841.89 };

        const rows = perSheet === 2 ? 1 : perSheet === 4 ? 2 : 4;
        const cols = perSheet / rows;
        const cellWidth = paperWidth / cols;
        const cellHeight = paperHeight / rows;

        for (let i = 0; i < pdfDoc.getPageCount(); i += perSheet) {
          const newPage = perSheetPdfDoc.addPage([paperWidth, paperHeight]);

          for (let j = 0; j < perSheet && i + j < pdfDoc.getPageCount(); j++) {
            // Embed the page instead of copying
            const originalPage = pdfDoc.getPages()[i + j];
            originalPage.setRotation(degrees(layout === "Landscape" ? 90 : 0));
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

      // Step 4: Handle Layout (Landscape/Portrait)
      if (layout === "Landscape") {
        pdfDoc.getPages().forEach((page) => page.setRotation(degrees(90)));
      }

      //get page number
      setPageCount(pdfDoc.getPageCount());

      // Step 5: Handle Color

      // Final Save
      const modifiedPdfBytes = await pdfDoc.save();

      const newFile = new File([modifiedPdfBytes], file.name, {
        type: "application/pdf",
      });

      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPreviewUrl(url);
      setFiletoSend(url);
      console.log("PDF processing completed.");
    } catch (error) {
      console.error("Error during PDF processing:", error);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setLayout("Portrait");
    setPaperSize("A4");
    setPagesPerSheet("Mặc Định");
    setColor("Đen Trắng");
    setScale("Fit với khung in");
    setCustomScale("");
    setPageSelection("Tất cả trang");
    setCustomPageSelection("");
    setPreviewUrl(null);
    setFiletoSend(null);
    dispatch(reset());
    dispatch(goToStep(2));
    dispatch(markUncompleted(2));
  };

  const handleFileSubmit = () => {
    dispatch(
      modify({
        File: filetoSend,
        Type: selectedFile.type,
        Color: color=== "Màu" ? true:false,
        Size: paperSize,
        Name: selectedFile.name,
        PageNumber: pageCount,
      })
    );
    dispatch(goToStep(3));
    dispatch(markCompleted(2));
  }

  return (
    <div className="p-2">
      <div className="flex flex-col mb-2">
        <label className="label font-semibold">Danh sách file đã tải lên</label>
        <div className="dropdown mt-2 relative">
          <label
            tabIndex={0}
            className="rounded-md bg-gray-500 p-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            {selectedFile ? truncateFileName(selectedFile.name) : "Chọn file đã tải lên"}
          </label>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white z-[1] rounded-b-md shadow gap-2 absolute "
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
                    onClick={() => handleSelectAndClose(file)}
                  >
                    {index + 1}. {truncateFileName(file.name)}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">
                  Chưa có file nào được tải lên.
                </li>
              )}
            </ul>
          )}
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
      <div className="flex flex-row justify-center gap-4 mt-6">
        <button
          className="btn btn btn-sm"
          onClick={() => handlePreview(setPreviewUrl)}
          disabled={!((!isCompleted)&&isCurrent)}
        >
          Xác nhận cài đặt
        </button>
        {previewUrl && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Preview</h3>
              {selectedFile.type === "application/pdf" ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-96"
                  frameBorder="0"
                  title="PDF Preview"
                ></iframe>
              ) : (
                <img
                  src={previewUrl}
                  alt="Image Preview"
                  className="w-full h-96 object-contain"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              )}
              <div className="modal-action">
                <button
                  className="btn btn-sm"
                  onClick={() => setPreviewUrl(null)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        <button className="btn btn-error btn-sm" onClick={() => handleReset()}>
          Reset
        </button>
        <button
          className="btn btn-success btn-sm"
          onClick={() => handleFileSubmit()}
          disabled={!(selectedFile && filetoSend)}
          style={{
            cursor: filetoSend && selectedFile ? "pointer" : "not-allowed",
          }}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default PrintForm;

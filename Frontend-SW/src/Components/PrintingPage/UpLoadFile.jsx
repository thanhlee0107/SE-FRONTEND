import React, { useState, useEffect } from "react";
import { addNotificationWithTimeout } from "@/features/Notification/toastNotificationSlice";
import { useDispatch } from "react-redux";
import UploadIcon from "@/assets/IconUpload.svg?react";
import FileIcon from "@/assets/FileIcon.svg?react";
import {
  goToStep,
  markCompleted,
  markUncompleted,
} from "@/features/PrintingStep/printingStepSlice";
const FileUploadWithDragAndDrop = () => {
  const [files, setFiles] = useState([]); // State for displaying files
  const [db, setDb] = useState(null); // IndexedDB instance
  const [isDragging, setIsDragging] = useState(false); // Dragging state

  const dispatch = useDispatch();

  // Initialize IndexedDB
  useEffect(() => {
    const request = indexedDB.open("FileStorage", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      setDb(event.target.result);
      loadFilesFromIndexedDB(event.target.result);
    };

    request.onerror = () => {
      console.error("Failed to open IndexedDB");
    };
  }, []);

  // Load files from IndexedDB
  const loadFilesFromIndexedDB = (db) => {
    const transaction = db.transaction("files", "readonly");
    const store = transaction.objectStore("files");
    const request = store.getAll();

    request.onsuccess = () => {
      setFiles(request.result);
    };

    request.onerror = () => {
      console.error("Failed to load files from IndexedDB");
    };
  };

  // Save a file to IndexedDB
  const saveToIndexedDB = (file) => {
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    const newFile = {
      id: Date.now() + Math.random(),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type,
      content: file, // Store the actual file object
    };

    store.add(newFile);

    transaction.oncomplete = () => {
      setFiles((prevFiles) => [...prevFiles, newFile]);
    };

    transaction.onerror = () => {
      console.error("Failed to save file to IndexedDB");
    };
  };

  // Delete a file from IndexedDB
  const deleteFromIndexedDB = (fileId) => {
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.delete(fileId);

    transaction.oncomplete = () => {
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    };

    transaction.onerror = () => {
      console.error("Failed to delete file from IndexedDB");
    };
  };

  // Validate files by type and size
  const validateFiles = (uploadedFiles) => {
    const validFileTypes = ["application/pdf", "image/png", "image/jpeg"];
    const maxSizeInBytes = 100 * 1024 * 1024; // 100 MB

    const validFiles = [];
    const errors = [];
    
    Array.from(uploadedFiles).forEach((file) => {
      if (!validFileTypes.includes(file.type)) {
        errors.push(`Invalid file type: ${file.name}`);
      } else if (file.size > maxSizeInBytes) {
        errors.push(`File too large (max 100MB): ${file.name}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      for (const error of errors) {
        dispatch(
          addNotificationWithTimeout({
            id: Date.now(),
            message: error,
            type: "error",
          })
        );
      }
    }

    return validFiles;
  };

  // Handle file upload (from input or drop)
  const handleFileUpload = (uploadedFiles) => {
    const validFiles = validateFiles(uploadedFiles);
    validFiles.forEach((file) => {
      saveToIndexedDB(file);
    });
  };

  // Handle drag and drop events
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className=" border rounded-md">
      {/* Drag and Drop Area */}
      <div
        className={` flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-md p-6 m-4 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <UploadIcon />
        <div className="text-base">
          {isDragging ? "Thả File Vào Đây" : "Nhấn chọn tập tin hoặc kéo thả"}
        </div>
        <div className="text-xs text-gray-500">
          PDF, JPG hoặc PNG, kích thước file không lớn hơn 100MB
        </div>
        <input
          type="file"
          multiple
          accept=".pdf,.png,.jpeg"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="file-input file-input-bordered w-full max-w-xs"
        />
      </div>

      {/* Uploaded Files List */}
      <div className="p-2 font-semibold text-gray-700">File đã tải lên</div>
      {files.length > 0 ? (
        <ul className="border border-gray-300 rounded-md p-1 ">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex justify-start items-center m-3 border-b p-2 last:border-b-0 hover:scale-y-125 hover:scale-x-125 hover:origin-top-left group  transition-all duration-300 ease-in-out"
            >
              <FileIcon className="w-8 h-8 mr-2" />
              <div>
                <span className="font-medium">{file.name}</span> -{" "}
                <span className="text-gray-500 text-sm">{file.size}</span>
              </div>
              <button
                onClick={() => deleteFromIndexedDB(file.id)}
                className="px-2 py-1 bg-red-500 text-red rounded-md  opacity-10 group-hover:opacity-100 "
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 text-center">
          Chưa có file nào được tải lên
        </div>
      )}
      <div className="flex flex-row justify-center gap-3 p-4">
        <button
          onClick={() => {
            setFiles([]);
            dispatch(goToStep(1));
            dispatch(markUncompleted(1));
            const transaction = db.transaction("files", "readwrite");
            const store = transaction.objectStore("files");
            store.clear();
          }}
          className="btn btn-error btn-sm"
        >
          Reset
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (files.length > 0) {
              dispatch(markCompleted(1));
              dispatch(goToStep(2));
            }
          }}
          className="btn btn-success btn-sm"
          style={{
            cursor: files.length > 0
              
              ? "pointer"
              : "not-allowed",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FileUploadWithDragAndDrop;

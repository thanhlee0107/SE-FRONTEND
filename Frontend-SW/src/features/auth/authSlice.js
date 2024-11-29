import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  token: localStorage.getItem("jwt") || null,
  role: localStorage.getItem("jwt")
    ? jwtDecode(localStorage.getItem("jwt")).payload.role
    : null, // Decode role from JWT
  isAuthenticated: !!localStorage.getItem("jwt"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.role = jwtDecode(action.payload).payload.role; // Extract role from token
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem("jwt", action.payload);

       // Clear IndexedDB
       const request = indexedDB.open("FileStorage", 1);

       request.onsuccess = (event) => {
         const db = event.target.result;
 
         
         if (db.objectStoreNames.contains("files")) {
           const transaction = db.transaction("files", "readwrite");
           const store = transaction.objectStore("files");
 
           const clearRequest = store.clear();
           clearRequest.onsuccess = () => {
             console.log("IndexedDB 'files' store cleared successfully.");
           };
           clearRequest.onerror = (err) => {
             console.error("Failed to clear IndexedDB 'files' store:", err);
           };
         } else {
           console.log(
             "Object store 'files' does not exist. No clearing needed."
           );
         }
        };

    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      localStorage.removeItem("jwt");

      // Clear IndexedDB
      const request = indexedDB.open("FileStorage", 1);

      request.onsuccess = (event) => {
        const db = event.target.result;

        
        if (db.objectStoreNames.contains("files")) {
          const transaction = db.transaction("files", "readwrite");
          const store = transaction.objectStore("files");

          const clearRequest = store.clear();
          clearRequest.onsuccess = () => {
            console.log("IndexedDB 'files' store cleared successfully.");
          };
          clearRequest.onerror = (err) => {
            console.error("Failed to clear IndexedDB 'files' store:", err);
          };
        } else {
          console.log(
            "Object store 'files' does not exist. No clearing needed."
          );
        }
      };

      request.onerror = (err) => {
        console.error("Failed to open IndexedDB:", err);
      };
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

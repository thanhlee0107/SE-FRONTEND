import React, { useState } from "react";
import PropTypes from "prop-types";
import { fetchUsablePages } from "@/API/usedAPI";
import { useSelector } from "react-redux";
const PagePurchase = ({setmodal}) => {
  
  const [pageNumber, setPageNumber] = useState("");
  const mssv = useSelector((state) => state.auth.mssv);
  const token = useSelector((state) => state.auth.token);
  
  const handleInputChange = (e) => {
    setPageNumber(e.target.value);
  };
  const purchasePage = async (pageNumber) => {

    const usablePages = await fetchUsablePages(mssv, token);
    const desiredPages = parseInt(pageNumber);
    const updatedPages = usablePages + desiredPages;
    console.log(`Purchasing ${pageNumber} pages.`);
    
    try {
      // Call the API to purchase pages
      const response = await fetch(`http://localhost:3003/user/update-page-balance/${mssv}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageBalance: updatedPages }),
      });

      if (!response.ok) {
        throw new Error(`Failed to purchase pages: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Purchased pages:", data.message);
      console.log("New page balance:", updatedPages);
    } catch (err) {
      console.error("Error purchasing pages:", err);
    }
  }
  const handlePurchase = () => {
    if (pageNumber && parseInt(pageNumber) > 0) {
      console.log(`Purchasing ${pageNumber} pages.`);
      // Add logic to handle the purchase
      try {
        purchasePage(pageNumber);
       
      }
        catch (err) {
            console.error("Error purchasing pages:", err);
            }
    
      setPageNumber(""); // Reset the input
    } else {
      alert("Please enter a valid number of pages.");
    }
  };

  return (
    <div className="modal modal-open ">
    <div className="modal-box text-black w-60">
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Mua Trang</h3>
        
      </div>

      {/* Modal Body */}
      <div className="mb-4">
        <input
          type="number"
          value={pageNumber}
          onChange={handleInputChange}
          placeholder="Nhập số trang cần mua"
          className="input input-bordered input-md w-full"
          min="1"
        />
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end gap-2">
        <button
          className="btn btn-md btn-success"
          onClick={handlePurchase}
        >
          Mua
        </button>
        <button
          className="btn btn-md"
          onClick={() => setmodal(false)}
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
  );
};
//validate props
PagePurchase.propTypes = {
  setmodal: PropTypes.func,
};
export default PagePurchase;

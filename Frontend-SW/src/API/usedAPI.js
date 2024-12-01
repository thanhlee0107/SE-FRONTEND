import {linkToBlob,truncateFileName} from '@/utils/helpers';
export const fetchPrinters = async (token) => {
  
  try {
    const response = await fetch("http://localhost:3003/printers/getall", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      // Remove JWT and call the logout function
     
      throw { message: "Unauthorized. JWT removed, user logged out.", code: 401 };
    }
  

    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error fetching printers:", error);
    throw error; // Re-throw the error for handling at the caller level
  }
};

export const fetchUsablePages = async (mssv, token) => {
  console.log(mssv)
  try {
    const response = await fetch(`http://localhost:3003/user/page-balance/${mssv}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    

    if (data?.result?.pageBalance !== undefined) {
      return data.result.pageBalance;
    } else {
      console.error("Unexpected response structure:", data);
    }
  } catch (error) {
    console.error("Error fetching usable pages:", error);
  }
};


export const sendFileToPrint = async (printForm,token) => {
    const IDPrinter = printForm.IDPrinter;
    const Name=truncateFileName(printForm.Name,20);
    const Type=printForm.Type.split('/')[1];
    const Amount=printForm.Amount;
    const Size=printForm.Size;
    const Color=printForm.Color;
    
    
    async function blobToBase64(blob) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(",")[1]); // Base64 string
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    
    const FileBase64 = await blobToBase64(await linkToBlob(printForm.File));
    
    const payload = {
      IDPrinter,
      Name,
      Type,
      Amount,
      Size,
      Color,
      File: FileBase64,
    }; 


    try {
      const response = await fetch("http://localhost:3003/printing/printrequest/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        
        throw { message: "Unauthorized. JWT removed, user logged out.", code: 401 };
      }
      if (!response.ok) {
        throw new Error(`Lỗi khi In! Status: ${response.status}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return response.json();

    } catch (error) {
      console.error("Gửi lệnh in không thành công:", error);
      throw error;
    }



  
}
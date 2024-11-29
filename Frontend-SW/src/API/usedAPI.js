
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
  

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
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
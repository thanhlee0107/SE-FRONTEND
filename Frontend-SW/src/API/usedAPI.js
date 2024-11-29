
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
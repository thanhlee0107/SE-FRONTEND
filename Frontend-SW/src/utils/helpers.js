export const truncateFileName = (name, maxLength = 40, preserveBeforeExtension = 5) => {
  if (name.length <= maxLength) return name;

  const extensionIndex = name.lastIndexOf(".");
  const extension = extensionIndex > -1 ? name.slice(extensionIndex) : ""; 
  const baseName = extensionIndex > -1 ? name.slice(0, extensionIndex) : name;

  
  const maxTruncatedLength = Math.max(maxLength - extension.length - preserveBeforeExtension - 3, 0); 
  const truncatedBase = baseName.slice(0, maxTruncatedLength); 
  const preservedEnd = baseName.slice(-Math.min(preserveBeforeExtension, baseName.length)); 

  return `${truncatedBase}...${preservedEnd}${extension}`;
};

export async function linkToBlob(url) {
  try {
    
    const response = await fetch(url);

    
    if (!response.ok) {
      throw new Error(`Failed to fetch the file: ${response.statusText}`);
    }

    
    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.error("Error converting link to Blob:", error);
    throw error;
  }
}

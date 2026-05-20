import { useState } from "react";
import peopleService from "../services/people";

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadProfilePdf = async (personId: string) => {
    if (!personId) {
      setError("No person ID available for download");
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      console.log("Downloading PDF for person ID:", personId);
      const response = await peopleService.downloadProfilePdf(personId);
      
      if (response && response.pdfUrl) {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
          link.href = response.pdfUrl;
          link.target = '_blank';
        link.download = `profile-${personId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log("PDF download initiated:", response.pdfUrl);
      } else {
        throw new Error("No PDF URL received from the server");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError(error instanceof Error ? error.message : "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    error,
    downloadProfilePdf,
  };
};
import { API_BASE_URL, ApiError } from "./api";
import { getToken } from "./auth";

export async function downloadPdf(endpoint: string, filename: string) {
  const token = getToken();

  if (!token) {
    throw new ApiError("Please log in again to export this document.", 401);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ApiError("PDF export failed. Please try again.", response.status);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}


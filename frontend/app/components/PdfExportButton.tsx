"use client";

import { useState } from "react";
import { downloadPdf } from "../../lib/download";

type PdfExportButtonProps = {
  endpoint: string;
  filename: string;
};

export function PdfExportButton({ endpoint, filename }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  async function handleExport() {
    try {
      setError("");
      setIsExporting(true);
      await downloadPdf(endpoint, filename);
    } catch {
      setError("We could not export the PDF right now. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="w-full sm:w-fit">
      <button
        type="button"
        className="btn-secondary min-w-[144px] w-full px-5 py-2.5 sm:w-fit disabled:pointer-events-none disabled:opacity-60"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? "Preparing PDF..." : "Export PDF"}
      </button>
      {error ? (
        <p className="mt-3 max-w-xs animate-card-in rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
          {error}
        </p>
      ) : null}
    </div>
  );
}




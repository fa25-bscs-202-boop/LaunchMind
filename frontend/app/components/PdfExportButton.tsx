"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
      <Button
        type="button"
        variant="secondary"
        className="w-full min-w-36 sm:w-fit"
        onClick={handleExport}
        isLoading={isExporting}
        loadingText="Preparing PDF..."
      >
        <Download className="size-4" aria-hidden="true" />
        Export PDF
      </Button>
      {error ? (
        <Alert variant="destructive" className="mt-3 max-w-xs animate-card-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CloudUpload, FileCheck2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTenant } from "@/lib/hooks/useTenant";

export function InvoiceUploader({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState("");
  const { isReady, subdomain } = useTenant();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    if (!isReady) {
      toast.error("Tenant not ready, please refresh");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (notes) {
      formData.append("notes", notes);
    }

    try {
      // Use the correct API URL - if running locally via proxy or directly
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/invoices/upload?subdomain=${subdomain}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      toast.success("Invoice uploaded successfully! Analysis started.");
      setFile(null);
      setNotes("");

      // Reset file input
      const fileInput = document.getElementById("invoice-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload invoice. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4 sm:flex-row">
        <div>
          <CardTitle>Upload & map invoices</CardTitle>
          <CardDescription>
            Send PDFs to our AI pipeline for OCR + Inventory mapping.
          </CardDescription>
        </div>
        <div className="rounded-full bg-muted p-3">
          <CloudUpload className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id="invoice-file"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Textarea
          placeholder="Optional notes for the AI agent (supplier, department, etc.)"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isUploading}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          className="w-full sm:w-auto"
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Scan Invoice"
          )}
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileCheck2 className="h-4 w-4 text-emerald-500" />
          AI-Powered Extraction
        </div>
      </CardFooter>
    </Card>
  );
}


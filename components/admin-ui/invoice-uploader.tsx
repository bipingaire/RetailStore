import { CloudUpload, FileCheck2 } from "lucide-react";

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

export function InvoiceUploader() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4 sm:flex-row">
        <div>
          <CardTitle>Upload & map invoices</CardTitle>
          <CardDescription>
            Send PDFs to `/api/parse-invoice` for OCR + Supabase mapping.
          </CardDescription>
        </div>
        <div className="rounded-full bg-muted p-3">
          <CloudUpload className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="application/pdf,image/*" />
        <Textarea
          placeholder="Optional notes for the AI agent (supplier, department, etc.)"
          rows={4}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button className="w-full sm:w-auto">Send to OCR pipeline</Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileCheck2 className="h-4 w-4 text-emerald-500" />
          10 invoices normalized this morning
        </div>
      </CardFooter>
    </Card>
  );
}


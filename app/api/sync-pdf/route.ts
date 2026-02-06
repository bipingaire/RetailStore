import { NextResponse } from "next/server";

import { syncDailySalesPdf } from "@/lib/ai-mapping";

export async function POST(request: Request) {
  try {
    const { pdfUrl, storeId } = await request.json();
    const job = await syncDailySalesPdf(pdfUrl, storeId);

    return NextResponse.json(
      {
        message: "Sales PDF sync queued",
        job,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("sync-pdf error", error);
    return NextResponse.json(
      { error: "Unable to sync pdf" },
      { status: 400 }
    );
  }
}


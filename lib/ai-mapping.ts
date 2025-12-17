import { randomUUID } from "crypto";

type InvoicePayload = {
  storeId: string;
  supplier: string;
  items: Array<{
    sku: string;
    description: string;
    quantity: number;
    unitCost: number;
  }>;
  total: number;
  issuedAt: string;
};

type MappingResult = {
  normalizedItems: InvoicePayload["items"];
  warnings: string[];
};

export async function mapInvoiceToInventory(
  payload: InvoicePayload
): Promise<MappingResult> {
  const warnings: string[] = [];

  const normalizedItems = payload.items.map((item) => {
    if (!item.sku) {
      warnings.push(`Missing SKU for ${item.description}, generated placeholder`);
    }
    return {
      ...item,
      sku: item.sku || `TEMP-${randomUUID()}`,
      description: item.description.trim(),
    };
  });

  return {
    normalizedItems,
    warnings,
  };
}

export async function syncDailySalesPdf(pdfUrl: string, storeId: string) {
  // Placeholder logic for future AI parsing pipeline.
  return {
    storeId,
    pdfUrl,
    status: "queued",
  };
}


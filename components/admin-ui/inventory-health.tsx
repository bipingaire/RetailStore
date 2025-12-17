import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const rows = [
  {
    sku: "MILK-128",
    desc: "Grazing Acres Whole Milk",
    shelf: "Cooler 4B",
    status: "Gap forming",
    severity: "high",
  },
  {
    sku: "CEREAL-314",
    desc: "Galaxy Crunch",
    shelf: "Aisle 9",
    status: "Facing drift",
    severity: "medium",
  },
  {
    sku: "HABA-021",
    desc: "Vitamin D3 2000iu",
    shelf: "Wellness end-cap",
    status: "Par met",
    severity: "low",
  },
];

const severityBadge: Record<string, string> = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-amber-500 text-white",
  low: "bg-emerald-500 text-white",
};

export function InventoryHealthTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory health</CardTitle>
        <CardDescription>
          Shelf Walk computer vision status for the last scan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.sku}>
                <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                <TableCell>{row.desc}</TableCell>
                <TableCell>{row.shelf}</TableCell>
                <TableCell>
                  <Badge className={severityBadge[row.severity]}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


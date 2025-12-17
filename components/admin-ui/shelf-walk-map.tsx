import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const aisles = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  status: index === 1 ? "issue" : index === 3 ? "watch" : "ok",
}));

const statusColor: Record<string, string> = {
  ok: "bg-emerald-500/20 border-emerald-500/40",
  watch: "bg-amber-500/20 border-amber-500/40",
  issue: "bg-destructive/20 border-destructive/40",
};

export function ShelfWalkMap() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Shelf Walk heat map</CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge className="bg-emerald-500/20 text-emerald-800">OK</Badge>
          <Badge className="bg-amber-500/20 text-amber-700">Watch</Badge>
          <Badge className="bg-destructive/20 text-destructive-foreground">
            Issue
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {aisles.map((aisle) => (
          <div
            key={aisle.id}
            className={`rounded-lg border p-6 text-center text-sm font-semibold ${statusColor[aisle.status]}`}
          >
            Aisle {aisle.id}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


import { AlertTriangle, Snowflake, Waves } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const alerts = [
  {
    id: "case-21",
    title: "Dairy bunker warm",
    detail: "Shelf 4B reporting 52ºF for 8 minutes",
    severity: "high",
    icon: <Snowflake className="h-4 w-4 text-sky-500" />,
  },
  {
    id: "case-44",
    title: "Planogram drift",
    detail: "Cereal shelf missing 3 facings vs. PDF",
    severity: "medium",
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  },
  {
    id: "case-77",
    title: "Backroom overstock",
    detail: "Water pallets hitting 110% of daily par",
    severity: "low",
    icon: <Waves className="h-4 w-4 text-blue-500" />,
  },
];

const severityColor: Record<string, string> = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-amber-500 text-white",
  low: "bg-secondary text-secondary-foreground",
};

export function AlertFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Realtime alerts</CardTitle>
        <CardDescription>Telemetry from sensors & Shelf Walk scans</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start justify-between rounded-lg border p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {alert.icon}
                {alert.title}
              </div>
              <p className="text-sm text-muted-foreground">{alert.detail}</p>
            </div>
            <Badge className={severityColor[alert.severity]}>
              {alert.severity}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


import {
  ArrowDownRight,
  ArrowUpRight,
  BellRing,
  PackageCheck,
  ShoppingCart,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    label: "Net Sales",
    value: "$182,420",
    delta: "+12.4%",
    trend: "up",
    icon: <ShoppingCart className="h-5 w-5 text-primary" />,
  },
  {
    label: "Shelf Alerts",
    value: "5 open",
    delta: "2 urgent",
    trend: "down",
    icon: <BellRing className="h-5 w-5 text-destructive" />,
  },
  {
    label: "Invoice Queue",
    value: "14 files",
    delta: "4 waiting for AI",
    trend: "flat",
    icon: <PackageCheck className="h-5 w-5 text-secondary-foreground" />,
  },
];

export function StatGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stat.value}</div>
            <CardDescription className="flex items-center gap-2 pt-1 text-sm">
              {stat.trend === "up" && (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              )}
              {stat.trend === "down" && (
                <ArrowDownRight className="h-4 w-4 text-amber-500" />
              )}
              {stat.trend === "flat" && (
                <Badge variant="outline" className="text-xs">
                  queued
                </Badge>
              )}
              {stat.delta}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


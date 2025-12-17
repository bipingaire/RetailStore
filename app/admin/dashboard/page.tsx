import { AlertFeed } from "@/components/admin-ui/alert-feed";
import { ShelfWalkMap } from "@/components/admin-ui/shelf-walk-map";
import { StatGrid } from "@/components/admin-ui/stat-grid";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <StatGrid />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <ShelfWalkMap />
        <AlertFeed />
      </div>
    </div>
  );
}


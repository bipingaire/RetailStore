import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="store-name">Store name</Label>
          <Input id="store-name" defaultValue="Flagship Market" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input id="timezone" defaultValue="America/Los_Angeles" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="alerts">Alert routing</Label>
          <Textarea
            id="alerts"
            rows={3}
            defaultValue="ops@flagship.market, coolers@flagship.market"
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">Auto-publish price changes</p>
            <p className="text-xs text-muted-foreground">
              Applies Supabase updates to the shop in realtime
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <Button className="w-full sm:w-auto">Save changes</Button>
      </CardContent>
    </Card>
  );
}


import { Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LoyaltyCardProps = {
  tier: string;
  points: number;
  nextReward: string;
};

export function LoyaltyCard({ tier, points, nextReward }: LoyaltyCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Loyalty status</CardTitle>
          <CardDescription>Powered by Supabase profiles</CardDescription>
        </div>
        <Flame className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge className="bg-primary text-primary-foreground">{tier}</Badge>
        <div>
          <p className="text-3xl font-semibold">{points} pts</p>
          <p className="text-sm text-muted-foreground">
            {nextReward} away from your next reward
          </p>
        </div>
        <Button variant="outline" className="w-full">
          View rewards
        </Button>
      </CardContent>
    </Card>
  );
}


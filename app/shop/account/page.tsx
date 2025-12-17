import { LoyaltyCard } from "@/components/shop-ui/loyalty-card";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Loyalty</h1>
      <LoyaltyCard tier="Gold" points={1280} nextReward="220 pts" />
    </div>
  );
}


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getTraders } from "@/lib/banking";
import { TrendingUp } from "lucide-react";

export interface Investment {
  id: string;
  traderId: string;
  traderName: string;
  amount: number;
  date: string;
  type: "invest" | "withdraw";
}

interface InvestmentPanelProps {
  onInvest: (investment: Investment) => void;
}

export default function InvestmentPanel({ onInvest }: InvestmentPanelProps) {
  const [amount, setAmount] = useState("");
  const [traderId, setTraderId] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleInvest = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setMessage({ text: "Please enter a valid amount.", type: "error" });
      return;
    }
    if (!traderId.trim()) {
      setMessage({ text: "Please enter a Trader ID.", type: "error" });
      return;
    }

    const traders = getTraders();
    const id = traderId.toUpperCase();
    const trader = traders[id];

    if (!trader) {
      setMessage({ text: `Trader "${id}" not found.`, type: "error" });
      return;
    }
    if (!trader.verified) {
      setMessage({ text: `Trader "${trader.name}" is not verified. Cannot invest.`, type: "error" });
      return;
    }

    const investment: Investment = {
      id: `INV-${Date.now()}`,
      traderId: id,
      traderName: trader.name,
      amount: amt,
      date: new Date().toISOString(),
      type: "invest",
    };

    onInvest(investment);
    setMessage({ text: `✅ Invested ₹${amt.toLocaleString()} with ${trader.name}`, type: "success" });
    setAmount("");
    setTraderId("");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <Card className="animate-fade-in shadow-lg border-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Invest with Trader</CardTitle>
            <CardDescription>Enter amount and trader ID to invest</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="invest-amount">Amount (₹)</Label>
            <Input
              id="invest-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invest-trader">Trader ID</Label>
            <Input
              id="invest-trader"
              placeholder="e.g. T1"
              value={traderId}
              onChange={e => setTraderId(e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        <Button onClick={handleInvest} className="w-full gap-2" size="lg">
          <TrendingUp className="h-4 w-4" /> Invest Now
        </Button>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
            message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}>
            {message.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

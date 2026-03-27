import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine } from "lucide-react";
import type { Investment } from "@/components/InvestmentPanel";

interface WithdrawPanelProps {
  investments: Investment[];
  onWithdraw: (withdrawal: Investment) => void;
}

export default function WithdrawPanel({ investments, onWithdraw }: WithdrawPanelProps) {
  const [amount, setAmount] = useState("");
  const [traderId, setTraderId] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const getBalanceByTrader = (id: string) => {
    return investments
      .filter(inv => inv.traderId === id)
      .reduce((sum, inv) => sum + (inv.type === "invest" ? inv.amount : -inv.amount), 0);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setMessage({ text: "Please enter a valid amount.", type: "error" });
      return;
    }
    const id = traderId.trim().toUpperCase();
    if (!id) {
      setMessage({ text: "Please enter a Trader ID.", type: "error" });
      return;
    }

    const balance = getBalanceByTrader(id);
    if (balance <= 0) {
      setMessage({ text: `No investments found with trader "${id}".`, type: "error" });
      return;
    }
    if (amt > balance) {
      setMessage({ text: `Insufficient balance. Available: $${balance.toLocaleString()}`, type: "error" });
      return;
    }

    const traderName = investments.find(inv => inv.traderId === id)?.traderName || id;

    const withdrawal: Investment = {
      id: `WDR-${Date.now()}`,
      traderId: id,
      traderName,
      amount: amt,
      date: new Date().toISOString(),
      type: "withdraw",
    };

    onWithdraw(withdrawal);
    setMessage({ text: `✅ Withdrew $${amt.toLocaleString()} from ${traderName}`, type: "success" });
    setAmount("");
    setTraderId("");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <Card className="animate-fade-in shadow-lg border-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>Withdraw from your trader investments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(() => {
          const balances: { id: string; name: string; balance: number }[] = [];
          const seen = new Set<string>();
          investments.forEach(inv => { if (!seen.has(inv.traderId)) seen.add(inv.traderId); });
          seen.forEach(id => {
            const bal = investments
              .filter(inv => inv.traderId === id)
              .reduce((sum, inv) => sum + (inv.type === "invest" ? inv.amount : -inv.amount), 0);
            if (bal > 0) {
              const name = investments.find(inv => inv.traderId === id)?.traderName || id;
              balances.push({ id, name, balance: bal });
            }
          });
          return balances.length > 0 ? (
            <div className="p-3 rounded-lg bg-muted/50 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Available Balances:</p>
              {balances.map(b => (
                <div key={b.id} className="flex justify-between text-sm">
                  <span className="font-mono text-muted-foreground">{b.id} — {b.name}</span>
                  <span className="font-semibold text-success">${b.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground text-center">
              No investments yet. Invest first to withdraw.
            </div>
          );
        })()}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Amount ($)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="withdraw-trader">Trader ID</Label>
            <Input
              id="withdraw-trader"
              placeholder="e.g. T1"
              value={traderId}
              onChange={e => setTraderId(e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        <Button onClick={handleWithdraw} variant="destructive" className="w-full gap-2" size="lg">
          <ArrowDownToLine className="h-4 w-4" /> Withdraw
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

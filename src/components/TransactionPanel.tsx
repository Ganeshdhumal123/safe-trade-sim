import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sendMoney, type RiskResult } from "@/lib/banking";
import { SendHorizontal, AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";

export default function TransactionPanel() {
  const [amount, setAmount] = useState("");
  const [traderId, setTraderId] = useState("");
  const [result, setResult] = useState<{ success: boolean; message: string; risk: RiskResult } | null>(null);

  const handleSend = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || !traderId.trim()) return;
    setResult(sendMoney(amt, traderId));
  };

  const riskColor = (level: string) =>
    level === "high" ? "text-danger" : level === "medium" ? "text-warning" : "text-success";

  const riskBg = (level: string) =>
    level === "high" ? "bg-danger/10 border-danger/20" : level === "medium" ? "bg-warning/10 border-warning/20" : "bg-success/10 border-success/20";

  const RiskIcon = result?.risk.level === "high" ? ShieldX : result?.risk.level === "medium" ? AlertTriangle : ShieldCheck;

  return (
    <Card className="animate-fade-in shadow-lg border-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <SendHorizontal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Send Transaction</CardTitle>
            <CardDescription>Risk is calculated before processing</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-trader">Trader ID</Label>
            <Input id="tx-trader" placeholder="e.g. T1" value={traderId} onChange={e => setTraderId(e.target.value)} className="font-mono" />
          </div>
        </div>

        <Button onClick={handleSend} className="w-full gap-2" size="lg">
          <SendHorizontal className="h-4 w-4" /> Process Transaction
        </Button>

        {result && (
          <div className={`p-4 rounded-xl border animate-fade-in space-y-3 ${riskBg(result.risk.level)}`}>
            <div className="flex items-center gap-2">
              <RiskIcon className={`h-5 w-5 ${riskColor(result.risk.level)}`} />
              <p className={`font-semibold ${riskColor(result.risk.level)}`}>{result.message}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Risk Score</span>
                <span className={`font-bold font-mono ${riskColor(result.risk.level)}`}>{result.risk.score}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.risk.level === "high" ? "bg-danger" : result.risk.level === "medium" ? "bg-warning" : "bg-success"
                  }`}
                  style={{ width: `${result.risk.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Level</span>
                <span className={`status-badge ${
                  result.risk.level === "high" ? "bg-danger/20 text-danger" : result.risk.level === "medium" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
                }`}>
                  {result.risk.level}
                </span>
              </div>
            </div>

            {result.risk.factors.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Factors</p>
                <ul className="space-y-1">
                  {result.risk.factors.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

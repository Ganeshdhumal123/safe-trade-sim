import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { registerTrader, RegisterTraderResult } from "@/lib/banking";
import { UserPlus, CheckCircle2, XCircle } from "lucide-react";

interface TraderRegistrationProps {
  onRegistered?: () => void;
}

export default function TraderRegistration({ onRegistered }: TraderRegistrationProps) {
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [result, setResult] = useState<RegisterTraderResult | null>(null);

  const handleSubmit = () => {
    const res = registerTrader(name, pan, aadhaar, bankAccount, ifsc);
    setResult(res);
    if (res.success) {
      setName(""); setPan(""); setAadhaar(""); setBankAccount(""); setIfsc("");
      onRegistered?.();
    }
  };

  return (
    <Card className="animate-fade-in shadow-lg border-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Register New Trader</CardTitle>
            <CardDescription>All fields required for auto-verification</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="reg-name">Trader / Company Name</Label>
            <Input id="reg-name" placeholder="e.g. Acme Payments Ltd" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-pan">PAN Number</Label>
            <Input id="reg-pan" placeholder="ABCDE1234F" value={pan} onChange={e => setPan(e.target.value.toUpperCase())} maxLength={10} className="font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-aadhaar">Aadhaar Number</Label>
            <Input id="reg-aadhaar" placeholder="123456789012" value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, ""))} maxLength={12} className="font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-bank">Bank Account Number</Label>
            <Input id="reg-bank" placeholder="9-18 digit account number" value={bankAccount} onChange={e => setBankAccount(e.target.value.replace(/\D/g, ""))} maxLength={18} className="font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-ifsc">IFSC Code</Label>
            <Input id="reg-ifsc" placeholder="SBIN0001234" value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} maxLength={11} className="font-mono" />
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full gap-2">
          <UserPlus className="h-4 w-4" /> Register & Verify Trader
        </Button>

        {result && (
          <div className={`p-4 rounded-xl animate-fade-in ${
            result.success
              ? "bg-success/10 border border-success/20"
              : "bg-danger/10 border border-danger/20"
          }`}>
            <div className="flex items-start gap-2">
              {result.success
                ? <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                : <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              }
              <div>
                <p className={`font-semibold ${result.success ? "text-success" : "text-danger"}`}>
                  {result.message}
                </p>
                {result.errors && (
                  <ul className="mt-2 space-y-1 text-sm text-danger">
                    {result.errors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

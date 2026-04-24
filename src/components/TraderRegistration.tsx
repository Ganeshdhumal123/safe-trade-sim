import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { registerTrader, RegisterTraderResult } from "@/lib/banking";
import { UserPlus, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

interface TraderRegistrationProps {
  onRegistered?: () => void;
}

type Step = "form" | "credentials";

export default function TraderRegistration({ onRegistered }: TraderRegistrationProps) {
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<RegisterTraderResult | null>(null);
  const [step, setStep] = useState<Step>("form");

  const handleRegister = () => {
    // Basic client-side validation
    const errors: string[] = [];
    if (!name.trim()) errors.push("Trader name is required");
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.push("Valid email is required");
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) errors.push("Invalid PAN format");
    if (!/^\d{12}$/.test(aadhaar)) errors.push("Invalid Aadhaar (12 digits)");
    if (!/^\d{9,18}$/.test(bankAccount)) errors.push("Invalid bank account (9-18 digits)");
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) errors.push("Invalid IFSC code");

    if (errors.length > 0) {
      setResult({ success: false, message: "Validation failed.", errors });
      return;
    }

    const res = registerTrader(name, pan, aadhaar, bankAccount, ifsc, email);
    setResult(res);
    if (res.success) {
      setStep("credentials");
      onRegistered?.();
    }
  };

  const resetForm = () => {
    setName(""); setPan(""); setAadhaar(""); setBankAccount(""); setIfsc("");
    setEmail(""); setResult(null);
    setStep("form");
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
            <CardDescription>
              {step === "form"
                ? "Fill trader details to register instantly"
                : "Trader registered! Save these credentials."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "form" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="reg-name">Trader / Company Name</Label>
                <Input id="reg-name" placeholder="e.g. Acme Payments Ltd" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="reg-email">Trader Email</Label>
                <Input id="reg-email" type="email" placeholder="trader@example.com" value={email} onChange={e => setEmail(e.target.value)} />
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

            <Button onClick={handleRegister} className="w-full gap-2">
              <ShieldCheck className="h-4 w-4" /> Register Trader
            </Button>
          </>
        )}

        {step === "credentials" && result?.success && result.credentials && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <p className="font-semibold text-success">{result.message}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
              <p className="text-base font-semibold text-foreground">🔐 Trader Login Credentials</p>
              <div className="grid gap-2 text-sm font-mono bg-background p-3 rounded-lg border">
                <p><span className="text-muted-foreground">Username:</span> <span className="text-foreground font-bold">{result.credentials.username}</span></p>
                <p><span className="text-muted-foreground">Password:</span> <span className="text-foreground font-bold">{result.credentials.password}</span></p>
                <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground font-bold">{result.credentials.email}</span></p>
                <p><span className="text-muted-foreground">Trader ID:</span> <span className="text-foreground font-bold">{result.traderId}</span></p>
              </div>
              <p className="text-xs text-destructive font-medium">⚠️ Save these credentials now — share the Trader ID with investors so they can invest.</p>
            </div>

            <Button onClick={resetForm} className="w-full">
              Register Another Trader
            </Button>
          </div>
        )}

        {result && !result.success && (
          <div className="p-4 rounded-xl animate-fade-in bg-danger/10 border border-danger/20">
            <div className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-danger">{result.message}</p>
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

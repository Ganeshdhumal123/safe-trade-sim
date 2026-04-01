import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { registerTrader, RegisterTraderResult } from "@/lib/banking";
import { UserPlus, CheckCircle2, XCircle, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TraderRegistrationProps {
  onRegistered?: () => void;
}

type Step = "form" | "otp";

export default function TraderRegistration({ onRegistered }: TraderRegistrationProps) {
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<RegisterTraderResult | null>(null);

  const [step, setStep] = useState<Step>("form");
  const [sentOtp, setSentOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendOtp = async () => {
    // Basic client-side validation first
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

    setResult(null);
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email },
      });

      if (error || !data?.success) {
        setResult({ success: false, message: data?.message || "Failed to send OTP. Check email configuration." });
        return;
      }

      setSentOtp(data.otp);
      setStep("otp");
      setOtpError("");
    } catch {
      setResult({ success: false, message: "Network error sending OTP." });
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = () => {
    if (enteredOtp !== sentOtp) {
      setOtpError("Invalid OTP. Please try again.");
      return;
    }

    setOtpError("");
    const res = registerTrader(name, pan, aadhaar, bankAccount, ifsc, email);
    setResult(res);
    if (res.success) {
      setName(""); setPan(""); setAadhaar(""); setBankAccount(""); setIfsc("");
      setEmail(""); setEnteredOtp(""); setSentOtp("");
      setStep("form");
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
            <CardDescription>
              {step === "form"
                ? "Fill details & verify email via OTP"
                : "Enter the OTP sent to your email"}
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

            <Button onClick={handleSendOtp} className="w-full gap-2" disabled={sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {sending ? "Sending OTP..." : "Send OTP & Verify Email"}
            </Button>
          </>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                OTP sent to <span className="font-semibold text-foreground">{email}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="otp-input">Enter 4-digit OTP</Label>
              <Input
                id="otp-input"
                placeholder="1234"
                value={enteredOtp}
                onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={4}
                className="font-mono text-center text-2xl tracking-[0.5em]"
              />
            </div>

            {otpError && (
              <p className="text-sm text-destructive font-medium">{otpError}</p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setStep("form"); setEnteredOtp(""); setOtpError(""); }} className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerifyOtp} className="flex-1 gap-2" disabled={enteredOtp.length !== 4}>
                <ShieldCheck className="h-4 w-4" /> Verify & Register
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={handleSendOtp} disabled={sending} className="w-full text-muted-foreground">
              {sending ? "Resending..." : "Resend OTP"}
            </Button>
          </div>
        )}

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
              <div className="w-full">
                <p className={`font-semibold ${result.success ? "text-success" : "text-danger"}`}>
                  {result.message}
                </p>
                {result.credentials && (
                  <div className="mt-3 p-3 rounded-lg bg-background border space-y-2">
                    <p className="text-sm font-semibold text-foreground">🔐 Trader Login Credentials</p>
                    <div className="grid gap-1 text-sm font-mono">
                      <p><span className="text-muted-foreground">Username:</span> <span className="text-foreground font-bold">{result.credentials.username}</span></p>
                      <p><span className="text-muted-foreground">Password:</span> <span className="text-foreground font-bold">{result.credentials.password}</span></p>
                      <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground font-bold">{result.credentials.email}</span></p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">⚠️ Save these credentials — they are needed for trader login.</p>
                  </div>
                )}
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

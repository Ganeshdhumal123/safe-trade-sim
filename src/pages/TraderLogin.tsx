import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Briefcase, LogIn, ArrowLeft, Fingerprint } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { generateDeviceId, getDeviceInfo } from "@/lib/deviceId";

const DEMO_TRADERS = [
  { email: "trader@bank.com", password: "trader1234", name: "Global Payments Corp", traderId: "T1" },
  { email: "trader2@bank.com", password: "trader1234", name: "SecureTrade Inc", traderId: "T3" },
];

export default function TraderLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("trader@bank.com");
  const [password, setPassword] = useState("trader1234");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const currentDeviceId = generateDeviceId();
  const deviceInfo = getDeviceInfo();

  const handleLogin = () => {
    // Check demo traders first
    const demoTrader = DEMO_TRADERS.find(t => t.email === email && t.password === password);
    
    // Check registered traders (created via admin registration)
    const registeredTraders = JSON.parse(localStorage.getItem("registered_traders") || "[]");
    const regTrader = registeredTraders.find((t: any) =>
      (t.email === email || t.username === email) && t.password === password
    );

    if (!demoTrader && !regTrader) {
      setMessage({ text: "Invalid email/username or password.", type: "error" });
      return;
    }

    const traderName = demoTrader?.name || regTrader?.name;
    const traderId = demoTrader?.traderId || regTrader?.traderId;

    localStorage.setItem("logged_in", "true");
    localStorage.setItem("user_role", "trader");
    localStorage.setItem("user_name", traderName);
    localStorage.setItem("user_email", demoTrader?.email || regTrader?.email);
    localStorage.setItem("trader_id", traderId);
    setMessage({ text: `Welcome, ${traderName}!`, type: "success" });
    setTimeout(() => navigate("/trader-dashboard"), 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in shadow-xl border-primary/10">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Trader Login</CardTitle>
            <CardDescription>Sign in to manage your trader account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <LogIn className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device" className="flex items-center gap-1.5">
                <Fingerprint className="h-3.5 w-3.5" /> Device ID (Auto-detected)
              </Label>
              <Input id="device" value={currentDeviceId} readOnly className="font-mono text-sm bg-muted" />
              <p className="text-xs text-muted-foreground">
                {deviceInfo.os} · {deviceInfo.browser} · {deviceInfo.screen}
              </p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
                message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {message.text}
              </div>
            )}

            <Button onClick={handleLogin} className="w-full" size="lg">Sign In as Trader</Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: trader@bank.com / trader1234
            </p>

            <div className="flex items-center justify-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Home
              </Link>
              <Link to="/user-login" className="text-primary hover:underline">
                User Login →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

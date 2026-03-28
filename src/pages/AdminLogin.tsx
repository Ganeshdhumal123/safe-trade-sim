import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login, initDemoUser } from "@/lib/banking";
import { Shield, LogIn, Fingerprint, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@bank.com");
  const [password, setPassword] = useState("bank1234");
  const [deviceId, setDeviceId] = useState("DEVICE-XK7-2024");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => { initDemoUser(); }, []);

  const handleLogin = () => {
    const result = login(email, password, deviceId);
    setMessage({ text: result.message, type: result.success ? "success" : "error" });
    if (result.success) {
      localStorage.setItem("user_role", "admin");
      localStorage.setItem("user_name", "Alex Morgan");
      localStorage.setItem("user_email", email);
      setTimeout(() => navigate("/admin-dashboard"), 800);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in shadow-xl border-primary/10">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>Sign in with admin credentials to access the full dashboard</CardDescription>
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
                <Fingerprint className="h-3.5 w-3.5" /> Device ID
              </Label>
              <Input id="device" value={deviceId} onChange={e => setDeviceId(e.target.value)} className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">Try changing this to simulate a new device login attempt.</p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
                message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {message.text}
              </div>
            )}

            <Button onClick={handleLogin} className="w-full" size="lg">Sign In as Admin</Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: admin@bank.com / bank1234
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

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { initDemoUser } from "@/lib/banking";
import { generateDeviceId, getDeviceInfo } from "@/lib/deviceId";
import { User, LogIn, ArrowLeft, Fingerprint, Monitor, Globe, Maximize } from "lucide-react";
import Footer from "@/components/Footer";

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo> | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    initDemoUser();
    const id = generateDeviceId();
    const info = getDeviceInfo();
    setDeviceId(id);
    setDeviceInfo(info);
  }, []);

  const handleLogin = () => {
    // Check registered users first
    const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password);

    if (registeredUser) {
      // Verify device ID
      if (registeredUser.deviceId !== deviceId) {
        setMessage({ text: "⚠ Unrecognized device! Login blocked for security. Use the device you signed up with.", type: "error" });
        return;
      }
      localStorage.setItem("logged_in", "true");
      localStorage.setItem("user_role", "user");
      localStorage.setItem("user_name", registeredUser.name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_device_id", deviceId);
      setMessage({ text: `Welcome back, ${registeredUser.name}!`, type: "success" });
      setTimeout(() => navigate("/user-dashboard"), 800);
      return;
    }

    // Fallback: demo user
    const DEMO_USERS = [
      { email: "user@bank.com", password: "user1234", name: "Jamie Wilson" },
    ];
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
      localStorage.setItem("logged_in", "true");
      localStorage.setItem("user_role", "user");
      localStorage.setItem("user_name", demoUser.name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_device_id", deviceId);
      setMessage({ text: `Welcome, ${demoUser.name}!`, type: "success" });
      setTimeout(() => navigate("/user-dashboard"), 800);
      return;
    }

    setMessage({ text: "Invalid email or password.", type: "error" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in shadow-xl border-primary/10">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
              <User className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">User Login</CardTitle>
            <CardDescription>Sign in with your credentials and verified device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <LogIn className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-9" placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
            </div>

            {/* Device Info */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Fingerprint className="w-4 h-4" />
                Current Device ID
              </div>
              <p className="font-mono text-sm font-bold text-foreground tracking-wider">{deviceId}</p>
              {deviceInfo && (
                <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {deviceInfo.os}</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {deviceInfo.browser}</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {deviceInfo.screen}</span>
                  <span className="flex items-center gap-1"><Fingerprint className="w-3 h-3" /> {deviceInfo.platform}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Must match the device used during sign up.</p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
                message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {message.text}
              </div>
            )}

            <Button onClick={handleLogin} className="w-full" size="lg">Sign In</Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: user@bank.com / user1234
            </p>

            <div className="flex items-center justify-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Home
              </Link>
              <Link to="/user-signup" className="text-primary hover:underline font-medium">
                Create Account →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

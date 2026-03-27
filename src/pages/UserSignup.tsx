import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, Fingerprint, Monitor, Globe, Maximize } from "lucide-react";
import Footer from "@/components/Footer";
import { generateDeviceId, getDeviceInfo } from "@/lib/deviceId";

export default function UserSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo> | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const id = generateDeviceId();
    const info = getDeviceInfo();
    setDeviceId(id);
    setDeviceInfo(info);
  }, []);

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }
    if (password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
    if (existingUsers.find((u: any) => u.email === email)) {
      setMessage({ text: "Email already registered. Please sign in.", type: "error" });
      return;
    }

    // Register user with device ID
    existingUsers.push({
      name: name.trim(),
      email: email.trim(),
      password,
      deviceId,
      deviceInfo,
      registeredAt: new Date().toISOString(),
    });
    localStorage.setItem("registered_users", JSON.stringify(existingUsers));

    setMessage({ text: `Account created! Device ID: ${deviceId}. Redirecting to login...`, type: "success" });
    setTimeout(() => navigate("/user-login"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in shadow-xl border-primary/10">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Sign up to start trading securely</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" />
            </div>

            {/* Device Info Card */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Fingerprint className="w-4 h-4" />
                Auto-Generated Device ID
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
              <p className="text-xs text-muted-foreground">This device ID is linked to your account for security. You can only sign in from this device.</p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
                message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {message.text}
              </div>
            )}

            <Button onClick={handleSignup} className="w-full" size="lg">Create Account</Button>

            <div className="flex items-center justify-center gap-4 text-sm">
              <Link to="/user-login" className="text-primary hover:underline">
                Already have an account? Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

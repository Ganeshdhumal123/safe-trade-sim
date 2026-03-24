import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { initDemoUser } from "@/lib/banking";
import { User, LogIn, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const DEMO_USERS = [
  { email: "user@bank.com", password: "user1234", name: "Jamie Wilson" },
];

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("user@bank.com");
  const [password, setPassword] = useState("user1234");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => { initDemoUser(); }, []);

  const handleLogin = () => {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      setMessage({ text: "Invalid email or password.", type: "error" });
      return;
    }
    localStorage.setItem("logged_in", "true");
    localStorage.setItem("user_role", "user");
    localStorage.setItem("user_name", user.name);
    setMessage({ text: `Welcome, ${user.name}!`, type: "success" });
    setTimeout(() => navigate("/user-dashboard"), 800);
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
            <CardDescription>Sign in to view trader information and directory</CardDescription>
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

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
                message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {message.text}
              </div>
            )}

            <Button onClick={handleLogin} className="w-full" size="lg">Sign In as User</Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: user@bank.com / user1234
            </p>

            <div className="flex items-center justify-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Home
              </Link>
              <Link to="/admin-login" className="text-primary hover:underline">
                Admin Login →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

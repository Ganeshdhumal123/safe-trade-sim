import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, Activity, UserPlus, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

const features = [
  {
    icon: ShieldCheck,
    title: "Trader Verification",
    description: "Instantly check if a trader is verified and safe before transacting.",
  },
  {
    icon: Activity,
    title: "Risk Scoring Engine",
    description: "Automated risk analysis scores transactions before they're processed.",
  },
  {
    icon: UserPlus,
    title: "KYC Registration",
    description: "Register traders with PAN, Aadhaar, and bank details for auto-verification.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground">SafeTrade</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/user-login">User Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/admin-login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-20 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Shield className="w-4 h-4" /> Banking Risk Analysis Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight max-w-3xl mx-auto">
            Secure Every Transaction with{" "}
            <span className="text-primary">Smart Risk Analysis</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify traders, score transaction risk in real-time, and prevent fraud before it happens.
            A complete demo of banking-grade fraud prevention systems.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" asChild className="gap-2">
              <Link to="/admin-login">
                Admin Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/user-login">User Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-card/40">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-2xl font-bold text-center text-foreground mb-12">
            Core Features
          </h2>
          <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border bg-card shadow-sm space-y-3 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

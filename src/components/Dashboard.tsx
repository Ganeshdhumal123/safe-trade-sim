import { useState } from "react";
import { logout } from "@/lib/banking";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import TraderCheckPanel from "./TraderCheckPanel";
import TransactionPanel from "./TransactionPanel";
import TraderDirectory from "./TraderDirectory";
import TraderRegistration from "./TraderRegistration";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Risk Analysis System</h1>
              <p className="text-xs text-muted-foreground">Banking Fraud Prevention Demo</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <TraderCheckPanel />
          <TransactionPanel key={refreshKey} />
        </div>
        <TraderRegistration onRegistered={() => setRefreshKey(k => k + 1)} />
        <TraderDirectory key={refreshKey} />
      </main>
    </div>
  );
}

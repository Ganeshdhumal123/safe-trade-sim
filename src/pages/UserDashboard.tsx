import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";
import TraderCheckPanel from "@/components/TraderCheckPanel";
import TraderDirectory from "@/components/TraderDirectory";
import InvestmentPanel, { type Investment } from "@/components/InvestmentPanel";
import WithdrawPanel from "@/components/WithdrawPanel";
import InvestmentChart from "@/components/InvestmentChart";
import TransactionHistory from "@/components/TransactionHistory";
import Footer from "@/components/Footer";

const STORAGE_KEY = "user_investments";

function loadInvestments(): Investment[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveInvestments(investments: Investment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "User";
  const [investments, setInvestments] = useState<Investment[]>(loadInvestments);

  useEffect(() => {
    saveInvestments(investments);
  }, [investments]);

  const handleTransaction = (transaction: Investment) => {
    setInvestments(prev => [...prev, transaction]);
  };

  const handleLogout = () => {
    localStorage.removeItem("logged_in");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <User className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">User Portal</h1>
              <p className="text-xs text-muted-foreground">Welcome, {userName}</p>
            </div>
          </div>
          <ProfileDropdown onLogout={handleLogout} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <div className="grid gap-8 lg:grid-cols-2">
          <InvestmentPanel onInvest={handleTransaction} />
          <WithdrawPanel investments={investments} onWithdraw={handleTransaction} />
        </div>
        <InvestmentChart investments={investments} />
        <TransactionHistory investments={investments} />
        <TraderCheckPanel />
        <TraderDirectory />
      </main>

      <Footer />
    </div>
  );
}

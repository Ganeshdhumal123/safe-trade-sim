import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "@/components/ProfileDropdown";
import Navbar from "@/components/Navbar";
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
      <Navbar />
      <header className="border-b bg-card/60">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div>
            <h1 className="font-bold text-lg leading-tight">User Portal</h1>
            <p className="text-xs text-muted-foreground">Welcome, {userName}</p>
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

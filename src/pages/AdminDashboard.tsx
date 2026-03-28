import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/lib/banking";
import ProfileDropdown from "@/components/ProfileDropdown";
import Navbar from "@/components/Navbar";
import TraderCheckPanel from "@/components/TraderCheckPanel";
import TransactionPanel from "@/components/TransactionPanel";
import TraderDirectory from "@/components/TraderDirectory";
import TraderRegistration from "@/components/TraderRegistration";
import Footer from "@/components/Footer";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user_role");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <header className="border-b bg-card/60">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div>
            <h1 className="font-bold text-lg leading-tight">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Banking Fraud Prevention — Full Access</p>
          </div>
          <ProfileDropdown onLogout={handleLogout} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <div className="grid gap-8 lg:grid-cols-2">
          <TraderCheckPanel />
          <TransactionPanel key={refreshKey} />
        </div>
        <TraderRegistration onRegistered={() => setRefreshKey(k => k + 1)} />
        <TraderDirectory key={refreshKey} />
      </main>

      <Footer />
    </div>
  );
}

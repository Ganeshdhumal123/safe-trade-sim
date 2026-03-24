import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import TraderCheckPanel from "@/components/TraderCheckPanel";
import TraderDirectory from "@/components/TraderDirectory";
import Footer from "@/components/Footer";

export default function UserDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "User";

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
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <TraderCheckPanel />
        <TraderDirectory />
      </main>

      <Footer />
    </div>
  );
}

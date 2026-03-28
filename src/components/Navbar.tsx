import { Link, useNavigate } from "react-router-dom";
import { Shield, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function getDashboardPath(role: string | null) {
  switch (role) {
    case "admin": return "/admin-dashboard";
    case "trader": return "/trader-dashboard";
    default: return "/user-dashboard";
  }
}

export default function Navbar() {
  const isLoggedIn = localStorage.getItem("logged_in") === "true";
  const role = localStorage.getItem("user_role");

  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground">SafeTrade</span>
        </Link>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button variant="default" size="sm" asChild className="gap-2">
              <Link to={getDashboardPath(role)}>
                <UserCircle className="w-4 h-4" /> Go to Profile
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/user-login">User Login</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/trader-login">Trader Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/admin-login">Admin Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import { useNavigate } from "react-router-dom";
import { getTraders } from "@/lib/banking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfileDropdown from "@/components/ProfileDropdown";

export default function TraderDashboard() {
  const navigate = useNavigate();
  const traderId = localStorage.getItem("trader_id") || "";
  const traders = getTraders();
  const trader = traders[traderId];

  const handleLogout = () => {
    localStorage.removeItem("logged_in");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("trader_id");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <header className="border-b bg-card/60">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div>
            <h1 className="font-bold text-lg leading-tight">Trader Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage your trader account</p>
          </div>
          <ProfileDropdown onLogout={handleLogout} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        {trader ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Account Overview
                <Badge variant={trader.verified ? "default" : "destructive"}>
                  {trader.verified ? "Verified" : "Unverified"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem label="Trader ID" value={traderId} />
                <InfoItem label="Name" value={trader.name} />
                <InfoItem label="PAN" value={trader.pan || "N/A"} />
                <InfoItem label="Aadhaar" value={trader.aadhaar ? `XXXX-XXXX-${trader.aadhaar.slice(-4)}` : "N/A"} />
                <InfoItem label="Bank Account" value={trader.bankAccount ? `XXXX${trader.bankAccount.slice(-4)}` : "N/A"} />
                <InfoItem label="IFSC" value={trader.ifsc || "N/A"} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Trader account not found.
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-mono">{value}</p>
    </div>
  );
}

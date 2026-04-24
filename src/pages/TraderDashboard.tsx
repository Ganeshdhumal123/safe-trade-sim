import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTraders } from "@/lib/banking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, IndianRupee, TrendingUp } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfileDropdown from "@/components/ProfileDropdown";

interface LedgerEntry {
  id: string;
  traderId: string;
  traderName: string;
  amount: number;
  date: string;
  type: "invest" | "withdraw";
  investorName?: string;
  investorEmail?: string;
}

export default function TraderDashboard() {
  const navigate = useNavigate();
  const traderId = localStorage.getItem("trader_id") || "";
  const traders = getTraders();
  const trader = traders[traderId];

  const { entries, investorSummary, totalInvested, totalWithdrawn } = useMemo(() => {
    const all: LedgerEntry[] = JSON.parse(localStorage.getItem("trader_ledger") || "[]");
    const mine = all.filter(e => e.traderId === traderId);

    const summary = new Map<string, { name: string; email: string; net: number; invested: number; withdrawn: number }>();
    let invested = 0;
    let withdrawn = 0;

    mine.forEach(e => {
      const key = e.investorEmail || e.investorName || "Anonymous";
      const cur = summary.get(key) || {
        name: e.investorName || "Anonymous",
        email: e.investorEmail || "—",
        net: 0,
        invested: 0,
        withdrawn: 0,
      };
      if (e.type === "invest") {
        cur.net += e.amount;
        cur.invested += e.amount;
        invested += e.amount;
      } else {
        cur.net -= e.amount;
        cur.withdrawn += e.amount;
        withdrawn += e.amount;
      }
      summary.set(key, cur);
    });

    return {
      entries: mine.slice().reverse(),
      investorSummary: Array.from(summary.values()).sort((a, b) => b.net - a.net),
      totalInvested: invested,
      totalWithdrawn: withdrawn,
    };
  }, [traderId]);

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
          <>
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

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard icon={<Users className="h-5 w-5" />} label="Total Investors" value={investorSummary.length.toString()} tone="primary" />
              <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Total Invested" value={`₹${totalInvested.toLocaleString()}`} tone="success" />
              <StatCard icon={<IndianRupee className="h-5 w-5" />} label="Total Withdrawn" value={`₹${totalWithdrawn.toLocaleString()}`} tone="destructive" />
            </div>

            {/* Investors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Investors
                </CardTitle>
                <CardDescription>People who invested money in your trader account</CardDescription>
              </CardHeader>
              <CardContent>
                {investorSummary.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No investors yet.</p>
                ) : (
                  <ScrollArea className="max-h-80">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Investor</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Invested</TableHead>
                          <TableHead className="text-right">Withdrawn</TableHead>
                          <TableHead className="text-right">Net Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {investorSummary.map((inv, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{inv.name}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{inv.email}</TableCell>
                            <TableCell className="text-right font-mono text-success">₹{inv.invested.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono text-destructive">₹{inv.withdrawn.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono font-bold">₹{inv.net.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Recent transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>All investments and withdrawals on your account</CardDescription>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No transactions yet.</p>
                ) : (
                  <ScrollArea className="max-h-80">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Investor</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map(e => (
                          <TableRow key={e.id}>
                            <TableCell className="text-xs text-muted-foreground">{new Date(e.date).toLocaleString()}</TableCell>
                            <TableCell>{e.investorName || "Anonymous"}</TableCell>
                            <TableCell>
                              <Badge variant={e.type === "invest" ? "default" : "destructive"}>
                                {e.type === "invest" ? "Invest" : "Withdraw"}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-mono font-semibold ${e.type === "invest" ? "text-success" : "text-destructive"}`}>
                              {e.type === "invest" ? "+" : "-"}₹{e.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </>
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

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "primary" | "success" | "destructive" }) {
  const toneClass =
    tone === "success" ? "bg-success/10 text-success" :
    tone === "destructive" ? "bg-destructive/10 text-destructive" :
    "bg-primary/10 text-primary";
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${toneClass}`}>{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

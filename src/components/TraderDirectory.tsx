import { getTraders } from "@/lib/banking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, BadgeX, Database } from "lucide-react";

export default function TraderDirectory() {
  const traders = getTraders();
  return (
    <Card className="animate-fade-in shadow-lg border-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Trader Directory</CardTitle>
            <CardDescription>All traders registered in the system</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(traders).map(([id, trader]) => (
            <div key={id} className={`p-4 rounded-xl border flex items-center gap-3 ${
              trader.verified ? "bg-success/5 border-success/15" : "bg-danger/5 border-danger/15"
            }`}>
              {trader.verified
                ? <BadgeCheck className="h-5 w-5 text-success shrink-0" />
                : <BadgeX className="h-5 w-5 text-danger shrink-0" />
              }
              <div className="min-w-0">
                <p className="font-mono text-sm font-bold">{id}</p>
                <p className="text-sm text-muted-foreground truncate">{trader.name}</p>
              </div>
              <span className={`ml-auto status-badge shrink-0 ${
                trader.verified ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
              }`}>
                {trader.verified ? "Verified" : "Unverified"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

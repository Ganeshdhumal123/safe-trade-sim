import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import type { Investment } from "./InvestmentPanel";

interface TransactionHistoryProps {
  investments: Investment[];
}

export default function TransactionHistory({ investments }: TransactionHistoryProps) {
  const sorted = [...investments].reverse();

  return (
    <Card className="animate-fade-in shadow-lg border-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All your investment transactions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No transactions yet. Make an investment to see history.
          </p>
        ) : (
          <ScrollArea className="h-[320px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Trader</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(inv.date).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        inv.type === "withdraw" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                      }`}>
                        {inv.type === "withdraw" ? "Withdraw" : "Invest"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{inv.traderName}</span>
                      <span className="text-muted-foreground text-xs ml-1">({inv.traderId})</span>
                    </TableCell>
                    <TableCell className={`text-right font-mono font-semibold ${
                      inv.type === "withdraw" ? "text-destructive" : "text-success"
                    }`}>
                      {inv.type === "withdraw" ? "-" : "+"}${inv.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

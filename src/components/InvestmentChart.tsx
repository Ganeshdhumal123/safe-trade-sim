import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import type { Investment } from "./InvestmentPanel";

const COLORS = [
  "hsl(220, 70%, 45%)",
  "hsl(152, 60%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(350, 65%, 50%)",
  "hsl(190, 70%, 45%)",
  "hsl(30, 80%, 50%)",
  "hsl(120, 50%, 40%)",
];

interface InvestmentChartProps {
  investments: Investment[];
}

export default function InvestmentChart({ investments }: InvestmentChartProps) {
  // Aggregate by trader (net balance: invest - withdraw)
  const traderMap: Record<string, { name: string; total: number }> = {};
  investments.forEach(inv => {
    if (!traderMap[inv.traderId]) {
      traderMap[inv.traderId] = { name: inv.traderName, total: 0 };
    }
    traderMap[inv.traderId].total += inv.type === "withdraw" ? -inv.amount : inv.amount;
  });

  const data = Object.entries(traderMap)
    .filter(([, { total }]) => total > 0)
    .map(([id, { name, total }]) => ({
      name: `${name} (${id})`,
      value: total,
    }));

  if (data.length === 0) {
    return (
      <Card className="animate-fade-in shadow-lg border-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Investment Distribution</CardTitle>
              <CardDescription>Visual breakdown of your investments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            No investments yet. Start investing to see the chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalInvested = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="animate-fade-in shadow-lg border-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Investment Distribution</CardTitle>
            <CardDescription>
              Total invested: <span className="font-bold text-foreground">${totalInvested.toLocaleString()}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name.split(" (")[0]} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Invested"]}
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid hsl(220, 15%, 88%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

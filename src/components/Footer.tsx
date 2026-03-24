import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card/60 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-foreground">SafeTrade</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Banking fraud prevention & risk analysis simulation platform.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Trader Verification</li>
              <li>Risk Scoring Engine</li>
              <li>Transaction Monitoring</li>
              <li>KYC Registration</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Info</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Demo Application</li>
              <li>Built with React + TypeScript</li>
              <li>No real banking data</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SafeTrade Sim — Banking Risk Analysis Demo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

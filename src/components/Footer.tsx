import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg text-foreground">SafeTrade</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SafeTrade is a banking fraud prevention and risk analysis simulation platform designed to
              demonstrate how modern financial institutions detect, score, and prevent fraudulent transactions
              in real time. Built as an educational and portfolio project, it showcases KYC onboarding,
              trader verification workflows, and automated risk scoring engines — all within a clean,
              production-grade interface.
            </p>
          </div>

          {/* About the Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">About the Platform</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This application simulates a real-world banking risk management system. Users can register
              traders with their PAN, Aadhaar, and bank details, then instantly verify them against the
              system's database. Every transaction is scored for risk using configurable heuristics,
              helping analysts identify suspicious activity before funds are transferred. The platform
              supports both admin and user roles, each with tailored dashboards and access levels.
            </p>
          </div>

          {/* Tech & Disclaimer */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Technology & Disclaimer</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SafeTrade is built with React, TypeScript, Tailwind CSS, and Lovable Cloud for backend
              services including authentication, database management, and serverless edge functions.
              Please note that this is a demonstration application — no real banking data is processed
              or stored. All trader records, transactions, and risk scores are simulated for educational
              purposes only. The platform is not affiliated with any financial institution.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SafeTrade — Banking Risk Analysis Demo. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/admin-login" className="hover:text-foreground transition-colors">Admin</Link>
            <Link to="/user-login" className="hover:text-foreground transition-colors">User Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

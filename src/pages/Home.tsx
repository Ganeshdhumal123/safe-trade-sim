import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, Activity, UserPlus, ArrowRight, Zap, Lock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: ShieldCheck,
    title: "Trader Verification",
    description: "Instantly check if a trader is verified and safe before transacting. Real-time status updates ensure you always deal with trusted parties.",
  },
  {
    icon: Activity,
    title: "Risk Scoring Engine",
    description: "Automated risk analysis scores transactions before they're processed, flagging suspicious patterns with ML-powered intelligence.",
  },
  {
    icon: UserPlus,
    title: "KYC Registration",
    description: "Register traders with PAN, Aadhaar, and bank details for auto-verification. Streamlined onboarding in minutes.",
  },
];

const stats = [
  { value: "99.7%", label: "Fraud Detection Rate", icon: Shield },
  { value: "<200ms", label: "Response Time", icon: Zap },
  { value: "100K+", label: "Transactions Monitored", icon: BarChart3 },
  { value: "256-bit", label: "Encryption Standard", icon: Lock },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex items-center relative">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 text-center space-y-8 relative z-[1]">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            <Shield className="w-4 h-4" /> Banking Risk Analysis Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight max-w-3xl mx-auto"
          >
            Secure Every Transaction with{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-accent-foreground bg-clip-text">
              Smart Risk Analysis
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Verify traders, score transaction risk in real-time, and prevent fraud before it happens.
            A complete demo of banking-grade fraud prevention systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Button size="lg" asChild className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              <Link to="/admin-login">
                Admin Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:bg-accent transition-colors">
              <Link to="/user-login">User Portal</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={scaleIn}
                className="text-center space-y-2 p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-4"
          >
            Core Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center max-w-xl mx-auto mb-12"
          >
            Everything you need to monitor, verify, and secure financial transactions in one platform.
          </motion.p>

          <div className="grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow space-y-3 text-center cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-t">
        <div className="container mx-auto px-4 py-16 text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-foreground"
          >
            Ready to Experience Secure Trading?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-lg mx-auto"
          >
            Explore the demo to see how real-time risk scoring and trader verification protect every transaction.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button size="lg" asChild className="gap-2">
              <Link to="/admin-login">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

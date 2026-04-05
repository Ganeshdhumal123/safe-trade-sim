import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Mail, IdCard, Shield, Smartphone, Briefcase, CreditCard, Building2 } from "lucide-react";
import { getTraders } from "@/lib/banking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TraderProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const name = localStorage.getItem("user_name") || "Unknown";
  const email = localStorage.getItem("user_email") || "—";
  const traderId = localStorage.getItem("trader_id") || "";
  const deviceId = localStorage.getItem("device_id") || "—";
  const traders = getTraders();
  const trader = traders[traderId];

  const [avatar, setAvatar] = useState<string | null>(
    localStorage.getItem("trader_avatar")
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      localStorage.setItem("trader_avatar", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <Card>
          <CardHeader className="items-center text-center pb-2">
            <div className="relative group">
              <Avatar className="w-24 h-24 text-2xl">
                {avatar ? (
                  <AvatarImage src={avatar} alt={name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <CardTitle className="mt-4 text-xl">{name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {trader && (
                <Badge variant={trader.verified ? "default" : "destructive"}>
                  {trader.verified ? "Verified" : "Unverified"}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">Trader</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <InfoRow icon={Briefcase} label="Trader ID" value={traderId || "—"} />
            <InfoRow icon={Mail} label="Email" value={email} />
            <InfoRow icon={Smartphone} label="Device ID" value={deviceId} />
            {trader && (
              <>
                <InfoRow icon={IdCard} label="PAN" value={trader.pan || "N/A"} />
                <InfoRow icon={Shield} label="Aadhaar" value={trader.aadhaar ? `XXXX-XXXX-${trader.aadhaar.slice(-4)}` : "N/A"} />
                <InfoRow icon={CreditCard} label="Bank Account" value={trader.bankAccount ? `XXXX${trader.bankAccount.slice(-4)}` : "N/A"} />
                <InfoRow icon={Building2} label="IFSC" value={trader.ifsc || "N/A"} />
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

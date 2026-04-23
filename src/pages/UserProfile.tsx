import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Mail, IdCard, Shield, Smartphone, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { logout } from "@/lib/banking";

export default function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const name = localStorage.getItem("user_name") || "Unknown";
  const email = localStorage.getItem("user_email") || "—";
  const role = localStorage.getItem("user_role") || "user";
  const deviceId = localStorage.getItem("device_id") || "—";

  const handleSignOut = () => {
    logout();
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    navigate("/");
  };

  const [avatar, setAvatar] = useState<string | null>(
    localStorage.getItem("user_avatar")
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      localStorage.setItem("user_avatar", dataUrl);
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
            <p className="text-sm text-muted-foreground capitalize">{role}</p>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <InfoRow icon={Mail} label="Email" value={email} />
            <InfoRow icon={IdCard} label="Role" value={role.charAt(0).toUpperCase() + role.slice(1)} />
            <InfoRow icon={Shield} label="Account Status" value="Active" />
            <InfoRow icon={Smartphone} label="Device ID" value={deviceId} />

            <Button
              variant="destructive"
              className="w-full gap-2 mt-4"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
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

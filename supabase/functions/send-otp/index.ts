import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ success: false, message: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const otp = String(Math.floor(1000 + Math.random() * 9000));

    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailPass) {
      console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD secrets");
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: gmailUser,
          password: gmailPass,
        },
      },
    });

    await client.send({
      from: gmailUser,
      to: email,
      subject: "SafeTrade OTP Verification",
      content: `Your OTP is ${otp}`,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, otp }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return new Response(
      JSON.stringify({ success: false, message: `Failed to send OTP: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

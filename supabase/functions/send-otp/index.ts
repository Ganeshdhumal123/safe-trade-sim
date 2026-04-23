import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_NAME = "SafeTrade";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid email address." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GMAIL_USER = Deno.env.get("GMAIL_USER")?.trim();
    // Gmail app passwords are shown with spaces (e.g. "abcd efgh ijkl mnop")
    // but must be sent without spaces during SMTP auth.
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD")?.replace(/\s+/g, "");

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error("Missing Gmail credentials");
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const otp = String(Math.floor(1000 + Math.random() * 9000));

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_USER,
          password: GMAIL_APP_PASSWORD,
        },
      },
    });

    await client.send({
      from: `${APP_NAME} <${GMAIL_USER}>`,
      to: email,
      subject: `${APP_NAME} - Your OTP Code`,
      content: `Your ${APP_NAME} verification code is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #2563eb; margin: 0 0 16px;">${APP_NAME} Verification</h2>
          <p style="color: #374151; font-size: 14px;">Use the OTP below to verify your email address. This code expires in 10 minutes.</p>
          <div style="background: #ffffff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 0;">${otp}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px;">If you did not request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} ${APP_NAME}</p>
        </div>
      `,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, otp }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("send-otp error:", errMsg);
    return new Response(
      JSON.stringify({ success: false, message: `Failed to send OTP: ${errMsg}` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

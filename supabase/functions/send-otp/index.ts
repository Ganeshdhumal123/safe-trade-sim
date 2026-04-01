const RESEND_API_KEY = "re_ZXzfQ1kd_GH3g4BsywRwEMqi7bLyvCZ2Q"; 

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    const otp = String(Math.floor(1000 + Math.random() * 9000));

    // Calling Resend API to send the email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SafeTrade <onboarding@resend.dev>", 
        to: [email],
        subject: "SafeTrade OTP Verification",
        html: `<strong>Your verification code is: ${otp}</strong>`,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      console.error("Resend Error:", resData);
      throw new Error(resData.message || "Failed to send email via Resend");
    }

    return new Response(
      JSON.stringify({ success: true, otp }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Function Error:", errMsg);
    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
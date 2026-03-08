import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY || "";
const client = new BrevoClient({ apiKey });

interface SafetyAlertData {
  receiverEmail: string;
  receiverName: string;
  senderName: string;
  zoneName: string;
  locationLink: string;
  timestamp: string;
}

export const sendSafetyAlertEmail = async (data: SafetyAlertData) => {
  if (!data.receiverEmail) {
    console.warn(`Skipping alert for ${data.receiverName}: no email address`);
    return { success: false, skipped: true, reason: "no_email" };
  }

  if (!apiKey) {
    console.error("BREVO_API_KEY is not set in environment variables");
    throw new Error("Email service not configured: Missing BREVO_API_KEY");
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Safety Alert - Prohorini</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #dc2626; padding: 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em; text-transform: uppercase;">⚠️ SAFETY ALERT</h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 28px; font-weight: 600;">
                        Hello ${data.receiverName},
                      </p>
                      <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 26px; color: #64748b;">
                        This is an automated emergency alert from <strong>Prohorini Safety Systems</strong>. Your safety circle member, <span style="color: #1e293b; font-weight: 700;">${data.senderName}</span>, has triggered a threat alert.
                      </p>
                      
                      <!-- Incident Details Box -->
                      <div style="background-color: #fff1f2; border: 2px solid #fecdd3; border-radius: 20px; padding: 24px; margin-bottom: 32px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #fb7185;">Current Status</span>
                              <div style="font-size: 20px; font-weight: 800; color: #dc2626; margin-top: 4px;">In Unsafe Zone</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #fb7185;">Zone Name</span>
                              <div style="font-size: 18px; font-weight: 700; color: #1e293b; margin-top: 4px;">${data.zoneName}</div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #fb7185;">Reported Time</span>
                              <div style="font-size: 14px; font-weight: 600; color: #64748b; margin-top: 4px;">${data.timestamp}</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin-bottom: 32px;">
                        <a href="${data.locationLink}" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 18px 36px; border-radius: 16px; font-size: 16px; font-weight: 800; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(30, 41, 59, 0.3);">VIEW LIVE LOCATION</a>
                      </div>
                      
                      <p style="margin: 0; font-size: 14px; line-height: 22px; color: #94a3b8; font-style: italic;">
                        Please check on ${data.senderName} immediately. If unable to reach them, consider contacting local authorities.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Prohorini Security Hub</p>
                      <p style="margin: 8px 0 0 0; font-size: 11px; color: #94a3b8;">You are receiving this because you are an emergency contact.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const response = await client.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Prohorini Safety Hub",
        email: "nandi1996suman@gmail.com",
      },
      to: [{ email: data.receiverEmail, name: data.receiverName }],
      subject: `🚨 EMERGENCY: ${data.senderName} is in an Unsafe Zone`,
      htmlContent: htmlContent,
    });

    // console.log("Safety alert custom email sent successfully:", response);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error("Error sending safety alert email:", error?.message || error);
    if (error?.body) {
      console.error("Brevo API error body:", JSON.stringify(error.body));
    }
    throw new Error(
      `Failed to dispatch safety alert: ${error?.message || "Unknown Brevo error"}`,
    );
  }
};

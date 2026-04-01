import { Resend } from 'resend';

// Lazy initialization to avoid build errors
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface SendInquiryEmailParams {
  sellerEmail: string;
  sellerName: string;
  senderName: string;
  senderEmail: string;
  listingTitle?: string;
  message: string;
}

export async function sendInquiryEmail({
  sellerEmail,
  sellerName,
  senderName,
  senderEmail,
  listingTitle,
  message,
}: SendInquiryEmailParams): Promise<{ success: boolean; error?: string }> {
  const client = getResendClient();

  if (!client) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: true }; // Don't fail if email not configured
  }

  try {
    const subject = listingTitle
      ? `New inquiry about: ${listingTitle}`
      : 'New inquiry on WoodSouq';

    const { error } = await client.emails.send({
      from: 'WoodSouq <onboarding@resend.dev>',
      to: sellerEmail,
      replyTo: senderEmail,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #222; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B5A2B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f7f5f2; padding: 30px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B5A2B; }
            .info { color: #666; font-size: 14px; }
            .cta { display: inline-block; background: #8B5A2B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🌲 WoodSouq</h1>
              <p style="margin: 5px 0 0;">New Inquiry Received</p>
            </div>
            <div class="content">
              <p>Hello ${sellerName},</p>
              <p>You have received a new inquiry${listingTitle ? ` about <strong>"${listingTitle}"</strong>` : ''} on WoodSouq.</p>

              <div class="message-box">
                <p class="info"><strong>From:</strong> ${senderName}</p>
                <p class="info"><strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
                <p style="margin-top: 15px;"><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>Reply directly to this email to respond to ${senderName}.</p>

              <a href="https://timberlink.org/dashboard/inquiries" class="cta">View All Inquiries</a>

              <div class="footer">
                <p>This email was sent from WoodSouq. Do not reply to noreply@timberlink.org.</p>
                <p>Instead, reply directly to the sender at ${senderEmail}.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${sellerName},

You have received a new inquiry${listingTitle ? ` about "${listingTitle}"` : ''} on WoodSouq.

From: ${senderName}
Email: ${senderEmail}

Message:
${message}

---
Reply directly to this email to respond to ${senderName}.
Or visit https://timberlink.org/dashboard/inquiries to view all your inquiries.
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

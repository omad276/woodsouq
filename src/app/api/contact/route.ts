import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Lazy initialization
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

const CONTACT_EMAIL = 'esmailabdelrazig@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const client = getResendClient();

    if (!client) {
      // Log the contact submission even if email is not configured
      console.log('Contact form submission (email not configured):', {
        name: body.name,
        email: body.email,
        message: body.message,
        timestamp: new Date().toISOString(),
      });
      // Return success even without email - form submission is recorded
      return NextResponse.json({ success: true, emailSent: false });
    }

    // Send email notification
    const { error } = await client.emails.send({
      from: 'WoodSouq Contact <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      replyTo: body.email,
      subject: `WoodSouq Contact Form: Message from ${body.name}`,
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
            .info { color: #666; font-size: 14px; margin: 8px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">WoodSouq</h1>
              <p style="margin: 5px 0 0;">New Contact Form Submission</p>
            </div>
            <div class="content">
              <p>You have received a new message from the WoodSouq contact form.</p>

              <div class="message-box">
                <p class="info"><strong>Name:</strong> ${body.name}</p>
                <p class="info"><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
                <p class="info"><strong>Received:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                <p style="margin-top: 15px;"><strong>Message:</strong></p>
                <p>${body.message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>Reply directly to this email to respond to ${body.name}.</p>

              <div class="footer">
                <p>This email was sent from the WoodSouq contact form.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission - WoodSouq

Name: ${body.name}
Email: ${body.email}
Received: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

Message:
${body.message}

---
Reply directly to this email to respond to ${body.name}.
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

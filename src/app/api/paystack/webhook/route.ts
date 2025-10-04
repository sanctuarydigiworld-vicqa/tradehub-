
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

async function sendAdminNotification(payload: any) {
    const { event, data } = payload;
    
    // Ensure it's a successful charge event
    if (event !== 'charge.success') {
        console.log(`Webhook received non-charge event: ${event}. Ignoring.`);
        return;
    }

    const adminContact = process.env.ADMIN_EMAIL_OR_SMS_GATEWAY;
    if (!adminContact) {
        console.error("CRITICAL: Admin contact address is not set. Please set ADMIN_EMAIL_OR_SMS_GATEWAY in your .env file.");
        return;
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    if(!emailUser || !emailPass) {
        console.error("CRITICAL: Email credentials are not set. Please set EMAIL_USER and EMAIL_PASSWORD in your .env file.");
        return;
    }

    const customerName = data.metadata?.name || data.customer.name || 'A Customer';
    const totalAmount = (data.amount / 100).toFixed(2);
    const currency = data.currency;
    const items = data.metadata?.cart ? JSON.parse(data.metadata.cart) : [];

    const subject = `New Order on VicqaTradeHub! (Ref: ${data.reference})`;
    
    const itemList = items.map((item: any) => `- ${item.quantity}x ${item.name} @ ${currency} ${(item.price).toFixed(2)}`).join('\n');
    
    // For SMS gateways, the "body" of the email is the text message content.
    // Keep it concise.
    const body = `
New Order (#${data.reference})
Customer: ${customerName}
Phone: ${data.metadata?.phone || 'N/A'}
Address: ${data.metadata?.address || 'N/A'}

Items:
${itemList}

Subtotal: ${currency} ${(data.metadata?.subtotal || 0).toFixed(2)}
Shipping: ${currency} ${(data.metadata?.shipping || 0).toFixed(2)}
Discount: ${currency} ${(data.metadata?.discount || 0).toFixed(2)}
Total Paid: ${currency} ${totalAmount}
    `;

    // Use nodemailer to send the actual email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass, // Use an app-specific password for Gmail
      },
    });

    try {
        await transporter.sendMail({
          from: `"VicqaTradeHub" <${emailUser}>`,
          to: adminContact, // This sends to your email-to-sms gateway
          subject: subject,
          text: body,
        });
        console.log(`Successfully sent order notification to ${adminContact}`);
    } catch (error) {
        console.error(`Failed to send email notification to ${adminContact}:`, error);
        // We don't throw here because we don't want Paystack to retry.
        // In a production app, you might want to log this to a monitoring service.
    }
}


export async function POST(req: NextRequest) {
    try {
        // Handle simulated webhook for zero-amount orders
        const isSimulated = req.headers.get('x-studio-simulated-webhook') === 'true';
        if (isSimulated) {
            console.log("Processing simulated webhook for zero-amount order.");
            const payload = await req.json();
            await sendAdminNotification(payload);
            return new NextResponse('Simulated webhook processed successfully', { status: 200 });
        }
        
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
            console.error('CRITICAL: Paystack secret key is not set in environment variables.');
            // Don't return the error message to the client
            return new NextResponse('Webhook configuration error', { status: 500 });
        }

        const body = await req.text();
        const hash = crypto.createHmac('sha512', secret)
            .update(body)
            .digest('hex');

        const signature = req.headers.get('x-paystack-signature');

        if (hash !== signature) {
            console.error("Invalid Paystack signature");
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const payload = JSON.parse(body);

        // Process the webhook payload (this now sends the email/SMS)
        await sendAdminNotification(payload);

        return new NextResponse('Webhook processed successfully', { status: 200 });

    } catch (error) {
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        console.error(`Webhook Error: ${message}`);
        return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
    }
}

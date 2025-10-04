
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

// This is a simplified email sending function. 
// In a real app, you'd use a robust library like nodemailer
async function sendAdminNotification(payload: any) {
    const { event, data } = payload;
    
    // Ensure it's a successful charge event
    if (event !== 'charge.success') {
        return;
    }

    const adminContact = process.env.ADMIN_EMAIL_OR_SMS_GATEWAY;
    if (!adminContact) {
        console.error("Admin contact address is not set. Please set ADMIN_EMAIL_OR_SMS_GATEWAY in your .env file.");
        return;
    }

    const customerName = data.metadata?.name || data.customer.name || 'A Customer';
    const totalAmount = (data.amount / 100).toFixed(2);
    const currency = data.currency;
    const items = data.metadata?.cart ? JSON.parse(data.metadata.cart) : [];

    const subject = `New Order on VicqaTradeHub! (Ref: ${data.reference})`;
    
    const itemList = items.map((item: any) => `- ${item.quantity}x ${item.name} @ ${currency} ${(item.price).toFixed(2)}`).join('\n');
    
    const body = `
A new order has been placed on VicqaTradeHub.

Order Details:
----------------
Reference: ${data.reference}
Customer: ${customerName}
Email: ${data.customer.email}
Phone: ${data.metadata?.phone || 'Not provided'}
Address: ${data.metadata?.address || 'Not provided'}

Items:
${itemList}

----------------
Subtotal: ${currency} ${(data.metadata?.subtotal || 0).toFixed(2)}
Shipping: ${currency} ${(data.metadata?.shipping || 0).toFixed(2)}
Discount: ${currency} ${(data.metadata?.discount || 0).toFixed(2)}
----------------
Total Paid: ${currency} ${totalAmount}
----------------
    `;

    console.log("----- NEW ORDER NOTIFICATION -----");
    console.log(`To: ${adminContact}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: \n${body}`);
    console.log("---------------------------------");
    
    // In a real implementation, you would replace the console logs
    // with your actual email sending logic (e.g., using Nodemailer, SendGrid, etc.)
    // For SMS, the "To" address would be the adminContact variable.
    
    // Example with nodemailer (you'd need to install it: npm install nodemailer)
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use an app-specific password for Gmail
      },
    });

    await transporter.sendMail({
      from: `"VicqaTradeHub" <${process.env.EMAIL_USER}>`,
      to: adminContact,
      subject: subject,
      text: body,
    });
    */

   console.log("Simulating sending notification to admin.");
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
            throw new Error('Paystack secret key is not set in environment variables.');
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

        // Process the webhook payload
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

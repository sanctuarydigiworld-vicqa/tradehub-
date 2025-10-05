
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

async function sendAdminNotification(payload: any) {
    console.log("----- ATTEMPTING TO SEND ADMIN NOTIFICATION -----");
    const { event, data } = payload;
    
    if (event !== 'charge.success') {
        console.log(`Webhook received non-charge event: ${event}. Ignoring.`);
        return;
    }

    const adminContact = process.env.ADMIN_EMAIL_OR_SMS_GATEWAY;
    if (!adminContact) {
        console.error("CRITICAL: Admin contact address (ADMIN_EMAIL_OR_SMS_GATEWAY) is not set in .env file.");
        return;
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    if(!emailUser || !emailPass) {
        console.error("CRITICAL: Email credentials (EMAIL_USER, EMAIL_PASSWORD) are not set in .env file.");
        return;
    }

    console.log(`Notification will be sent from: ${emailUser}`);
    console.log(`Notification will be sent to: ${adminContact}`);

    const customerName = data.metadata?.name || data.customer?.name || 'A Customer';
    const totalAmount = (data.amount / 100).toFixed(2);
    const currency = data.currency;
    const items = data.metadata?.cart ? JSON.parse(data.metadata.cart) : [];

    const subject = `New Order on VicqaTradeHub! (Ref: ${data.reference})`;
    
    const itemList = items.map((item: any) => `- ${item.quantity}x ${item.name} @ ${currency} ${(item.price).toFixed(2)}`).join('\n');
    
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    try {
        const info = await transporter.sendMail({
          from: `"VicqaTradeHub" <${emailUser}>`,
          to: adminContact,
          subject: subject,
          text: body,
        });
        console.log("----- EMAIL NOTIFICATION SENT SUCCESSFULLY -----");
        console.log("Message sent: %s", info.messageId);
        console.log("Response from mail server: %s", info.response);
    } catch (error) {
        console.error("----- FAILED TO SEND EMAIL NOTIFICATION -----", error);
    }
}


export async function POST(req: NextRequest) {
    try {
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
            return new NextResponse('Webhook configuration error', { status: 500 });
        }

        const body = await req.text();
        const hash = crypto.createHmac('sha512', secret)
            .update(body)
            .digest('hex');

        const signature = req.headers.get('x-paystack-signature');

        if (hash !== signature) {
            console.warn("Invalid Paystack signature. This might be a test webhook from the Paystack dashboard.");
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const payload = JSON.parse(body);
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

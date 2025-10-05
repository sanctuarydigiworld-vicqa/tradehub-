
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

async function sendAdminNotificationSms(payload: any) {
    console.log("----- ATTEMPTING TO SEND ADMIN SMS NOTIFICATION -----");
    const { event, data } = payload;
    
    if (event !== 'charge.success') {
        console.log(`Webhook received non-charge event for SMS: ${event}. Ignoring.`);
        return;
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER; // Your personal phone number

    if (!accountSid || !authToken || !twilioPhoneNumber || !adminPhoneNumber) {
        console.error("CRITICAL: Twilio SMS credentials or ADMIN_PHONE_NUMBER are not fully set in .env file.");
        return;
    }

    console.log(`Twilio configured to send from: ${twilioPhoneNumber} to ${adminPhoneNumber}`);

    const client = twilio(accountSid, authToken);

    const customerName = data.metadata?.name || data.customer?.name || 'A Customer';
    const totalAmount = (data.amount / 100).toFixed(2);
    const currency = data.currency;

    const body = `New VicqaTradeHub Order!\nRef: ${data.reference}\nCust: ${customerName}\nTotal: ${currency} ${totalAmount}`;

    try {
        const message = await client.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: adminPhoneNumber,
        });
        console.log("----- TWILIO SMS SENT SUCCESSFULLY -----");
        console.log("Message SID: %s", message.sid);
    } catch (error) {
        console.error("----- FAILED TO SEND TWILIO SMS -----");
        console.error(error);
    }
}

async function sendAdminNotificationEmail(payload: any) {
    console.log("----- ATTEMPTING TO SEND ADMIN EMAIL NOTIFICATION -----");
    const { event, data } = payload;

    if (event !== 'charge.success') {
        console.log(`Webhook received non-charge event for Email: ${event}. Ignoring.`);
        return;
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL_OR_SMS_GATEWAY;

    if (!emailUser || !emailPass || !adminEmail) {
        console.error("CRITICAL: Email credentials (EMAIL_USER, EMAIL_PASSWORD) or ADMIN_EMAIL_OR_SMS_GATEWAY are not fully set in .env file.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    const customerName = data.metadata?.name || data.customer?.name || 'A Customer';
    const totalAmount = (data.amount / 100).toFixed(2);
    const currency = data.currency;
    const subject = `New VicqaTradeHub Order: ${data.reference}`;
    const text = `New VicqaTradeHub Order!\nRef: ${data.reference}\nCust: ${customerName}\nTotal: ${currency} ${totalAmount}`;

    const mailOptions = {
        from: `"VicqaTradeHub Alert" <${emailUser}>`,
        to: adminEmail,
        subject: subject,
        text: text,
    };

    try {
        console.log(`Attempting to send email from ${emailUser} to ${adminEmail}`);
        const info = await transporter.sendMail(mailOptions);
        console.log("----- NODEMAILER EMAIL SENT SUCCESSFULLY -----");
        console.log("Message ID: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("----- FAILED TO SEND NODEMAILER EMAIL -----");
        console.error(error);
    }
}


export async function POST(req: NextRequest) {
    try {
        const isSimulated = req.headers.get('x-studio-simulated-webhook') === 'true';
        let payload;
        
        if (isSimulated) {
            console.log("Processing simulated webhook for zero-amount order.");
            payload = await req.json();
        } else {
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
                console.warn("Invalid Paystack signature received. This could be a test webhook or a malicious request.");
                return new NextResponse('Invalid signature', { status: 401 });
            }
            payload = JSON.parse(body);
        }

        // Trigger both notifications
        await Promise.all([
            sendAdminNotificationSms(payload),
            sendAdminNotificationEmail(payload)
        ]);

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

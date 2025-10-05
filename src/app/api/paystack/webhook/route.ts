
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import twilio from 'twilio';

async function sendAdminNotification(payload: any) {
    console.log("----- ATTEMPTING TO SEND ADMIN SMS NOTIFICATION -----");
    const { event, data } = payload;
    
    if (event !== 'charge.success') {
        console.log(`Webhook received non-charge event: ${event}. Ignoring.`);
        return;
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER; // Your personal phone number

    if (!accountSid || !authToken || !twilioPhoneNumber || !adminPhoneNumber) {
        console.error("CRITICAL: Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) or ADMIN_PHONE_NUMBER are not set in .env file.");
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
        console.error("----- FAILED TO SEND TWILIO SMS -----", error);
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

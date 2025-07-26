import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Incoming body:", body);

    const { productName, quantity, unit, mobile } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("❌ Missing Telegram bot credentials");
      return NextResponse.json({ error: "Bot credentials missing" }, { status: 500 });
    }

    const message = `📦 *New Enquiry Received*:\n\n🛍️ Product: *${productName}*\n📦 Quantity: *${quantity} ${unit}*\n📱 Mobile: *+91 ${mobile}*`;

    const telegramApi = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await fetch(telegramApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const result = await res.json();
    console.log("✅ Telegram response:", result);

    if (!res.ok) throw new Error(`Telegram API Error: ${JSON.stringify(result)}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔥 Telegram API Failed:", error.message);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
